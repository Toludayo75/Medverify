import { mysqlTable, text, int, boolean, timestamp, mysqlEnum } from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users table
export const users = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phoneNumber: text("phone_number"),
  role: text("role").notNull().default('user'),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Drugs table
export const drugs = mysqlTable("drugs", {
  id: int("id").primaryKey().autoincrement(),
  nafdacNumber: text("nafdac_number").notNull().unique(),
  productName: text("product_name").notNull(),
  manufacturer: text("manufacturer").notNull(),
  dosageForm: text("dosage_form").notNull(),
  strength: text("strength").notNull(),
  status: text("status").notNull().default('genuine'),
  isBlacklisted: boolean("is_blacklisted").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

// Batches table
export const batches = mysqlTable("batches", {
  id: int("id").primaryKey().autoincrement(),
  drugId: int("drug_id").notNull(),
  batchNumber: text("batch_number").notNull(),
  manufactureDate: text("manufacture_date").notNull(),
  expiryDate: text("expiry_date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Verifications table
export const verifications = mysqlTable("verifications", {
  id: int("id").primaryKey().autoincrement(),
  drugId: int("drug_id"),
  batchId: int("batch_id"),
  userId: int("user_id"),
  status: text("status").notNull(),
  ipAddress: text("ip_address"),
  location: text("location"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Reports table
export const reports = mysqlTable("reports", {
  id: int("id").primaryKey().autoincrement(),
  reporterId: int("reporter_id"),
  drugId: int("drug_id"),
  batchNumber: text("batch_number"),
  nafdacNumber: text("nafdac_number"),
  productName: text("product_name"),
  manufacturer: text("manufacturer"),
  suspectedIssue: text("suspected_issue").notNull(),
  description: text("description").notNull(),
  reporterContact: text("reporter_contact"),
  purchaseLocation: text("purchase_location"),
  status: text("status").notNull().default('pending'),
  ipAddress: text("ip_address"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  verifications: many(verifications),
  reports: many(reports),
}));

export const drugsRelations = relations(drugs, ({ many }) => ({
  batches: many(batches),
  verifications: many(verifications),
  reports: many(reports),
}));

export const batchesRelations = relations(batches, ({ one, many }) => ({
  drug: one(drugs, {
    fields: [batches.drugId],
    references: [drugs.id],
  }),
  verifications: many(verifications),
}));

export const verificationsRelations = relations(verifications, ({ one }) => ({
  drug: one(drugs, {
    fields: [verifications.drugId],
    references: [drugs.id],
  }),
  batch: one(batches, {
    fields: [verifications.batchId],
    references: [batches.id],
  }),
  user: one(users, {
    fields: [verifications.userId],
    references: [users.id],
  }),
}));

export const reportsRelations = relations(reports, ({ one }) => ({
  reporter: one(users, {
    fields: [reports.reporterId],
    references: [users.id],
  }),
  drug: one(drugs, {
    fields: [reports.drugId],
    references: [drugs.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertDrugSchema = createInsertSchema(drugs).omit({ id: true, createdAt: true, updatedAt: true });
export const insertBatchSchema = createInsertSchema(batches).omit({ id: true, createdAt: true });
export const insertVerificationSchema = createInsertSchema(verifications).omit({ id: true, createdAt: true });
export const insertReportSchema = createInsertSchema(reports).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
}).extend({
  reporterId: z.number().optional(),
  drugId: z.number().optional(),
  nafdacNumber: z.string().optional(),
  batchNumber: z.string().optional(),
  productName: z.string().optional(),
  manufacturer: z.string().optional(),
  reporterContact: z.string().optional(),
  ipAddress: z.string().optional(),
  purchaseLocation: z.string().optional(),
  suspectedIssue: z.string().min(1, "Please select a reason"),
  description: z.string().min(1, "Details are required")
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Drug = typeof drugs.$inferSelect;
export type InsertDrug = z.infer<typeof insertDrugSchema>;
export type Batch = typeof batches.$inferSelect;
export type InsertBatch = z.infer<typeof insertBatchSchema>;
export type Verification = typeof verifications.$inferSelect;
export type InsertVerification = z.infer<typeof insertVerificationSchema>;
export type Report = typeof reports.$inferSelect;
export type InsertReport = z.infer<typeof insertReportSchema>;