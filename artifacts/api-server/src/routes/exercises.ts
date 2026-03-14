import { Router } from "express";
import { db } from "@workspace/db";
import { exercisesTable, solutionsTable, subscriptionsTable } from "@workspace/db/schema";
import { eq, and, gte } from "drizzle-orm";
import { isAuthenticated, isAdmin } from "../lib/auth.js";
import { CreateExerciseBody } from "@workspace/api-zod";

const router = Router();

async function hasActiveSubscription(userId: number): Promise<boolean> {
  const now = new Date();
  const subs = await db
    .select()
    .from(subscriptionsTable)
    .where(
      and(
        eq(subscriptionsTable.userId, userId),
        eq(subscriptionsTable.statut, "actif"),
        gte(subscriptionsTable.dateFin, now)
      )
    );
  return subs.length > 0;
}

router.get("/courses/:courseId/exercises", isAuthenticated, async (req: any, res: any) => {
  try {
    const courseId = parseInt(req.params.courseId);
    const exercises = await db.select().from(exercisesTable).where(eq(exercisesTable.coursId, courseId));
    const solutions = await db.select().from(solutionsTable);
    const solutionExerciseIds = new Set(solutions.map((s: any) => s.exerciseId));

    return res.json(exercises.map((ex: any) => ({
      ...ex,
      hasSolution: solutionExerciseIds.has(ex.id),
    })));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

router.post("/exercises", isAdmin, async (req: any, res: any) => {
  try {
    const parsed = CreateExerciseBody.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Données invalides" });
    }
    const [exercise] = await db.insert(exercisesTable).values(parsed.data).returning();
    return res.status(201).json({ ...exercise, hasSolution: false });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

router.put("/exercises/:id", isAdmin, async (req: any, res: any) => {
  try {
    const id = parseInt(req.params.id);
    const parsed = CreateExerciseBody.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Données invalides" });
    }
    const [exercise] = await db.update(exercisesTable).set(parsed.data).where(eq(exercisesTable.id, id)).returning();
    if (!exercise) return res.status(404).json({ error: "Exercice introuvable" });
    const solution = await db.select().from(solutionsTable).where(eq(solutionsTable.exerciseId, id));
    return res.json({ ...exercise, hasSolution: solution.length > 0 });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

router.delete("/exercises/:id", isAdmin, async (req: any, res: any) => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(exercisesTable).where(eq(exercisesTable.id, id));
    return res.json({ message: "Exercice supprimé" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

router.get("/exercises/:id/solution", isAuthenticated, async (req: any, res: any) => {
  try {
    const id = parseInt(req.params.id);

    const canAccess = req.session.role === "admin" || await hasActiveSubscription(req.session.userId);
    if (!canAccess) {
      return res.status(403).json({ error: "Abonnement requis pour accéder aux solutions" });
    }

    const [solution] = await db.select().from(solutionsTable).where(eq(solutionsTable.exerciseId, id));
    if (!solution) return res.status(404).json({ error: "Solution introuvable" });
    return res.json(solution);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

router.post("/exercises/:id/solution", isAdmin, async (req: any, res: any) => {
  try {
    const exerciseId = parseInt(req.params.id);
    const { contenu } = req.body;
    if (!contenu) return res.status(400).json({ error: "Contenu requis" });

    const existing = await db.select().from(solutionsTable).where(eq(solutionsTable.exerciseId, exerciseId));
    if (existing.length > 0) {
      const [sol] = await db.update(solutionsTable).set({ contenu }).where(eq(solutionsTable.exerciseId, exerciseId)).returning();
      return res.json(sol);
    }

    const [solution] = await db.insert(solutionsTable).values({ exerciseId, contenu }).returning();
    return res.status(201).json(solution);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

router.put("/exercises/:id/solution", isAdmin, async (req: any, res: any) => {
  try {
    const exerciseId = parseInt(req.params.id);
    const { contenu } = req.body;
    if (!contenu) return res.status(400).json({ error: "Contenu requis" });

    const [solution] = await db.update(solutionsTable).set({ contenu }).where(eq(solutionsTable.exerciseId, exerciseId)).returning();
    if (!solution) return res.status(404).json({ error: "Solution introuvable" });
    return res.json(solution);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
