import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
  decimal,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  tutorName: varchar("tutor_name").default("Alex"),
  wellbeingName: varchar("wellbeing_name").default("Sage"),
  studyStreak: integer("study_streak").default(0),
  totalStudyTime: integer("total_study_time").default(0),
  lessonsCompleted: integer("lessons_completed").default(0),
  preferences: jsonb("preferences"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Messages table for chat history
export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  sender: varchar("sender").notNull(), // 'user' or 'ai'
  aiType: varchar("ai_type").notNull(), // 'tutor' or 'wellbeing'
  timestamp: timestamp("timestamp").defaultNow(),
  reactions: jsonb("reactions"),
  bookmarked: boolean("bookmarked").default(false),
});

// Lessons table
export const lessons = pgTable("lessons", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  topic: varchar("topic").notNull(),
  subject: varchar("subject").notNull(),
  content: jsonb("content").notNull(),
  diagrams: jsonb("diagrams"),
  completed: boolean("completed").default(false),
  difficulty: varchar("difficulty").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Tests/Quizzes table
export const tests = pgTable("tests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  lessonId: varchar("lesson_id").references(() => lessons.id),
  userId: varchar("user_id").references(() => users.id).notNull(),
  questions: jsonb("questions").notNull(),
  userAnswers: jsonb("user_answers"),
  score: decimal("score"),
  completedAt: timestamp("completed_at"),
  timeSpent: integer("time_spent"), // in seconds
});

// Mood entries table
export const moodEntries = pgTable("mood_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  mood: varchar("mood").notNull(),
  notes: text("notes"),
  timestamp: timestamp("timestamp").defaultNow(),
  stressLevel: integer("stress_level"),
  energyLevel: integer("energy_level"),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  timestamp: true,
});

export const insertLessonSchema = createInsertSchema(lessons).omit({
  id: true,
  createdAt: true,
});

export const insertTestSchema = createInsertSchema(tests).omit({
  id: true,
  completedAt: true,
});

export const insertMoodEntrySchema = createInsertSchema(moodEntries).omit({
  id: true,
  timestamp: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertLesson = z.infer<typeof insertLessonSchema>;
export type Lesson = typeof lessons.$inferSelect;
export type InsertTest = z.infer<typeof insertTestSchema>;
export type Test = typeof tests.$inferSelect;
export type InsertMoodEntry = z.infer<typeof insertMoodEntrySchema>;
export type MoodEntry = typeof moodEntries.$inferSelect;
