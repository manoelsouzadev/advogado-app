import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertClientSchema, insertCaseSchema, insertActivitySchema, insertHearingSchema, insertFinancialSchema, insertCommunicationSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Dashboard
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Clients
  app.get("/api/clients", async (req, res) => {
    try {
      const clients = await storage.getClients();
      res.json(clients);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch clients" });
    }
  });

  app.get("/api/clients/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const client = await storage.getClient(id);
      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }
      res.json(client);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch client" });
    }
  });

  app.post("/api/clients", async (req, res) => {
    try {
      const validatedData = insertClientSchema.parse(req.body);
      const client = await storage.createClient(validatedData);
      res.status(201).json(client);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create client" });
    }
  });

  app.put("/api/clients/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertClientSchema.partial().parse(req.body);
      const client = await storage.updateClient(id, validatedData);
      res.json(client);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update client" });
    }
  });

  app.delete("/api/clients/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteClient(id);
      res.json({ message: "Client deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete client" });
    }
  });

  // Cases
  app.get("/api/cases", async (req, res) => {
    try {
      const { search } = req.query;
      let cases;
      if (search) {
        cases = await storage.searchCases(search as string);
      } else {
        cases = await storage.getCases();
      }
      res.json(cases);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cases" });
    }
  });

  app.get("/api/cases/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const caseData = await storage.getCase(id);
      if (!caseData) {
        return res.status(404).json({ message: "Case not found" });
      }
      res.json(caseData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch case" });
    }
  });

  app.post("/api/cases", async (req, res) => {
    try {
      const validatedData = insertCaseSchema.parse(req.body);
      const caseData = await storage.createCase(validatedData);
      res.status(201).json(caseData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create case" });
    }
  });

  app.put("/api/cases/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertCaseSchema.partial().parse(req.body);
      const caseData = await storage.updateCase(id, validatedData);
      res.json(caseData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update case" });
    }
  });

  app.delete("/api/cases/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteCase(id);
      res.json({ message: "Case deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete case" });
    }
  });

  // Activities
  app.get("/api/cases/:caseId/activities", async (req, res) => {
    try {
      const caseId = parseInt(req.params.caseId);
      const activities = await storage.getActivities(caseId);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  app.get("/api/activities/upcoming", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const activities = await storage.getUpcomingDeadlines(limit);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch upcoming deadlines" });
    }
  });

  app.post("/api/activities", async (req, res) => {
    try {
      const validatedData = insertActivitySchema.parse(req.body);
      const activity = await storage.createActivity(validatedData);
      res.status(201).json(activity);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create activity" });
    }
  });

  app.put("/api/activities/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertActivitySchema.partial().parse(req.body);
      const activity = await storage.updateActivity(id, validatedData);
      res.json(activity);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update activity" });
    }
  });

  app.delete("/api/activities/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteActivity(id);
      res.json({ message: "Activity deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete activity" });
    }
  });

  // Hearings
  app.get("/api/cases/:caseId/hearings", async (req, res) => {
    try {
      const caseId = parseInt(req.params.caseId);
      const hearings = await storage.getHearings(caseId);
      res.json(hearings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch hearings" });
    }
  });

  app.get("/api/hearings/today", async (req, res) => {
    try {
      const hearings = await storage.getTodayHearings();
      res.json(hearings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch today's hearings" });
    }
  });

  app.post("/api/hearings", async (req, res) => {
    try {
      const validatedData = insertHearingSchema.parse(req.body);
      const hearing = await storage.createHearing(validatedData);
      res.status(201).json(hearing);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create hearing" });
    }
  });

  app.put("/api/hearings/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertHearingSchema.partial().parse(req.body);
      const hearing = await storage.updateHearing(id, validatedData);
      res.json(hearing);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update hearing" });
    }
  });

  app.delete("/api/hearings/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteHearing(id);
      res.json({ message: "Hearing deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete hearing" });
    }
  });

  // Financial
  app.get("/api/cases/:caseId/financial", async (req, res) => {
    try {
      const caseId = parseInt(req.params.caseId);
      const financial = await storage.getFinancial(caseId);
      res.json(financial);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch financial records" });
    }
  });

  app.get("/api/financial/pending", async (req, res) => {
    try {
      const pendingFees = await storage.getPendingFees();
      res.json(pendingFees);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch pending fees" });
    }
  });

  app.post("/api/financial", async (req, res) => {
    try {
      const validatedData = insertFinancialSchema.parse(req.body);
      const financial = await storage.createFinancialRecord(validatedData);
      res.status(201).json(financial);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create financial record" });
    }
  });

  app.put("/api/financial/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertFinancialSchema.partial().parse(req.body);
      const financial = await storage.updateFinancialRecord(id, validatedData);
      res.json(financial);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update financial record" });
    }
  });

  app.delete("/api/financial/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteFinancialRecord(id);
      res.json({ message: "Financial record deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete financial record" });
    }
  });

  // Communications
  app.get("/api/cases/:caseId/communications", async (req, res) => {
    try {
      const caseId = parseInt(req.params.caseId);
      const communications = await storage.getCommunications(caseId);
      res.json(communications);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch communications" });
    }
  });

  app.post("/api/communications", async (req, res) => {
    try {
      const validatedData = insertCommunicationSchema.parse(req.body);
      const communication = await storage.createCommunication(validatedData);
      res.status(201).json(communication);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create communication" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
