import {
  users,
  User,
  InsertUser,
  vehicleMakes,
  vehicleModels,
  vehicleYears,
  reports,
  VehicleMake,
  VehicleModel,
  VehicleYear,
  Report,
  InsertReport
} from "@shared/schema";

// Storage interface definition
export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser & { id: string }): Promise<User>;
  
  // Vehicle data operations
  getVehicleMakes(): Promise<VehicleMake[]>;
  getVehicleModelsByMake(makeId: number): Promise<VehicleModel[]>;
  getVehicleYearsByModel(modelId: number): Promise<VehicleYear[]>;
  
  // Report operations
  createReport(report: InsertReport): Promise<Report>;
  getReport(id: number): Promise<Report | undefined>;
  getReports(userId?: string, sessionId?: string): Promise<Report[]>;
  updateReportStatus(id: number, status: string, result?: any): Promise<Report>;
  migrateSessionReports(sessionId: string, userId: string): Promise<void>;
}

// Memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private makes: Map<number, VehicleMake>;
  private models: Map<number, VehicleModel>;
  private years: Map<number, VehicleYear>;
  private reports: Map<number, Report>;
  
  private nextMakeId: number;
  private nextModelId: number;
  private nextYearId: number;
  private nextReportId: number;

  constructor() {
    this.users = new Map();
    this.makes = new Map();
    this.models = new Map();
    this.years = new Map();
    this.reports = new Map();
    
    this.nextMakeId = 1;
    this.nextModelId = 1;
    this.nextYearId = 1;
    this.nextReportId = 1;
    
    // Initialize with some vehicle makes
    this.initializeVehicleData();
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(user: InsertUser & { id: string }): Promise<User> {
    const newUser: User = {
      id: user.id,
      username: user.username,
      email: user.email || null,
      password: user.password || null,
      sessionId: user.sessionId || null,
      createdAt: new Date(),
    };
    this.users.set(user.id, newUser);
    return newUser;
  }
  
  // Vehicle data operations
  async getVehicleMakes(): Promise<VehicleMake[]> {
    return Array.from(this.makes.values());
  }
  
  async getVehicleModelsByMake(makeId: number): Promise<VehicleModel[]> {
    return Array.from(this.models.values()).filter(model => model.makeId === makeId);
  }
  
  async getVehicleYearsByModel(modelId: number): Promise<VehicleYear[]> {
    return Array.from(this.years.values()).filter(year => year.modelId === modelId);
  }
  
  // Report operations
  async createReport(report: InsertReport): Promise<Report> {
    const id = this.nextReportId++;
    const newReport: Report = {
      id,
      make: report.make,
      model: report.model,
      year: report.year,
      mileage: report.mileage,
      vin: report.vin || null,
      userId: report.userId || null,
      sessionId: report.sessionId || null,
      status: "processing",
      result: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.reports.set(id, newReport);
    return newReport;
  }
  
  async getReport(id: number): Promise<Report | undefined> {
    return this.reports.get(id);
  }
  
  async getReports(userId?: string, sessionId?: string): Promise<Report[]> {
    if (!userId && !sessionId) {
      return [];
    }
    
    return Array.from(this.reports.values())
      .filter(report => {
        if (userId && report.userId === userId) return true;
        if (sessionId && report.sessionId === sessionId) return true;
        return false;
      })
      .sort((a, b) => {
        // Handle potential null dates (though our implementation never has null dates)
        const dateA = a.createdAt ? a.createdAt.getTime() : 0;
        const dateB = b.createdAt ? b.createdAt.getTime() : 0;
        return dateB - dateA; // Sort descending (newest first)
      });
  }
  
  async updateReportStatus(id: number, status: string, result?: any): Promise<Report> {
    const report = this.reports.get(id);
    if (!report) {
      throw new Error(`Report with ID ${id} not found`);
    }
    
    const updatedReport: Report = {
      ...report,
      status,
      result: result || report.result,
      updatedAt: new Date(),
    };
    
    this.reports.set(id, updatedReport);
    return updatedReport;
  }
  
  async migrateSessionReports(sessionId: string, userId: string): Promise<void> {
    // Find all reports for this session
    const sessionReports = Array.from(this.reports.values()).filter(
      report => report.sessionId === sessionId && !report.userId
    );
    
    // Update each report with the user ID
    for (const report of sessionReports) {
      const updatedReport: Report = {
        ...report,
        userId,
        updatedAt: new Date(),
      };
      this.reports.set(report.id, updatedReport);
    }
  }
  
  // Initialize demo data
  private initializeVehicleData() {
    // Sample makes
    const makes = ["Toyota", "Honda", "Ford", "Chevrolet", "Nissan", "BMW", "Mercedes-Benz", "Audi", "Volkswagen", "Hyundai"];
    
    // Add makes
    const makeEntities = makes.map(name => {
      const id = this.nextMakeId++;
      const make: VehicleMake = { id, name };
      this.makes.set(id, make);
      return make;
    });
    
    // Sample models for each make
    const modelsByMake: Record<string, string[]> = {
      "Toyota": ["Camry", "Corolla", "RAV4", "Highlander", "Tacoma"],
      "Honda": ["Civic", "Accord", "CR-V", "Pilot", "Odyssey"],
      "Ford": ["F-150", "Escape", "Explorer", "Focus", "Mustang"],
      "Chevrolet": ["Silverado", "Equinox", "Malibu", "Traverse", "Tahoe"],
      "Nissan": ["Altima", "Sentra", "Rogue", "Pathfinder", "Frontier"],
      "BMW": ["3 Series", "5 Series", "X3", "X5", "7 Series"],
      "Mercedes-Benz": ["C-Class", "E-Class", "GLC", "GLE", "S-Class"],
      "Audi": ["A4", "A6", "Q5", "Q7", "A8"],
      "Volkswagen": ["Jetta", "Passat", "Tiguan", "Atlas", "Golf"],
      "Hyundai": ["Elantra", "Sonata", "Tucson", "Santa Fe", "Palisade"]
    };
    
    // Add models
    for (const make of makeEntities) {
      const models = modelsByMake[make.name] || [];
      models.forEach(name => {
        const id = this.nextModelId++;
        const model: VehicleModel = { id, makeId: make.id, name };
        this.models.set(id, model);
        
        // Add years for each model (last 10 years)
        const currentYear = new Date().getFullYear();
        for (let i = 0; i < 10; i++) {
          const year = currentYear - i;
          const yearId = this.nextYearId++;
          const yearEntity: VehicleYear = { id: yearId, modelId: id, year };
          this.years.set(yearId, yearEntity);
        }
      });
    }
  }
}

export const storage = new MemStorage();
