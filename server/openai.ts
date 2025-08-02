import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIResponse {
  content: string;
  type: 'text' | 'lesson' | 'quiz' | 'wellbeing';
  metadata?: any;
}

export class StudyMindAI {
  private getTutorSystemPrompt(personality: string = 'encouraging'): string {
    const personalities = {
      encouraging: "You are Alex, an encouraging and supportive AI study tutor. You help students learn by breaking down complex topics into manageable parts, providing step-by-step explanations, and celebrating their progress. Always be positive and motivating.",
      professional: "You are Alex, a professional and structured AI study tutor. You provide clear, organized explanations with proper academic formatting. Focus on accuracy and systematic learning approaches.",
      friendly: "You are Alex, a friendly and approachable AI study tutor. You make learning fun and engaging while maintaining educational value. Use conversational language and relatable examples.",
      motivational: "You are Alex, a highly motivational AI study tutor. You inspire students to push their limits and achieve their goals. Emphasize growth mindset and celebrating achievements."
    };

    return personalities[personality as keyof typeof personalities] || personalities.encouraging;
  }

  private getWellbeingSystemPrompt(personality: string = 'encouraging'): string {
    const personalities = {
      encouraging: "You are Sage, a caring and encouraging AI wellbeing companion. You help students manage stress, maintain work-life balance, and support their mental health. Always be empathetic and supportive.",
      professional: "You are Sage, a professional AI wellbeing companion. You provide evidence-based mental health support and stress management techniques. Maintain appropriate boundaries while being helpful.",
      friendly: "You are Sage, a friendly and understanding AI wellbeing companion. You create a safe space for students to express their feelings and provide practical wellbeing advice.",
      motivational: "You are Sage, a motivational AI wellbeing companion. You help students build resilience and positive mental habits while supporting their emotional wellbeing."
    };

    return personalities[personality as keyof typeof personalities] || personalities.encouraging;
  }

  async generateResponse(
    message: string,
    aiType: 'tutor' | 'wellbeing',
    personality: string = 'encouraging',
    conversationHistory: ChatMessage[] = []
  ): Promise<AIResponse> {
    try {
      const systemPrompt = aiType === 'tutor' 
        ? this.getTutorSystemPrompt(personality)
        : this.getWellbeingSystemPrompt(personality);

      const messages: ChatMessage[] = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory.slice(-10), // Keep last 10 messages for context
        { role: 'user', content: message }
      ];

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages,
        max_tokens: 1000,
        temperature: 0.7,
      });

      const content = response.choices[0].message.content || "";

      // Determine response type based on content
      let type: 'text' | 'lesson' | 'quiz' | 'wellbeing' = 'text';
      if (aiType === 'tutor') {
        if (content.toLowerCase().includes('quiz') || content.toLowerCase().includes('test')) {
          type = 'quiz';
        } else if (content.toLowerCase().includes('lesson') || content.toLowerCase().includes('step')) {
          type = 'lesson';
        }
      } else {
        type = 'wellbeing';
      }

      return {
        content,
        type,
        metadata: {
          aiType,
          personality,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error('Failed to generate AI response');
    }
  }

  async generateQuiz(topic: string, difficulty: string = 'medium'): Promise<any> {
    try {
      const prompt = `Generate a quiz about "${topic}" with ${difficulty} difficulty. 
      Return a JSON object with the following structure:
      {
        "title": "Quiz title",
        "questions": [
          {
            "question": "Question text",
            "options": ["A", "B", "C", "D"],
            "correct": 0,
            "explanation": "Why this answer is correct"
          }
        ]
      }
      Generate 5 multiple choice questions.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: "json_object" },
      });

      return JSON.parse(response.choices[0].message.content || "{}");
    } catch (error) {
      console.error('Quiz generation error:', error);
      throw new Error('Failed to generate quiz');
    }
  }

  async generateLesson(topic: string, subject: string): Promise<any> {
    try {
      const prompt = `Create a comprehensive lesson about "${topic}" in the subject of "${subject}".
      Return a JSON object with the following structure:
      {
        "title": "Lesson title",
        "content": "Detailed lesson content with explanations",
        "keyPoints": ["Key point 1", "Key point 2"],
        "examples": ["Example 1", "Example 2"],
        "summary": "Brief summary of the lesson"
      }`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: "json_object" },
      });

      return JSON.parse(response.choices[0].message.content || "{}");
    } catch (error) {
      console.error('Lesson generation error:', error);
      throw new Error('Failed to generate lesson');
    }
  }
}

export const studyMindAI = new StudyMindAI();
