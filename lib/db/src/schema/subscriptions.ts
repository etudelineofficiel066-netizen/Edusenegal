import { pgTable, serial, integer, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const typeAbonnementEnum = pgEnum("type_abonnement", ["1_mois", "3_mois", "9_mois"]);
export const subscriptionStatutEnum = pgEnum("subscription_statut", ["actif", "expiré", "annulé"]);

export const subscriptionsTable = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  typeAbonnement: typeAbonnementEnum("type_abonnement").notNull(),
  dateDebut: timestamp("date_debut").notNull().defaultNow(),
  dateFin: timestamp("date_fin").notNull(),
  statut: subscriptionStatutEnum("statut").notNull().default("actif"),
});

export const insertSubscriptionSchema = createInsertSchema(subscriptionsTable).omit({ id: true });
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type Subscription = typeof subscriptionsTable.$inferSelect;
