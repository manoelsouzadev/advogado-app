import { 
  clients, cases, activities, hearings, documents, financial, communications,
  type Client, type InsertClient,
  type Case, type InsertCase, type CaseWithClient, type CaseWithRelations,
  type Activity, type InsertActivity,
  type Hearing, type InsertHearing,
  type Document, type InsertDocument,
  type Financial, type InsertFinancial,
  type Communication, type InsertCommunication
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc, and, or, like, gte, lte, sql } from "drizzle-orm";

export interface IStorage {
  // Clients
  getClients(): Promise<Client[]>;
  getClient(id: number): Promise<Client | undefined>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: number, client: Partial<InsertClient>): Promise<Client>;
  deleteClient(id: number): Promise<void>;

  // Cases
  getCases(): Promise<CaseWithClient[]>;
  getCase(id: number): Promise<CaseWithRelations | undefined>;
  getCasesByClient(clientId: number): Promise<CaseWithClient[]>;
  createCase(caseData: InsertCase): Promise<Case>;
  updateCase(id: number, caseData: Partial<InsertCase>): Promise<Case>;
  deleteCase(id: number): Promise<void>;
  searchCases(query: string): Promise<CaseWithClient[]>;

  // Activities
  getActivities(caseId: number): Promise<Activity[]>;
  getUpcomingDeadlines(limit?: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  updateActivity(id: number, activity: Partial<InsertActivity>): Promise<Activity>;
  deleteActivity(id: number): Promise<void>;

  // Hearings
  getHearings(caseId: number): Promise<Hearing[]>;
  getAllHearings(): Promise<Hearing[]>;
  getTodayHearings(): Promise<Hearing[]>;
  createHearing(hearing: InsertHearing): Promise<Hearing>;
  updateHearing(id: number, hearing: Partial<InsertHearing>): Promise<Hearing>;
  deleteHearing(id: number): Promise<void>;

  // Documents
  getDocuments(caseId: number): Promise<Document[]>;
  getAllDocuments(): Promise<Document[]>;
  createDocument(document: InsertDocument): Promise<Document>;
  deleteDocument(id: number): Promise<void>;

  // Financial
  getFinancial(caseId: number): Promise<Financial[]>;
  getPendingFees(): Promise<Financial[]>;
  createFinancialRecord(record: InsertFinancial): Promise<Financial>;
  updateFinancialRecord(id: number, record: Partial<InsertFinancial>): Promise<Financial>;
  deleteFinancialRecord(id: number): Promise<void>;

  // Communications
  getCommunications(caseId: number): Promise<Communication[]>;
  createCommunication(communication: InsertCommunication): Promise<Communication>;

  // Dashboard stats
  getDashboardStats(): Promise<{
    activeProcesses: number;
    upcomingDeadlines: number;
    todayHearings: number;
    pendingFees: string;
  }>;
}

export class DatabaseStorage implements IStorage {
  // Clients
  async getClients(): Promise<Client[]> {
    return await db.select().from(clients).orderBy(asc(clients.name));
  }

  async getClient(id: number): Promise<Client | undefined> {
    const [client] = await db.select().from(clients).where(eq(clients.id, id));
    return client || undefined;
  }

  async createClient(client: InsertClient): Promise<Client> {
    const [newClient] = await db.insert(clients).values(client).returning();
    return newClient;
  }

  async updateClient(id: number, client: Partial<InsertClient>): Promise<Client> {
    const [updatedClient] = await db
      .update(clients)
      .set(client)
      .where(eq(clients.id, id))
      .returning();
    return updatedClient;
  }

  async deleteClient(id: number): Promise<void> {
    await db.delete(clients).where(eq(clients.id, id));
  }

  // Cases
  async getCases(): Promise<CaseWithClient[]> {
    return await db
      .select()
      .from(cases)
      .leftJoin(clients, eq(cases.clientId, clients.id))
      .orderBy(desc(cases.updatedAt))
      .then(rows => rows.map(row => ({
        ...row.cases,
        client: row.clients!
      })));
  }

