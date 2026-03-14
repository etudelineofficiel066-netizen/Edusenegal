import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db/schema";
import { isAdmin } from "../lib/auth.js";

const router = Router();

router.get("/", isAdmin, async (_req: any, res: any) => {
  try {
    const users = await db.select({
      id: usersTable.id,
      nom: usersTable.nom,
      email: usersTable.email,
      role: usersTable.role,
      dateInscription: usersTable.dateInscription,
    }).from(usersTable);
    return res.json(users);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
