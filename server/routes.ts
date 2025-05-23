import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { createReportSchema } from "@shared/schema";
import { nanoid } from "nanoid";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import axios from "axios";

// Configure the API client with axios
const apiClient = axios.create({
  baseURL: "https://lemonlensapp.com/api/v1",
  headers: {
    Authorization: `Bearer ${process.env.VEHICLE_API_KEY}`,
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Session management
  app.get("/api/session", async (req, res) => {
    try {
      // Get a new session ID from the LemonLens API
      const response = await apiClient.get("/session");
      res.json({ sessionId: response.data.session_id });
    } catch (error) {
      console.error("Error creating session:", error);
      res.status(500).json({ message: "Failed to create session" });
    }
  });

  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { username, email, password, password_confirmation, sessionId } = req.body;
      
      // Call the LemonLens API to register the user
      const apiResponse = await apiClient.post("/auth/register", {
        name: username, // API expects 'name' instead of 'username'
        email,
        password,
        password_confirmation
      });
      
      const { user, token } = apiResponse.data;
      
      // Migrate reports from session to user if a session exists
      if (sessionId) {
        try {
          // We'll implement report migration with the real API
          await apiClient.post("/reports/migrate", {
            session_id: sessionId
          }, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        } catch (migrationError) {
          console.error("Error migrating reports:", migrationError);
          // Continue anyway, user registration still succeeded
        }
      }

      res.status(201).json({ 
        id: user.id,
        username: user.name, // API returns 'name' instead of 'username'
        email: user.email,
        token
      });
    } catch (error) {
      console.error("Registration error:", error);
      
      // Handle specific API error responses
      if (error.response && error.response.status === 422) {
        return res.status(422).json(error.response.data);
      }
      
      res.status(500).json({ message: "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password, sessionId } = req.body;
      
      // Call the LemonLens API to login the user
      const apiResponse = await apiClient.post("/auth/login", {
        email,
        password
      });
      
      const { user, token } = apiResponse.data;
      
      // Migrate reports from session to user if needed
      if (sessionId) {
        try {
          // We'll implement report migration with the real API
          await apiClient.post("/reports/migrate", {
            session_id: sessionId
          }, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        } catch (migrationError) {
          console.error("Error migrating reports:", migrationError);
          // Continue anyway, user login still succeeded
        }
      }

      res.json({ 
        id: user.id,
        username: user.name, // API returns 'name' instead of 'username'
        email: user.email,
        token
      });
    } catch (error) {
      console.error("Login error:", error);
      
      // Handle specific API error responses
      if (error.response && error.response.status === 401) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      if (error.response && error.response.status === 422) {
        return res.status(422).json(error.response.data);
      }
      
      res.status(500).json({ message: "Login failed" });
    }
  });
  
  app.post("/api/auth/google", async (req, res) => {
    try {
      const { access_token, sessionId } = req.body;
      
      if (!access_token) {
        return res.status(400).json({ message: "No Google access token provided" });
      }
      
      // Call the LemonLens API to authenticate with Google
      const apiResponse = await apiClient.post("/auth/google", {
        access_token
      });
      
      const { user, token } = apiResponse.data;
      
      // Migrate reports from session to user if needed
      if (sessionId) {
        try {
          await apiClient.post("/reports/migrate", {
            session_id: sessionId
          }, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        } catch (migrationError) {
          console.error("Error migrating reports:", migrationError);
          // Continue anyway, user login still succeeded
        }
      }

      res.json({ 
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }, 
        token 
      });
    } catch (error: any) {
      console.error("Google authentication error:", error);
      
      // Handle specific API error responses
      if (error.response && error.response.status === 401) {
        return res.status(401).json({ message: "Invalid Google token" });
      }
      
      if (error.response && error.response.data) {
        return res.status(error.response.status || 500).json(error.response.data);
      }
      
      res.status(500).json({ message: "Google authentication failed" });
    }
  });

  app.post("/api/auth/logout", async (req, res) => {
    try {
      // Get token from request headers
      const token = req.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return res.status(401).json({ message: "No authentication token provided" });
      }
      
      // Call the LemonLens API to logout the user
      await apiClient.post("/auth/logout", {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      res.json({ message: "Successfully logged out" });
    } catch (error) {
      console.error("Logout error:", error);
      
      // Handle 401 separately
      if (error.response && error.response.status === 401) {
        return res.status(401).json({ message: "Unauthenticated" });
      }
      
      res.status(500).json({ message: "Logout failed" });
    }
  });

  // Vehicle data endpoints
  app.get("/api/vehicles/makes", async (req, res) => {
    try {
      // Fetch vehicle makes from the LemonLens API
      const response = await apiClient.get("/vehicles/makes");
      res.json(response.data);
    } catch (error) {
      console.error("Error fetching vehicle makes:", error);
      res.status(500).json({ message: "Failed to fetch vehicle makes" });
    }
  });

  app.get("/api/vehicles/models/:makeId", async (req, res) => {
    try {
      const makeId = parseInt(req.params.makeId);
      // Fetch vehicle models from the LemonLens API
      const response = await apiClient.get(`/vehicles/models/${makeId}`);
      res.json(response.data);
    } catch (error) {
      console.error("Error fetching vehicle models:", error);
      res.status(500).json({ message: "Failed to fetch vehicle models" });
    }
  });

  app.get("/api/vehicles/years/:modelId", async (req, res) => {
    try {
      const modelId = parseInt(req.params.modelId);
      // Fetch vehicle years from the LemonLens API
      const response = await apiClient.get(`/vehicles/years/${modelId}`);
      res.json(response.data);
    } catch (error) {
      console.error("Error fetching vehicle years:", error);
      res.status(500).json({ message: "Failed to fetch vehicle years" });
    }
  });

  // Reports endpoints
  app.post("/api/reports", async (req, res) => {
    try {
      const reportData = createReportSchema.parse(req.body);
      
      // Prepare data for the LemonLens API (convert to snake_case as needed)
      const apiRequestData = {
        make: reportData.make,
        model: reportData.model,
        year: reportData.year,
        mileage: reportData.mileage,
        vin: reportData.vin || null,
        session_id: reportData.sessionId || null
      };
      
      // Add authorization header if user is authenticated
      let headers = {};
      if (reportData.userId && req.headers.authorization) {
        headers = {
          Authorization: req.headers.authorization
        };
      }
      
      // Send request to create a report at the LemonLens API
      const response = await apiClient.post("/reports", apiRequestData, { headers });
      
      // Return the created report
      res.status(201).json(response.data);
    } catch (error: any) {
      console.error("Error creating report:", error);
      
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      
      // Pass through API error responses if available
      if (error.response && error.response.data) {
        return res.status(error.response.status || 500).json(error.response.data);
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
      
      // Prepare headers and query parameters for the API request
      let headers = {};
      let queryParams = '';
      
      if (userId && req.headers.authorization) {
        // If user is authenticated, include the auth token
        headers = {
          Authorization: req.headers.authorization
        };
      } else if (sessionId) {
        // If using a session, include the session_id as a query parameter
        queryParams = `?session_id=${sessionId}`;
      }
      
      // Make the request to the LemonLens API
      const response = await apiClient.get(`/reports${queryParams}`, { headers });
      res.json(response.data);
    } catch (error: any) {
      console.error("Error fetching reports:", error);
      
      // Pass through API error responses if available
      if (error.response && error.response.data) {
        return res.status(error.response.status || 500).json(error.response.data);
      }
      
      res.status(500).json({ message: "Failed to fetch reports" });
    }
  });

  app.get("/api/reports/:id", async (req, res) => {
    try {
      const reportId = parseInt(req.params.id);
      
      // Get session ID or auth token
      let headers = {};
      let queryParams = '';
      
      const sessionId = req.query.sessionId as string;
      
      if (req.headers.authorization) {
        headers = {
          Authorization: req.headers.authorization
        };
      } else if (sessionId) {
        queryParams = `?session_id=${sessionId}`;
      }
      
      // Make the request to the LemonLens API
      const response = await apiClient.get(`/reports/${reportId}${queryParams}`, { headers });
      
      res.json(response.data);
    } catch (error: any) {
      console.error("Error fetching report:", error);
      
      // If the report wasn't found
      if (error.response && error.response.status === 404) {
        return res.status(404).json({ message: "Report not found" });
      }
      
      // Pass through other API error responses if available
      if (error.response && error.response.data) {
        return res.status(error.response.status || 500).json(error.response.data);
      }
      
      res.status(500).json({ message: "Failed to fetch report" });
    }
  });

  app.post("/api/reports/:id/retry", async (req, res) => {
    try {
      const reportId = parseInt(req.params.id);
      
      // Get session ID or auth token
      let headers = {};
      let queryParams = '';
      
      const sessionId = req.query.sessionId as string;
      
      if (req.headers.authorization) {
        headers = {
          Authorization: req.headers.authorization
        };
      } else if (sessionId) {
        // Pass the session ID in the body of the request
        queryParams = `?session_id=${sessionId}`;
      }
      
      // Call the LemonLens API to retry the report
      const response = await apiClient.post(`/reports/${reportId}/retry${queryParams}`, {}, { headers });
      
      res.json(response.data);
    } catch (error: any) {
      console.error("Error retrying report:", error);
      
      // If the report wasn't found
      if (error.response && error.response.status === 404) {
        return res.status(404).json({ message: "Report not found" });
      }
      
      // Pass through other API error responses if available
      if (error.response && error.response.data) {
        return res.status(error.response.status || 500).json(error.response.data);
      }
      
      res.status(500).json({ message: "Failed to retry report" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
