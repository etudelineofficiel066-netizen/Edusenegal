import { Router } from "express";
import { db } from "@workspace/db";
import { paymentsTable, subscriptionsTable, usersTable } from "@workspace/db/schema";
import { eq, desc } from "drizzle-orm";
import { isAuthenticated, isAdmin } from "../lib/auth.js";
import { SubmitPaymentBody } from "@workspace/api-zod";
import path from "path";
import fs from "fs";
import multer from "multer";

const AMOUNTS: Record<string, number> = {
  "1_mois": 1000,
  "3_mois": 2000,
  "9_mois": 3000,
};

const DURATIONS_MONTHS: Record<string, number> = {
  "1_mois": 1,
  "3_mois": 3,
  "9_mois": 9,
};

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (_req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

export const uploadRouter = Router();

uploadRouter.post("/upload/payment-screenshot", isAuthenticated, upload.single("file"), (req: any, res: any) => {
  if (!req.file) return res.status(400).json({ error: "Fichier requis" });
  const url = `/api/uploads/${req.file.filename}`;
  return res.json({ url });
});

uploadRouter.use("/uploads", (req: any, res: any, next: any) => {
  const filePath = path.join(uploadDir, path.basename(req.path));
  res.sendFile(filePath, (err: any) => {
    if (err) next();
  });
});

export const paymentsRouter = Router();

paymentsRouter.post("/", isAuthenticated, async (req: any, res: any) => {
  try {
    const parsed = SubmitPaymentBody.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Données invalides" });
    }
    const { typeAbonnement, captureEcran } = parsed.data;
    const montant = AMOUNTS[typeAbonnement] || 0;

    const [payment] = await db
      .insert(paymentsTable)
      .values({
        userId: req.session.userId,
        typeAbonnement,
        montant,
        statut: "en_attente",
        captureEcran: captureEcran ?? null,
      })
      .returning();

    return res.status(201).json(payment);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

paymentsRouter.get("/pending", isAdmin, async (_req: any, res: any) => {
  try {
    const payments = await db
      .select({
        id: paymentsTable.id,
        userId: paymentsTable.userId,
        userNom: usersTable.nom,
        userEmail: usersTable.email,
        typeAbonnement: paymentsTable.typeAbonnement,
        montant: paymentsTable.montant,
        date: paymentsTable.date,
        statut: paymentsTable.statut,
        captureEcran: paymentsTable.captureEcran,
      })
      .from(paymentsTable)
      .leftJoin(usersTable, eq(paymentsTable.userId, usersTable.id))
      .where(eq(paymentsTable.statut, "en_attente"))
      .orderBy(desc(paymentsTable.date));

    return res.json(payments);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

paymentsRouter.post("/:id/validate", isAdmin, async (req: any, res: any) => {
  try {
    const id = parseInt(req.params.id);

    const [payment] = await db
      .update(paymentsTable)
      .set({ statut: "confirmé" })
      .where(eq(paymentsTable.id, id))
      .returning();

    if (!payment) return res.status(404).json({ error: "Paiement introuvable" });

    const months = DURATIONS_MONTHS[payment.typeAbonnement] || 1;
    const dateDebut = new Date();
    const dateFin = new Date(dateDebut);
    dateFin.setMonth(dateFin.getMonth() + months);

    await db.insert(subscriptionsTable).values({
      userId: payment.userId,
      typeAbonnement: payment.typeAbonnement,
      dateDebut,
      dateFin,
      statut: "actif",
    });

    return res.json({ message: "Paiement validé et abonnement activé" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

paymentsRouter.post("/:id/reject", isAdmin, async (req: any, res: any) => {
  try {
    const id = parseInt(req.params.id);
    const [payment] = await db
      .update(paymentsTable)
      .set({ statut: "rejeté" })
      .where(eq(paymentsTable.id, id))
      .returning();

    if (!payment) return res.status(404).json({ error: "Paiement introuvable" });
    return res.json({ message: "Paiement rejeté" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
});
