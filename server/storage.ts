import {
  users,
  messages,
  lessons,
  tests,
  moodEntries,
  type User,
  type UpsertUser,
  type Message,
  type InsertMessage,
  type Lesson,
  type InsertLesson,
  type Test,
  type InsertTest,
  type MoodEntry,
  type InsertMoodEntry,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (IMPORTANT) mandatory for Replit Auth
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Message operations
  getMessages(userId: string, aiType: string): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  
  // Lesson operations
  getLessons(userId: string): Promise<Lesson[]>;
  createLesson(lesson: InsertLesson): Promise<Lesson>;
  
  // Test operations
  getTests(userId: string): Promise<Test[]>;
  createTest(test: InsertTest): Promise<Test>;
  
  // Mood entry operations
  getMoodEntries(userId: string): Promise<MoodEntry[]>;
  createMoodEntry(moodEntry: InsertMoodEntry): Promise<MoodEntry>;
  
  // Update user stats
  updateUserStats(userId: string, stats: Partial<User>): Promise<User>;
}

export class DatabaseStorage implements IStorage {
  // User operations (IMPORTANT) mandatory for Replit Auth
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Message operations
  async getMessages(userId: string, aiType: string): Promise<Message[]> {
    return await db
      .select()
      .from(messages)
      .where(and(eq(messages.userId, userId), eq(messages.aiType, aiType)))
      .orderBy(desc(messages.timestamp))
      .limit(50);
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db
      .insert(messages)
      .values(message)
      .returning();
    return newMessage;
  }

  // Lesson operations
  async getLessons(userId: string): Promise<Lesson[]> {
    return await db
      .select()
      .from(lessons)
      .where(eq(lessons.userId, userId))
      .orderBy(desc(lessons.createdAt));
  }

  async createLesson(lesson: InsertLesson): Promise<Lesson> {
    const [newLesson] = await db
      .insert(lessons)
      .values(lesson)
      .returning();
    return newLesson;
  }

  // Test operations
  async getTests(userId: string): Promise<Test[]> {
    return await db
      .select()
      .from(tests)
      .where(eq(tests.userId, userId))
      .orderBy(desc(tests.completedAt));
  }

  async createTest(test: InsertTest): Promise<Test> {
    const [newTest] = await db
      .insert(tests)
      .values(test)
      .returning();
    return newTest;
  }

  // Mood entry operations
  async getMoodEntries(userId: string): Promise<MoodEntry[]> {
    return await db
      .select()
      .from(moodEntries)
      .where(eq(moodEntries.userId, userId))
      .orderBy(desc(moodEntries.timestamp));
  }

  async createMoodEntry(moodEntry: InsertMoodEntry): Promise<MoodEntry> {
    const [newMoodEntry] = await db
      .insert(moodEntries)
      .values(moodEntry)
      .returning();
    return newMoodEntry;
  }

  // Update user stats
  async updateUserStats(userId: string, stats: Partial<User>): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set({ ...stats, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return updatedUser;
  }
}

export const storage = new DatabaseStorage();
