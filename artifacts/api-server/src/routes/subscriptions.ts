import { Router } from "express";
import { db } from "@workspace/db";
import { subscriptionsTable, usersTable, paymentsTable } from "@workspace/db/schema";
import { eq, and, gte, desc } from "drizzle-orm";
import { isAuthenticated, isAdmin } from "../lib/auth.js";

const router = Router();

router.get("/my", isAuthenticated, async (req: any, res: any) => {
  try {
    const now = new Date();
    const [sub] = await db
      .select()
      .from(subscriptionsTable)
      .where(
        and(
          eq(subscriptionsTable.userId, req.session.userId),
          eq(subscriptionsTable.statut, "actif"),
          gte(subscriptionsTable.dateFin, now)
        )
      )
      .orderBy(desc(subscriptionsTable.dateFin))
      .limit(1);

    if (!sub) return res.status(404).json({ error: "Aucun abonnement actif" });
    return res.json(sub);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

router.get("/history", isAuthenticated, async (req: any, res: any) => {
  try {
    const subscriptions = await db
      .select()
      .from(subscriptionsTable)
      .where(eq(subscriptionsTable.userId, req.session.userId))
      .orderBy(desc(subscriptionsTable.dateDebut));

    const payments = await db
      .select()
      .from(paymentsTable)
      .where(eq(paymentsTable.userId, req.session.userId))
      .orderBy(desc(paymentsTable.date));

    return res.json({ subscriptions, payments });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

router.get("/", isAdmin, async (_req: any, res: any) => {
  try {
    const subs = await db
      .select({
        id: subscriptionsTable.id,
        userId: subscriptionsTable.userId,
        userNom: usersTable.nom,
        userEmail: usersTable.email,
        typeAbonnement: subscriptionsTable.typeAbonnement,
        dateDebut: subscriptionsTable.dateDebut,
        dateFin: subscriptionsTable.dateFin,
        statut: subscriptionsTable.statut,
      })
      .from(subscriptionsTable)
      .leftJoin(usersTable, eq(subscriptionsTable.userId, usersTable.id))
      .orderBy(desc(subscriptionsTable.dateDebut));

    return res.json(subs);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
