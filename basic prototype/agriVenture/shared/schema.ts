import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, decimal, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  sustainaCredits: integer("sustaina_credits").notNull().default(0),
  farmLevel: integer("farm_level").notNull().default(1),
  learningStreak: integer("learning_streak").notNull().default(0),
  location: text("location"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const farmPlots = pgTable("farm_plots", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  plotIndex: integer("plot_index").notNull(), // 0-8 for 3x3 grid
  cropType: text("crop_type"), // null if empty
  plantedAt: timestamp("planted_at"),
  growthStage: text("growth_stage").default("empty"), // empty, seedling, growing, ready
  growthProgress: integer("growth_progress").default(0), // 0-100
  estimatedHarvestDate: timestamp("estimated_harvest_date"),
  waterLevel: integer("water_level").default(100),
  healthStatus: text("health_status").default("healthy"), // healthy, needs_water, pest_issue
});

export const learningModules = pgTable("learning_modules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // soil, crops, vertical, market, equipment, sustainable
  difficulty: text("difficulty").notNull(), // beginner, intermediate, advanced
  lessonsCount: integer("lessons_count").notNull(),
  creditsReward: integer("credits_reward").notNull(),
  prerequisiteModules: text("prerequisite_modules").array(),
  estimatedDuration: integer("estimated_duration"), // in minutes
  thumbnailColor: text("thumbnail_color").notNull(),
});

export const userProgress = pgTable("user_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  moduleId: varchar("module_id").notNull().references(() => learningModules.id),
  currentLesson: integer("current_lesson").default(0),
  completedLessons: integer("completed_lessons").default(0),
  progress: integer("progress").default(0), // 0-100
  completed: boolean("completed").default(false),
  creditsEarned: integer("credits_earned").default(0),
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const equipment = pgTable("equipment", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // irrigation, lighting, sensors, tools, seeds
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }),
  creditsRequired: integer("credits_required").notNull(),
  discountPercentage: integer("discount_percentage").default(0),
  inStock: boolean("in_stock").default(true),
  thumbnailColor: text("thumbnail_color").notNull(),
  specifications: jsonb("specifications"),
});

export const userPurchases = pgTable("user_purchases", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  equipmentId: varchar("equipment_id").notNull().references(() => equipment.id),
  creditsUsed: integer("credits_used").notNull(),
  purchasePrice: decimal("purchase_price", { precision: 10, scale: 2 }).notNull(),
  purchasedAt: timestamp("purchased_at").defaultNow(),
});

export const achievements = pgTable("achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  iconType: text("icon_type").notNull(), // star, check, settings, heart
  creditsReward: integer("credits_reward").notNull(),
  category: text("category").notNull(), // farming, learning, community, efficiency
  color: text("color").notNull(),
});

export const userAchievements = pgTable("user_achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  achievementId: varchar("achievement_id").notNull().references(() => achievements.id),
  earnedAt: timestamp("earned_at").defaultNow(),
});

export const communityPosts = pgTable("community_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  type: text("type").default("success_story"), // success_story, question, tip, discussion
  metrics: jsonb("metrics"), // income_before, income_after, efficiency_gained, etc.
  likesCount: integer("likes_count").default(0),
  commentsCount: integer("comments_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const weatherData = pgTable("weather_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  location: text("location").notNull(),
  temperature: integer("temperature").notNull(),
  humidity: integer("humidity").notNull(),
  windSpeed: integer("wind_speed").notNull(),
  uvIndex: integer("uv_index").notNull(),
  condition: text("condition").notNull(),
  forecast: jsonb("forecast"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  sustainaCredits: true,
  farmLevel: true,
  learningStreak: true,
  createdAt: true,
});

export const insertFarmPlotSchema = createInsertSchema(farmPlots).omit({
  id: true,
});

export const insertLearningModuleSchema = createInsertSchema(learningModules).omit({
  id: true,
});

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
  startedAt: true,
  completedAt: true,
});

export const insertEquipmentSchema = createInsertSchema(equipment).omit({
  id: true,
});

export const insertCommunityPostSchema = createInsertSchema(communityPosts).omit({
  id: true,
  likesCount: true,
  commentsCount: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type FarmPlot = typeof farmPlots.$inferSelect;
export type InsertFarmPlot = z.infer<typeof insertFarmPlotSchema>;

export type LearningModule = typeof learningModules.$inferSelect;
export type InsertLearningModule = z.infer<typeof insertLearningModuleSchema>;

export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;

export type Equipment = typeof equipment.$inferSelect;
export type InsertEquipment = z.infer<typeof insertEquipmentSchema>;

export type Achievement = typeof achievements.$inferSelect;
export type UserAchievement = typeof userAchievements.$inferSelect;

export type CommunityPost = typeof communityPosts.$inferSelect;
export type InsertCommunityPost = z.infer<typeof insertCommunityPostSchema>;

export type WeatherData = typeof weatherData.$inferSelect;