  async getCase(id: number): Promise<CaseWithRelations | undefined> {
    const [caseData] = await db
      .select()
      .from(cases)
      .leftJoin(clients, eq(cases.clientId, clients.id))
      .where(eq(cases.id, id));

    if (!caseData) return undefined;

    const [caseActivities, caseHearings, caseDocuments, caseFinancial, caseCommunications] = await Promise.all([
      db.select().from(activities).where(eq(activities.caseId, id)).orderBy(desc(activities.createdAt)),
      db.select().from(hearings).where(eq(hearings.caseId, id)).orderBy(desc(hearings.date)),
      db.select().from(documents).where(eq(documents.caseId, id)).orderBy(desc(documents.uploadedAt)),
      db.select().from(financial).where(eq(financial.caseId, id)).orderBy(desc(financial.createdAt)),
      db.select().from(communications).where(eq(communications.caseId, id)).orderBy(desc(communications.date))
    ]);

    return {
      ...caseData.cases,
      client: caseData.clients!,
      activities: caseActivities,
      hearings: caseHearings,
      documents: caseDocuments,
      financial: caseFinancial,
      communications: caseCommunications
    };
  }

  async getCasesByClient(clientId: number): Promise<CaseWithClient[]> {
    return await db
      .select()
      .from(cases)
      .leftJoin(clients, eq(cases.clientId, clients.id))
      .where(eq(cases.clientId, clientId))
      .orderBy(desc(cases.updatedAt))
      .then(rows => rows.map(row => ({
        ...row.cases,
        client: row.clients!
      })));
  }

  async createCase(caseData: InsertCase): Promise<Case> {
    const [newCase] = await db.insert(cases).values(caseData).returning();
    return newCase;
  }

  async updateCase(id: number, caseData: Partial<InsertCase>): Promise<Case> {
    const [updatedCase] = await db
      .update(cases)
      .set({ ...caseData, updatedAt: new Date() })
      .where(eq(cases.id, id))
      .returning();
    return updatedCase;
  }

  async deleteCase(id: number): Promise<void> {
    await db.delete(cases).where(eq(cases.id, id));
  }

  async searchCases(query: string): Promise<CaseWithClient[]> {
    return await db
      .select()
      .from(cases)
      .leftJoin(clients, eq(cases.clientId, clients.id))
      .where(
        or(
          like(cases.processNumber, `%${query}%`),
          like(cases.plaintiff, `%${query}%`),
          like(cases.defendant, `%${query}%`),
          like(clients.name, `%${query}%`)
        )
      )
      .orderBy(desc(cases.updatedAt))
      .then(rows => rows.map(row => ({
        ...row.cases,
        client: row.clients!
      })));
  }

  // Activities
  async getActivities(caseId: number): Promise<Activity[]> {
    return await db
      .select()
      .from(activities)
      .where(eq(activities.caseId, caseId))
      .orderBy(asc(activities.dueDate));
  }

  async getUpcomingDeadlines(limit = 10): Promise<Activity[]> {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(now.getDate() + 30); // Next 30 days

    return await db
      .select()
      .from(activities)
      .where(
        and(
          eq(activities.type, 'deadline'),
          eq(activities.completed, false),
          gte(activities.dueDate, now),
          lte(activities.dueDate, futureDate)
        )
      )
      .orderBy(asc(activities.dueDate))
      .limit(limit);
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    const [newActivity] = await db.insert(activities).values(activity).returning();
    return newActivity;
  }

  async updateActivity(id: number, activity: Partial<InsertActivity>): Promise<Activity> {
    const [updatedActivity] = await db
      .update(activities)
      .set(activity)
      .where(eq(activities.id, id))
      .returning();
    return updatedActivity;
  }

  async deleteActivity(id: number): Promise<void> {
    await db.delete(activities).where(eq(activities.id, id));
  }

  // Hearings
  async getHearings(caseId: number): Promise<Hearing[]> {
    return await db
      .select()
      .from(hearings)
      .where(eq(hearings.caseId, caseId))
      .orderBy(asc(hearings.date));
  }

  async getAllHearings(): Promise<Hearing[]> {
    return await db
      .select()
      .from(hearings)
      .orderBy(asc(hearings.date));
  }

