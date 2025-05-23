import { pgTable, text, serial, integer, boolean, timestamp, varchar, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage for user sessions
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Users table for authentication
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  username: text("username").notNull(),
  email: text("email").unique(),
  password: text("password"),
  sessionId: text("session_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  sessionId: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Vehicle makes table
export const vehicleMakes = pgTable("vehicle_makes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
});

export type VehicleMake = typeof vehicleMakes.$inferSelect;
export type InsertVehicleMake = typeof vehicleMakes.$inferInsert;

// Vehicle models table
export const vehicleModels = pgTable("vehicle_models", {
  id: serial("id").primaryKey(),
  makeId: integer("make_id").notNull(),
  name: text("name").notNull(),
});

export type VehicleModel = typeof vehicleModels.$inferSelect;
export type InsertVehicleModel = typeof vehicleModels.$inferInsert;

// Vehicle years table
export const vehicleYears = pgTable("vehicle_years", {
  id: serial("id").primaryKey(),
  modelId: integer("model_id").notNull(),
  year: integer("year").notNull(),
});

export type VehicleYear = typeof vehicleYears.$inferSelect;
export type InsertVehicleYear = typeof vehicleYears.$inferInsert;

// Reports table
export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  uuid: text("uuid"),  // UUID from the API
  userId: text("user_id"),
  sessionId: text("session_id"),
  make: text("make").notNull(),
  model: text("model").notNull(),
  year: text("year").notNull(),
  mileage: integer("mileage").notNull(),
  vin: text("vin"),
  status: text("status").notNull().default("pending"),
  result: jsonb("result"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertReportSchema = createInsertSchema(reports).pick({
  userId: true,
  sessionId: true,
  make: true,
  model: true,
  year: true,
  mileage: true,
  vin: true
});

export type Report = typeof reports.$inferSelect;
export type InsertReport = z.infer<typeof insertReportSchema>;

// Report validation schema with additional validation
export const createReportSchema = insertReportSchema.extend({
  mileage: z.number().min(0).max(1000000),
  vin: z.string().optional(),
});
