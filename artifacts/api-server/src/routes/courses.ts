import { Router } from "express";
import { db } from "@workspace/db";
import { coursesTable, exercisesTable, solutionsTable, subscriptionsTable } from "@workspace/db/schema";
import { eq, and, gte, ilike, or } from "drizzle-orm";
import { isAuthenticated, isAdmin } from "../lib/auth.js";
import { CreateCourseBody } from "@workspace/api-zod";

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

router.get("/", isAuthenticated, async (req: any, res: any) => {
  try {
    const { search, chapter } = req.query as { search?: string; chapter?: string };

    let query = db.select({
      id: coursesTable.id,
      titre: coursesTable.titre,
      description: coursesTable.description,
      chapitre: coursesTable.chapitre,
      difficulte: coursesTable.difficulte,
      createdAt: coursesTable.createdAt,
    }).from(coursesTable);

    const conditions = [];
    if (search) {
      conditions.push(or(ilike(coursesTable.titre, `%${search}%`), ilike(coursesTable.description, `%${search}%`)));
    }
    if (chapter) {
      conditions.push(ilike(coursesTable.chapitre, `%${chapter}%`));
    }

    const courses = conditions.length > 0 ? await query.where(and(...conditions)) : await query;
    return res.json(courses);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

router.post("/", isAdmin, async (req: any, res: any) => {
  try {
    const parsed = CreateCourseBody.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Données invalides" });
    }
    const [course] = await db.insert(coursesTable).values(parsed.data).returning();
    return res.status(201).json(course);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

router.get("/:id", isAuthenticated, async (req: any, res: any) => {
  try {
    const id = parseInt(req.params.id);
    const [course] = await db.select().from(coursesTable).where(eq(coursesTable.id, id));
    if (!course) return res.status(404).json({ error: "Cours introuvable" });

    const hasAccess = req.session.role === "admin" || await hasActiveSubscription(req.session.userId);

    const exercises = await db.select().from(exercisesTable).where(eq(exercisesTable.coursId, id));
    const solutions = await db.select().from(solutionsTable);
    const solutionExerciseIds = new Set(solutions.map((s: any) => s.exerciseId));

    const exercisesWithSolution = exercises.map((ex: any) => ({
      ...ex,
      hasSolution: solutionExerciseIds.has(ex.id),
    }));

    return res.json({
      id: course.id,
      titre: course.titre,
      description: course.description,
      contenu: hasAccess ? course.contenu : null,
      chapitre: course.chapitre,
      difficulte: course.difficulte,
      pdfUrl: hasAccess ? course.pdfUrl : null,
      createdAt: course.createdAt,
      hasAccess,
      exercises: hasAccess ? exercisesWithSolution : [],
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

router.put("/:id", isAdmin, async (req: any, res: any) => {
  try {
    const id = parseInt(req.params.id);
    const parsed = CreateCourseBody.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Données invalides" });
    }
    const [course] = await db.update(coursesTable).set(parsed.data).where(eq(coursesTable.id, id)).returning();
    if (!course) return res.status(404).json({ error: "Cours introuvable" });
    return res.json(course);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

router.delete("/:id", isAdmin, async (req: any, res: any) => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(coursesTable).where(eq(coursesTable.id, id));
    return res.json({ message: "Cours supprimé" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
