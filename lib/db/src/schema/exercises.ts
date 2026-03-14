import { pgTable, serial, text, integer, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { coursesTable } from "./courses";

export const exerciseDifficulteEnum = pgEnum("exercise_difficulte", ["debutant", "intermediaire", "avance"]);

export const exercisesTable = pgTable("exercises", {
  id: serial("id").primaryKey(),
  coursId: integer("cours_id").notNull().references(() => coursesTable.id, { onDelete: "cascade" }),
  titre: text("titre").notNull(),
  contenu: text("contenu").notNull(),
  difficulte: exerciseDifficulteEnum("difficulte").notNull(),
});

export const insertExerciseSchema = createInsertSchema(exercisesTable).omit({ id: true });
export type InsertExercise = z.infer<typeof insertExerciseSchema>;
export type Exercise = typeof exercisesTable.$inferSelect;
