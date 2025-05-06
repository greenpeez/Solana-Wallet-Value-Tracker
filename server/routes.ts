import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // No specific backend routes needed for this application
  // as it's a client-side only app that interacts directly
  // with Solana blockchain and external APIs

  const httpServer = createServer(app);
  return httpServer;
}
