import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword, verifyPassword, isAuthenticated } from "../lib/auth.js";
import { RegisterUserBody, LoginUserBody } from "@workspace/api-zod";

const router = Router();

router.post("/register", async (req: any, res: any) => {
  try {
    const parsed = RegisterUserBody.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Données invalides" });
    }
    const { nom, email, motDePasse } = parsed.data;

    const existing = await db.select().from(usersTable).where(eq(usersTable.email, email));
    if (existing.length > 0) {
      return res.status(400).json({ error: "Un compte avec cet email existe déjà" });
    }

    const motDePasseHash = await hashPassword(motDePasse);
    const [user] = await db.insert(usersTable).values({ nom, email, motDePasseHash, role: "etudiant" }).returning();

    (req.session as any).save(user.id, user.role);

    return res.status(201).json({
      user: {
        id: user.id,
        nom: user.nom,
        email: user.email,
        role: user.role,
        dateInscription: user.dateInscription,
      },
      message: "Compte créé avec succès",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

router.post("/login", async (req: any, res: any) => {
  try {
    const parsed = LoginUserBody.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Données invalides" });
    }
    const { email, motDePasse } = parsed.data;

    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));
    if (!user) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect" });
    }

    const valid = await verifyPassword(motDePasse, user.motDePasseHash);
    if (!valid) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect" });
    }

    (req.session as any).save(user.id, user.role);

    return res.json({
      user: {
        id: user.id,
        nom: user.nom,
        email: user.email,
        role: user.role,
        dateInscription: user.dateInscription,
      },
      message: "Connexion réussie",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

router.post("/logout", (req: any, res: any) => {
  (req.session as any).destroy();
  return res.json({ message: "Déconnexion réussie" });
});

router.get("/me", isAuthenticated, async (req: any, res: any) => {
  try {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.session.userId));
    if (!user) {
      return res.status(401).json({ error: "Utilisateur introuvable" });
    }
    return res.json({
      id: user.id,
      nom: user.nom,
      email: user.email,
      role: user.role,
      dateInscription: user.dateInscription,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
