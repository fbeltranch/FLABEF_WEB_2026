import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id", { length: 255 }).primaryKey().default(sql`gen_random_uuid()`),
  fullName: text("full_name").notNull(),
  dni: varchar("dni", { length: 8 }).notNull().unique(),
  email: text("email").notNull().unique(),
  phone: varchar("phone", { length: 20 }),
  passwordHash: text("password_hash").notNull(),
  address: text("address"),
  role: varchar("role", { length: 50 }).notNull().default("client"),
  active: boolean("active").notNull().default(true),
  blocked: boolean("blocked").notNull().default(false),
  failedAttempts: integer("failed_attempts").notNull().default(0),
  lastAttemptTime: timestamp("last_attempt_time"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertUserSchema = createInsertSchema(users, {
  dni: z.string().length(8, "DNI debe tener 8 dígitos").regex(/^\d{8}$/, "DNI debe contener solo números"),
  email: z.string().email("Email inválido"),
  phone: z.string().optional(),
  address: z.string().optional(),
  role: z.enum(["client", "admin_basico", "admin_gestor", "super_admin"]).default("client"),
}).omit({
  id: true,
  createdAt: true,
  failedAttempts: true,
  lastAttemptTime: true,
  active: true,
  blocked: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: varchar("id", { length: 255 }).primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  code: varchar("code", { length: 6 }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  ip: varchar("ip", { length: 45 }),
  used: boolean("used").notNull().default(false),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertPasswordResetTokenSchema = createInsertSchema(passwordResetTokens).omit({
  id: true,
  createdAt: true,
  used: true,
});

export type InsertPasswordResetToken = z.infer<typeof insertPasswordResetTokenSchema>;
export type PasswordResetToken = typeof passwordResetTokens.$inferSelect;

export const securityLogs = pgTable("security_logs", {
  id: varchar("id", { length: 255 }).primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id", { length: 255 }).references(() => users.id, { onDelete: "set null" }),
  action: text("action").notNull(),
  ip: varchar("ip", { length: 45 }),
  success: boolean("success").notNull(),
  userAgent: text("user_agent"),
  timestamp: timestamp("timestamp").notNull().default(sql`now()`),
});

export const insertSecurityLogSchema = createInsertSchema(securityLogs).omit({
  id: true,
  timestamp: true,
});

export type InsertSecurityLog = z.infer<typeof insertSecurityLogSchema>;
export type SecurityLog = typeof securityLogs.$inferSelect;

export const categories = pgTable("categories", {
  id: varchar("id", { length: 255 }).primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  icon: text("icon"),
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
});

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

export const products = pgTable("products", {
  id: varchar("id", { length: 255 }).primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  categoryId: varchar("category_id", { length: 255 }).notNull().references(() => categories.id, { onDelete: "restrict" }),
  image: text("image"),
  stock: integer("stock").notNull().default(0),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertProductSchema = createInsertSchema(products, {
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Precio inválido"),
  stock: z.number().int().min(0, "Stock no puede ser negativo"),
}).omit({
  id: true,
  createdAt: true,
});

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

export const orders = pgTable("orders", {
  id: varchar("id", { length: 255 }).primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id, { onDelete: "restrict" }),
  items: jsonb("items").notNull(),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { length: 50 }).notNull().default("pending"),
  address: text("address").notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertOrderSchema = createInsertSchema(orders, {
  items: z.array(z.object({
    productId: z.string(),
    productName: z.string(),
    quantity: z.number().int().min(1),
    price: z.string(),
  })),
  total: z.string().regex(/^\d+(\.\d{1,2})?$/, "Total inválido"),
  status: z.enum(["pending", "confirmed", "shipped", "delivered", "cancelled"]).default("pending"),
}).omit({
  id: true,
  createdAt: true,
});

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

export const adminConfig = pgTable("admin_config", {
  id: varchar("id", { length: 255 }).primaryKey().default(sql`gen_random_uuid()`),
  adminSecret: text("admin_secret").notNull(),
  whatsappNumber: varchar("whatsapp_number", { length: 20 }).notNull(),
  storeName: text("store_name").notNull(),
  storeDescription: text("store_description"),
  navbarColor: varchar("navbar_color", { length: 7 }).default("#000000"),
  footerColor: varchar("footer_color", { length: 7 }).default("#000000"),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

export const insertAdminConfigSchema = createInsertSchema(adminConfig).omit({
  id: true,
  updatedAt: true,
});

export type InsertAdminConfig = z.infer<typeof insertAdminConfigSchema>;
export type AdminConfig = typeof adminConfig.$inferSelect;

export const paymentMethods = pgTable("payment_methods", {
  id: varchar("id", { length: 255 }).primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  number: varchar("number", { length: 50 }),
  icon: text("icon"),
  enabled: boolean("enabled").notNull().default(true),
  position: integer("position").notNull().default(0),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertPaymentMethodSchema = createInsertSchema(paymentMethods).omit({
  id: true,
  createdAt: true,
});

export type InsertPaymentMethod = z.infer<typeof insertPaymentMethodSchema>;
export type PaymentMethod = typeof paymentMethods.$inferSelect;