  async getTodayHearings(): Promise<Hearing[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    return await db
      .select()
      .from(hearings)
      .where(
        and(
          gte(hearings.date, today),
          lte(hearings.date, tomorrow),
          eq(hearings.completed, false)
        )
      )
      .orderBy(asc(hearings.date));
  }

  async createHearing(hearing: InsertHearing): Promise<Hearing> {
    const [newHearing] = await db.insert(hearings).values(hearing).returning();
    return newHearing;
  }

  async updateHearing(id: number, hearing: Partial<InsertHearing>): Promise<Hearing> {
    const [updatedHearing] = await db
      .update(hearings)
      .set(hearing)
      .where(eq(hearings.id, id))
      .returning();
    return updatedHearing;
  }

  async deleteHearing(id: number): Promise<void> {
    await db.delete(hearings).where(eq(hearings.id, id));
  }

  // Documents
  async getDocuments(caseId: number): Promise<Document[]> {
    return await db
      .select()
      .from(documents)
      .where(eq(documents.caseId, caseId))
      .orderBy(desc(documents.uploadedAt));
  }

  async getAllDocuments(): Promise<Document[]> {
    return await db
      .select()
      .from(documents)
      .orderBy(desc(documents.uploadedAt));
  }

  async createDocument(document: InsertDocument): Promise<Document> {
    const [newDocument] = await db.insert(documents).values(document).returning();
    return newDocument;
  }

  async deleteDocument(id: number): Promise<void> {
    await db.delete(documents).where(eq(documents.id, id));
  }

  // Financial
  async getFinancial(caseId: number): Promise<Financial[]> {
    return await db
      .select()
      .from(financial)
      .where(eq(financial.caseId, caseId))
      .orderBy(desc(financial.createdAt));
  }

  async getPendingFees(): Promise<Financial[]> {
    return await db
      .select()
      .from(financial)
      .where(eq(financial.status, 'pending'))
      .orderBy(asc(financial.dueDate));
  }

  async createFinancialRecord(record: InsertFinancial): Promise<Financial> {
    const [newRecord] = await db.insert(financial).values(record).returning();
    return newRecord;
  }

  async updateFinancialRecord(id: number, record: Partial<InsertFinancial>): Promise<Financial> {
    const [updatedRecord] = await db
      .update(financial)
      .set(record)
      .where(eq(financial.id, id))
      .returning();
    return updatedRecord;
  }

  async deleteFinancialRecord(id: number): Promise<void> {
    await db.delete(financial).where(eq(financial.id, id));
  }

  // Communications
  async getCommunications(caseId: number): Promise<Communication[]> {
    return await db
      .select()
      .from(communications)
      .where(eq(communications.caseId, caseId))
      .orderBy(desc(communications.date));
  }

  async createCommunication(communication: InsertCommunication): Promise<Communication> {
    const [newCommunication] = await db.insert(communications).values(communication).returning();
    return newCommunication;
  }

  // Dashboard stats
  async getDashboardStats(): Promise<{
    activeProcesses: number;
    upcomingDeadlines: number;
    todayHearings: number;
    pendingFees: string;
  }> {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(now.getDate() + 7); // Next 7 days

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const [activeProcessesResult, upcomingDeadlinesResult, todayHearingsResult, pendingFeesResult] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(cases).where(eq(cases.status, 'ongoing')),
      db.select({ count: sql<number>`count(*)` }).from(activities).where(
        and(
          eq(activities.type, 'deadline'),
          eq(activities.completed, false),
          gte(activities.dueDate, now),
          lte(activities.dueDate, futureDate)
        )
      ),
      db.select({ count: sql<number>`count(*)` }).from(hearings).where(
        and(
          gte(hearings.date, today),
          lte(hearings.date, tomorrow),
          eq(hearings.completed, false)
        )
      ),
      db.select({ total: sql<string>`sum(amount)` }).from(financial).where(eq(financial.status, 'pending'))
    ]);

    return {
      activeProcesses: activeProcessesResult[0]?.count || 0,
      upcomingDeadlines: upcomingDeadlinesResult[0]?.count || 0,
      todayHearings: todayHearingsResult[0]?.count || 0,
      pendingFees: pendingFeesResult[0]?.total || '0',
    };
  }
}

export const storage = new DatabaseStorage();
