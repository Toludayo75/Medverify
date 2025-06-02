import { 
  users, 
  drugs, 
  batches, 
  verifications, 
  reports, 
  User, 
  InsertUser, 
  Drug, 
  InsertDrug, 
  Batch, 
  InsertBatch, 
  Verification, 
  InsertVerification, 
  Report, 
  InsertReport 
} from "@shared/schema";
import { db } from "./db";
import { eq, and, like, desc, asc, or } from "drizzle-orm";
import session from "express-session";
import MemoryStore from "memorystore";

const SessionStore = MemoryStore(session);

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Drug methods
  getDrug(id: number): Promise<Drug | undefined>;
  getDrugByNafdacNumber(nafdacNumber: string): Promise<Drug | undefined>;
  createDrug(drug: InsertDrug): Promise<Drug>;
  updateDrug(id: number, drug: Partial<Drug>): Promise<Drug | undefined>;
  getAllDrugs(): Promise<Drug[]>;
  searchDrugs(query: string): Promise<Drug[]>;
  
  // Batch methods
  getBatch(id: number): Promise<Batch | undefined>;
  getBatchByDrugAndBatchNumber(drugId: number, batchNumber: string): Promise<Batch | undefined>;
  createBatch(batch: InsertBatch): Promise<Batch>;
  
  // Verification methods
  createVerification(verification: InsertVerification): Promise<Verification>;
  getVerifications(limit?: number): Promise<Verification[]>;
  getVerificationsByUser(userId: number): Promise<Verification[]>;
  
  // Report methods
  createReport(report: InsertReport): Promise<Report>;
  getReports(status?: string): Promise<Report[]>;
  getReportById(id: number): Promise<Report | undefined>;
  updateReport(id: number, report: Partial<Report>): Promise<Report | undefined>;
  getReportsByUser(userId: number): Promise<Report[]>;
  
  // Session store
  sessionStore: any;
}

export class DatabaseStorage implements IStorage {
  sessionStore: any;
  
  constructor() {
    this.sessionStore = new SessionStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser);
    const insertId = result[0].insertId;
    const [user] = await db.select().from(users).where(eq(users.id, Number(insertId)));
    return user;
  }

  // Drug methods
  async getDrug(id: number): Promise<Drug | undefined> {
    const [drug] = await db.select().from(drugs).where(eq(drugs.id, id));
    return drug;
  }

  async getDrugByNafdacNumber(nafdacNumber: string): Promise<Drug | undefined> {
    const [drug] = await db.select().from(drugs).where(eq(drugs.nafdacNumber, nafdacNumber));
    return drug;
  }

  async createDrug(drug: InsertDrug): Promise<Drug> {
    const result = await db.insert(drugs).values(drug);
    const insertId = result[0].insertId;
    const [newDrug] = await db.select().from(drugs).where(eq(drugs.id, Number(insertId)));
    return newDrug;
  }

  async updateDrug(id: number, drug: Partial<Drug>): Promise<Drug | undefined> {
    await db
      .update(drugs)
      .set({ ...drug, updatedAt: new Date() })
      .where(eq(drugs.id, id));
    const [updatedDrug] = await db.select().from(drugs).where(eq(drugs.id, id));
    return updatedDrug;
  }

  async getAllDrugs(): Promise<Drug[]> {
    return db
      .select()
      .from(drugs)
      .orderBy(desc(drugs.updatedAt));
  }

  async searchDrugs(query: string): Promise<Drug[]> {
    return db
      .select()
      .from(drugs)
      .where(
        or(
          like(drugs.productName, `%${query}%`),
          like(drugs.nafdacNumber, `%${query}%`),
          like(drugs.manufacturer, `%${query}%`)
        )
      );
  }

  // Batch methods
  async getBatch(id: number): Promise<Batch | undefined> {
    const [batch] = await db.select().from(batches).where(eq(batches.id, id));
    return batch;
  }

  async getBatchByDrugAndBatchNumber(drugId: number, batchNumber: string): Promise<Batch | undefined> {
    const [batch] = await db
      .select()
      .from(batches)
      .where(
        and(
          eq(batches.drugId, drugId),
          eq(batches.batchNumber, batchNumber)
        )
      );
    return batch;
  }

  async createBatch(batch: InsertBatch): Promise<Batch> {
    const result = await db.insert(batches).values(batch);
    const insertId = result[0].insertId;
    const [newBatch] = await db.select().from(batches).where(eq(batches.id, Number(insertId)));
    return newBatch;
  }

  // Verification methods
  async createVerification(verification: InsertVerification): Promise<Verification> {
    const result = await db.insert(verifications).values(verification);
    const insertId = result[0].insertId;
    const [newVerification] = await db.select().from(verifications).where(eq(verifications.id, Number(insertId)));
    return newVerification;
  }

  async getVerifications(limit = 100): Promise<Verification[]> {
    return db
      .select()
      .from(verifications)
      .orderBy(desc(verifications.createdAt))
      .limit(limit);
  }

  async getVerificationsByUser(userId: number): Promise<Verification[]> {
    return db
      .select()
      .from(verifications)
      .where(eq(verifications.userId, userId))
      .orderBy(desc(verifications.createdAt));
  }

  // Report methods
  async createReport(report: InsertReport): Promise<Report> {
    const result = await db.insert(reports).values(report);
    const insertId = result[0].insertId;
    const [newReport] = await db.select().from(reports).where(eq(reports.id, Number(insertId)));
    return newReport;
  }

  async getReports(status?: string): Promise<Report[]> {
    if (status) {
      return db
        .select()
        .from(reports)
        .where(eq(reports.status, status))
        .orderBy(desc(reports.createdAt));
    } else {
      return db
        .select()
        .from(reports)
        .orderBy(desc(reports.createdAt));
    }
  }

  async getReportById(id: number): Promise<Report | undefined> {
    const [report] = await db.select().from(reports).where(eq(reports.id, id));
    return report;
  }

  async updateReport(id: number, report: Partial<Report>): Promise<Report | undefined> {
    await db
      .update(reports)
      .set({ ...report, updatedAt: new Date() })
      .where(eq(reports.id, id));
    const [updatedReport] = await db.select().from(reports).where(eq(reports.id, id));
    return updatedReport;
  }

  async getReportsByUser(userId: number): Promise<Report[]> {
    return db
      .select()
      .from(reports)
      .where(eq(reports.reporterId, userId))
      .orderBy(desc(reports.createdAt));
  }
}

export const storage = new DatabaseStorage();