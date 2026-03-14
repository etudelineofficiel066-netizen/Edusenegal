import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { exercisesTable } from "./exercises";

export const solutionsTable = pgTable("solutions", {
  id: serial("id").primaryKey(),
  exerciseId: integer("exercise_id").notNull().unique().references(() => exercisesTable.id, { onDelete: "cascade" }),
  contenu: text("contenu").notNull(),
});

export const insertSolutionSchema = createInsertSchema(solutionsTable).omit({ id: true });
export type InsertSolution = z.infer<typeof insertSolutionSchema>;
export type Solution = typeof solutionsTable.$inferSelect;
