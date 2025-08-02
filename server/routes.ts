import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { studyMindAI } from "./openai";
import { insertMessageSchema } from "@shared/schema";
import { z } from "zod";

interface WebSocketClient extends WebSocket {
  userId?: string;
  aiType?: string;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Messages routes
  app.get('/api/messages/:aiType', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { aiType } = req.params;
      
      if (!['tutor', 'wellbeing'].includes(aiType)) {
        return res.status(400).json({ message: "Invalid AI type" });
      }

      const messages = await storage.getMessages(userId, aiType);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.post('/api/messages', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const messageData = insertMessageSchema.parse({
        ...req.body,
        userId,
      });

      // Save user message
      const userMessage = await storage.createMessage(messageData);

      // Get user preferences for AI personality
      const user = await storage.getUser(userId);
      const preferences = user?.preferences as any;
      const personality = preferences?.aiPersonality || 'encouraging';

      // Generate AI response
      const conversationHistory = await storage.getMessages(userId, messageData.aiType);
      const aiResponse = await studyMindAI.generateResponse(
        messageData.content,
        messageData.aiType as 'tutor' | 'wellbeing',
        personality,
        conversationHistory.map(msg => ({
          role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
          content: msg.content
        }))
      );

      // Save AI response
      const aiMessage = await storage.createMessage({
        userId,
        content: aiResponse.content,
        sender: 'ai',
        aiType: messageData.aiType,
      });

      res.json({ userMessage, aiMessage, aiResponse });
    } catch (error) {
      console.error("Error creating message:", error);
      res.status(500).json({ message: "Failed to create message" });
    }
  });

  // Lessons routes
  app.get('/api/lessons', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const lessons = await storage.getLessons(userId);
      res.json(lessons);
    } catch (error) {
      console.error("Error fetching lessons:", error);
      res.status(500).json({ message: "Failed to fetch lessons" });
    }
  });

  app.post('/api/lessons/generate', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { topic, subject } = req.body;

      if (!topic || !subject) {
        return res.status(400).json({ message: "Topic and subject are required" });
      }

      const lessonContent = await studyMindAI.generateLesson(topic, subject);
      
      const lesson = await storage.createLesson({
        userId,
        topic,
        subject,
        content: lessonContent,
        difficulty: 'medium',
      });

      res.json(lesson);
    } catch (error) {
      console.error("Error generating lesson:", error);
      res.status(500).json({ message: "Failed to generate lesson" });
    }
  });

  // Quiz routes
  app.post('/api/quizzes/generate', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { topic, difficulty = 'medium' } = req.body;

      if (!topic) {
        return res.status(400).json({ message: "Topic is required" });
      }

      const quizContent = await studyMindAI.generateQuiz(topic, difficulty);
      
      const test = await storage.createTest({
        userId,
        questions: quizContent,
      });

      res.json(test);
    } catch (error) {
      console.error("Error generating quiz:", error);
      res.status(500).json({ message: "Failed to generate quiz" });
    }
  });

  // Mood tracking routes
  app.get('/api/mood-entries', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const moodEntries = await storage.getMoodEntries(userId);
      res.json(moodEntries);
    } catch (error) {
      console.error("Error fetching mood entries:", error);
      res.status(500).json({ message: "Failed to fetch mood entries" });
    }
  });

  app.post('/api/mood-entries', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const moodEntry = await storage.createMoodEntry({
        ...req.body,
        userId,
      });
      res.json(moodEntry);
    } catch (error) {
      console.error("Error creating mood entry:", error);
      res.status(500).json({ message: "Failed to create mood entry" });
    }
  });

  // User stats update
  app.patch('/api/user/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const updatedUser = await storage.updateUserStats(userId, req.body);
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user stats:", error);
      res.status(500).json({ message: "Failed to update user stats" });
    }
  });

  const httpServer = createServer(app);

  // WebSocket server for real-time features
  const wss = new WebSocketServer({ 
    server: httpServer, 
    path: '/ws' 
  });

  wss.on('connection', (ws: WebSocketClient, req) => {
    console.log('New WebSocket connection');

    ws.on('message', async (data) => {
      try {
        const message = JSON.parse(data.toString());
        
        if (message.type === 'auth') {
          ws.userId = message.userId;
          ws.aiType = message.aiType;
        }

        if (message.type === 'typing') {
          // Broadcast typing indicator to other clients
          wss.clients.forEach((client: WebSocketClient) => {
            if (client !== ws && 
                client.readyState === WebSocket.OPEN && 
                client.userId === ws.userId) {
              client.send(JSON.stringify({
                type: 'typing',
                isTyping: message.isTyping,
                aiType: message.aiType
              }));
            }
          });
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      console.log('WebSocket connection closed');
    });
  });

  return httpServer;
}
