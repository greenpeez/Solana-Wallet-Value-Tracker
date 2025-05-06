import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// User table for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Token Price History table to track the price changes over time
export const tokenPriceHistory = pgTable("token_price_history", {
  id: serial("id").primaryKey(),
  tokenAddress: text("token_address").notNull(),
  price: decimal("price", { precision: 18, scale: 10 }).notNull(), // High precision for small token values
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Token Balance History table to track balance changes over time
export const tokenBalanceHistory = pgTable("token_balance_history", {
  id: serial("id").primaryKey(),
  walletAddress: text("wallet_address").notNull(),
  tokenAddress: text("token_address").notNull(),
  balance: decimal("balance", { precision: 18, scale: 8 }).notNull(),
  usdValue: decimal("usd_value", { precision: 18, scale: 8 }).notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Token metadata table to store information about tracked tokens
export const tokens = pgTable("tokens", {
  id: serial("id").primaryKey(),
  address: text("address").notNull().unique(),
  name: text("name").notNull(),
  symbol: text("symbol").notNull(),
  decimals: integer("decimals").notNull(),
  currentPrice: decimal("current_price", { precision: 18, scale: 10 }).notNull(),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
});

// Wallet table to store information about tracked wallets
export const wallets = pgTable("wallets", {
  id: serial("id").primaryKey(),
  address: text("address").notNull().unique(),
  label: text("label"),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
});

// Define relations
export const walletRelations = relations(wallets, ({ many }) => ({
  balanceHistory: many(tokenBalanceHistory),
}));

export const tokenRelations = relations(tokens, ({ many }) => ({
  priceHistory: many(tokenPriceHistory),
  balanceHistory: many(tokenBalanceHistory),
}));

// Schema for inserting new records
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertTokenSchema = createInsertSchema(tokens);
export const insertWalletSchema = createInsertSchema(wallets);
export const insertTokenPriceHistorySchema = createInsertSchema(tokenPriceHistory);
export const insertTokenBalanceHistorySchema = createInsertSchema(tokenBalanceHistory);

// Types for TypeScript
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertToken = z.infer<typeof insertTokenSchema>;
export type Token = typeof tokens.$inferSelect;

export type InsertWallet = z.infer<typeof insertWalletSchema>;
export type Wallet = typeof wallets.$inferSelect;

export type InsertTokenPriceHistory = z.infer<typeof insertTokenPriceHistorySchema>;
export type TokenPriceHistory = typeof tokenPriceHistory.$inferSelect;

export type InsertTokenBalanceHistory = z.infer<typeof insertTokenBalanceHistorySchema>;
export type TokenBalanceHistory = typeof tokenBalanceHistory.$inferSelect;
