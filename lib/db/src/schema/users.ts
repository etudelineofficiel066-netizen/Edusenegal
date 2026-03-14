import { pgTable, serial, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const roleEnum = pgEnum("role", ["etudiant", "admin"]);

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  nom: text("nom").notNull(),
  email: text("email").notNull().unique(),
  motDePasseHash: text("mot_de_passe_hash").notNull(),
  role: roleEnum("role").notNull().default("etudiant"),
  dateInscription: timestamp("date_inscription").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(usersTable).omit({ id: true, dateInscription: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof usersTable.$inferSelect;
