import { pgTable, serial, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const difficulteEnum = pgEnum("difficulte", ["debutant", "intermediaire", "avance"]);

export const coursesTable = pgTable("courses", {
  id: serial("id").primaryKey(),
  titre: text("titre").notNull(),
  description: text("description").notNull(),
  contenu: text("contenu"),
  chapitre: text("chapitre").notNull(),
  difficulte: difficulteEnum("difficulte").notNull(),
  pdfUrl: text("pdf_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertCourseSchema = createInsertSchema(coursesTable).omit({ id: true, createdAt: true });
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type Course = typeof coursesTable.$inferSelect;
