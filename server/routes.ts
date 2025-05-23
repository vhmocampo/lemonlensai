import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { createReportSchema } from "@shared/schema";
import { nanoid } from "nanoid";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import axios from "axios";

// Simulating API client with axios
const apiClient = axios.create({
  baseURL: process.env.VEHICLE_API_URL || "https://api.example.com",
  headers: {
    Authorization: `Bearer ${process.env.VEHICLE_API_KEY || "test_key"}`,
    "Content-Type": "application/json",
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Session management
  app.post("/api/session", async (req, res) => {
    try {
      const sessionId = req.body.sessionId || nanoid();
      res.json({ sessionId });
    } catch (error) {
      console.error("Error creating session:", error);
      res.status(500).json({ message: "Failed to create session" });
    }
  });

  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { username, email, password, sessionId } = req.body;
      const existingUser = await storage.getUserByEmail(email);
      
      if (existingUser) {
        return res.status(409).json({ message: "Email already in use" });
      }

      const user = await storage.createUser({
        id: nanoid(),
        username,
        email,
        password, // In a real app, would hash this
        sessionId,
      });

      // Migrate reports from session to user
      if (sessionId) {
        await storage.migrateSessionReports(sessionId, user.id);
      }

      res.status(201).json({ 
        id: user.id,
        username: user.username,
        email: user.email 
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password, sessionId } = req.body;
      const user = await storage.getUserByEmail(email);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Migrate reports from session to user if needed
      if (sessionId) {
        await storage.migrateSessionReports(sessionId, user.id);
      }

      res.json({ 
        id: user.id,
        username: user.username,
        email: user.email 
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Vehicle data endpoints
  app.get("/api/vehicles/makes", async (req, res) => {
    try {
      const makes = await storage.getVehicleMakes();
      res.json(makes);
    } catch (error) {
      console.error("Error fetching vehicle makes:", error);
      res.status(500).json({ message: "Failed to fetch vehicle makes" });
    }
  });

  app.get("/api/vehicles/models/:makeId", async (req, res) => {
    try {
      const makeId = parseInt(req.params.makeId);
      const models = await storage.getVehicleModelsByMake(makeId);
      res.json(models);
    } catch (error) {
      console.error("Error fetching vehicle models:", error);
      res.status(500).json({ message: "Failed to fetch vehicle models" });
    }
  });

  app.get("/api/vehicles/years/:modelId", async (req, res) => {
    try {
      const modelId = parseInt(req.params.modelId);
      const years = await storage.getVehicleYearsByModel(modelId);
      res.json(years);
    } catch (error) {
      console.error("Error fetching vehicle years:", error);
      res.status(500).json({ message: "Failed to fetch vehicle years" });
    }
  });

  // Reports endpoints
  app.post("/api/reports", async (req, res) => {
    try {
      const reportData = createReportSchema.parse(req.body);
      
      // Create the report
      const report = await storage.createReport(reportData);
      
      // In a real implementation, we would call the vehicle API here to queue report generation
      // For now, simulate this with a simple response
      
      res.status(201).json(report);
      
      // Simulate background processing (in real app, this would be a separate process)
      setTimeout(async () => {
        try {
          // Update report status to completed with mock data
          await storage.updateReportStatus(report.id, "completed", {
            overallHealth: 85,
            reliabilityScore: 4.2,
            commonIssues: [
              { name: "Transmission", frequency: 12, severity: "medium" },
              { name: "Electric System", frequency: 8, severity: "low" },
              { name: "Brakes", frequency: 5, severity: "low" }
            ],
            findings: [
              {
                title: "Transmission Issues",
                description: "Reports indicate some concerns with transmission shifting between 45,000-60,000 miles. Recommended preventative maintenance includes transmission fluid change every 30,000 miles.",
                risk: "medium",
                action: "Inspect Soon"
              },
              {
                title: "Electrical System",
                description: "Minor reports of battery life issues in cold weather conditions. Consider having battery tested if vehicle is operated in temperatures below freezing.",
                risk: "low",
                action: "Monitor"
              }
            ],
            maintenance: [
              { item: "Transmission fluid change", interval: "Every 30,000 miles" },
              { item: "Battery inspection", interval: "Before winter season" },
              { item: "Brake fluid flush", interval: "Every 2 years" }
            ]
          });
        } catch (error) {
          console.error("Error updating report:", error);
        }
      }, 5000);

    } catch (error) {
      console.error("Error creating report:", error);
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Failed to create report" });
    }
  });

  app.get("/api/reports", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      const sessionId = req.query.sessionId as string;
      
      if (!userId && !sessionId) {
        return res.status(400).json({ message: "userId or sessionId required" });
      }
      
      const reports = await storage.getReports(userId, sessionId);
      res.json(reports);
    } catch (error) {
      console.error("Error fetching reports:", error);
      res.status(500).json({ message: "Failed to fetch reports" });
    }
  });

  app.get("/api/reports/:id", async (req, res) => {
    try {
      const reportId = parseInt(req.params.id);
      const report = await storage.getReport(reportId);
      
      if (!report) {
        return res.status(404).json({ message: "Report not found" });
      }
      
      res.json(report);
    } catch (error) {
      console.error("Error fetching report:", error);
      res.status(500).json({ message: "Failed to fetch report" });
    }
  });

  app.post("/api/reports/:id/retry", async (req, res) => {
    try {
      const reportId = parseInt(req.params.id);
      const report = await storage.getReport(reportId);
      
      if (!report) {
        return res.status(404).json({ message: "Report not found" });
      }
      
      // Update status to processing
      await storage.updateReportStatus(reportId, "processing");
      
      res.json({ message: "Report processing restarted" });
      
      // Simulate background processing
      setTimeout(async () => {
        try {
          // Update report status to completed
          await storage.updateReportStatus(reportId, "completed", {
            overallHealth: 85,
            reliabilityScore: 4.2,
            commonIssues: [
              { name: "Transmission", frequency: 12, severity: "medium" },
              { name: "Electric System", frequency: 8, severity: "low" },
              { name: "Brakes", frequency: 5, severity: "low" }
            ],
            findings: [
              {
                title: "Transmission Issues",
                description: "Reports indicate some concerns with transmission shifting between 45,000-60,000 miles. Recommended preventative maintenance includes transmission fluid change every 30,000 miles.",
                risk: "medium",
                action: "Inspect Soon"
              },
              {
                title: "Electrical System",
                description: "Minor reports of battery life issues in cold weather conditions. Consider having battery tested if vehicle is operated in temperatures below freezing.",
                risk: "low",
                action: "Monitor"
              }
            ],
            maintenance: [
              { item: "Transmission fluid change", interval: "Every 30,000 miles" },
              { item: "Battery inspection", interval: "Before winter season" },
              { item: "Brake fluid flush", interval: "Every 2 years" }
            ]
          });
        } catch (error) {
          console.error("Error updating report:", error);
          // If processing fails, update status to failed
          await storage.updateReportStatus(reportId, "failed");
        }
      }, 3000);
      
    } catch (error) {
      console.error("Error retrying report:", error);
      res.status(500).json({ message: "Failed to retry report" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
