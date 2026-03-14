import { pgTable, serial, integer, real, timestamp, text, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";
import { typeAbonnementEnum } from "./subscriptions";

export const paymentStatutEnum = pgEnum("payment_statut", ["en_attente", "confirmé", "rejeté"]);

export const paymentsTable = pgTable("payments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  typeAbonnement: typeAbonnementEnum("type_abonnement").notNull(),
  montant: real("montant").notNull(),
  date: timestamp("date").notNull().defaultNow(),
  statut: paymentStatutEnum("statut").notNull().default("en_attente"),
  captureEcran: text("capture_ecran"),
});

export const insertPaymentSchema = createInsertSchema(paymentsTable).omit({ id: true, date: true });
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Payment = typeof paymentsTable.$inferSelect;
