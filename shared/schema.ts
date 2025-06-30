import { pgTable, text, serial, integer, boolean, timestamp, decimal, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  document: text("document"), // CPF/CNPJ
  address: text("address"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const cases = pgTable("cases", {
  id: serial("id").primaryKey(),
  processNumber: text("process_number").notNull().unique(),
  court: text("court").notNull(),
  clientId: integer("client_id").references(() => clients.id).notNull(),
  actionType: text("action_type").notNull(),
  plaintiff: text("plaintiff").notNull(),
  defendant: text("defendant").notNull(),
  caseValue: decimal("case_value", { precision: 15, scale: 2 }),
  status: text("status").notNull().default("ongoing"), // ongoing, completed, suspended
  description: text("description"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  caseId: integer("case_id").references(() => cases.id).notNull(),
  type: text("type").notNull(), // deadline, hearing, petition, document
  title: text("title").notNull(),
  description: text("description"),
  dueDate: timestamp("due_date"),
  completed: boolean("completed").default(false).notNull(),
  priority: text("priority").default("medium").notNull(), // low, medium, high, urgent
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const hearings = pgTable("hearings", {
  id: serial("id").primaryKey(),
  caseId: integer("case_id").references(() => cases.id).notNull(),
  title: text("title").notNull(),
  date: timestamp("date").notNull(),
  location: text("location"),
  type: text("type").notNull(), // conciliation, instruction, judgment
  notes: text("notes"),
  completed: boolean("completed").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  caseId: integer("case_id").references(() => cases.id).notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  filePath: text("file_path"),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
});

export const financial = pgTable("financial", {
  id: serial("id").primaryKey(),
  caseId: integer("case_id").references(() => cases.id).notNull(),
  type: text("type").notNull(), // fee, cost, compensation
  description: text("description").notNull(),
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"), // pending, paid, overdue
  dueDate: timestamp("due_date"),
  paidDate: timestamp("paid_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const communications = pgTable("communications", {
  id: serial("id").primaryKey(),
  caseId: integer("case_id").references(() => cases.id).notNull(),
  clientId: integer("client_id").references(() => clients.id).notNull(),
  type: text("type").notNull(), // email, phone, meeting, letter
  subject: text("subject"),
  content: text("content"),
  date: timestamp("date").defaultNow().notNull(),
});

// Relations
export const clientsRelations = relations(clients, ({ many }) => ({
  cases: many(cases),
  communications: many(communications),
}));

export const casesRelations = relations(cases, ({ one, many }) => ({
  client: one(clients, {
    fields: [cases.clientId],
    references: [clients.id],
  }),
  activities: many(activities),
  hearings: many(hearings),
  documents: many(documents),
  financial: many(financial),
  communications: many(communications),
}));

export const activitiesRelations = relations(activities, ({ one }) => ({
  case: one(cases, {
    fields: [activities.caseId],
    references: [cases.id],
  }),
}));

export const hearingsRelations = relations(hearings, ({ one }) => ({
  case: one(cases, {
    fields: [hearings.caseId],
    references: [cases.id],
  }),
}));

export const documentsRelations = relations(documents, ({ one }) => ({
  case: one(cases, {
    fields: [documents.caseId],
    references: [cases.id],
  }),
}));

export const financialRelations = relations(financial, ({ one }) => ({
  case: one(cases, {
    fields: [financial.caseId],
    references: [cases.id],
  }),
}));

export const communicationsRelations = relations(communications, ({ one }) => ({
  case: one(cases, {
    fields: [communications.caseId],
    references: [cases.id],
  }),
  client: one(clients, {
    fields: [communications.clientId],
    references: [clients.id],
  }),
}));

// Insert schemas
export const insertClientSchema = createInsertSchema(clients).omit({
  id: true,
  createdAt: true,
});

export const insertCaseSchema = createInsertSchema(cases).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
  createdAt: true,
});

export const insertHearingSchema = createInsertSchema(hearings).omit({
  id: true,
  createdAt: true,
});

export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  uploadedAt: true,
});

export const insertFinancialSchema = createInsertSchema(financial).omit({
  id: true,
  createdAt: true,
});

export const insertCommunicationSchema = createInsertSchema(communications).omit({
  id: true,
  date: true,
});

// Types
export type Client = typeof clients.$inferSelect;
export type InsertClient = z.infer<typeof insertClientSchema>;

export type Case = typeof cases.$inferSelect;
export type InsertCase = z.infer<typeof insertCaseSchema>;

export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;

export type Hearing = typeof hearings.$inferSelect;
export type InsertHearing = z.infer<typeof insertHearingSchema>;

export type Document = typeof documents.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;

export type Financial = typeof financial.$inferSelect;
export type InsertFinancial = z.infer<typeof insertFinancialSchema>;

export type Communication = typeof communications.$inferSelect;
export type InsertCommunication = z.infer<typeof insertCommunicationSchema>;

// Extended types for queries with relations
export type CaseWithClient = Case & { client: Client };
export type CaseWithRelations = Case & { 
  client: Client;
  activities: Activity[];
  hearings: Hearing[];
  documents: Document[];
  financial: Financial[];
  communications: Communication[];
};
