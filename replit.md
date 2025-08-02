# StudyMind AI - AI-Powered Learning & Wellbeing Platform

## Overview

StudyMind AI is a comprehensive web application that combines AI-powered tutoring with mental health and wellbeing support for students. The platform features a dual AI system with two distinct modes: a Study Tutor named "Alex" for educational assistance and a Wellbeing Companion named "Sage" for mental health support. Users can seamlessly switch between these modes while maintaining separate conversation histories and customizable AI personalities.

The application provides interactive learning experiences including personalized lessons, dynamic quizzes, mood tracking, progress analytics, and productivity tools like Pomodoro timers. Built as a modern single-page application, it emphasizes accessibility, mobile responsiveness, and real-time communication through WebSocket connections.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript for type safety and modern component development
- **Styling**: Tailwind CSS with a comprehensive design system using CSS custom properties for theming
- **UI Components**: shadcn/ui component library built on Radix UI primitives for accessible, customizable components
- **State Management**: TanStack Query for server state management with optimistic updates and caching
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework for API server
- **Database ORM**: Drizzle ORM with PostgreSQL for type-safe database operations
- **Real-time Communication**: WebSocket server for live chat features and typing indicators
- **API Design**: RESTful endpoints with JSON responses and proper error handling
- **Session Management**: Express sessions with PostgreSQL storage for persistent user sessions

### Authentication System
- **Provider**: Replit Auth with OpenID Connect for seamless authentication
- **Session Storage**: PostgreSQL-backed sessions with configurable TTL
- **Authorization**: Middleware-based route protection with user context injection
- **User Management**: Automatic user creation and profile management with customizable AI assistant names

### AI Integration
- **Provider**: OpenAI GPT-4o for natural language processing
- **Dual AI System**: Separate system prompts and conversation contexts for tutoring vs wellbeing modes
- **Personality Customization**: Four personality types (encouraging, professional, friendly, motivational) for each AI mode
- **Response Types**: Structured responses supporting text, lessons, quizzes, and wellbeing content

### Database Schema
- **Users Table**: Profile data, AI assistant names, study statistics, and user preferences
- **Messages Table**: Chat history with AI type categorization and conversation threading
- **Lessons Table**: Generated educational content with metadata and progress tracking
- **Tests Table**: Quiz data with questions, answers, and performance analytics
- **Mood Entries Table**: Mental health tracking with timestamps and mood ratings
- **Sessions Table**: Authentication session storage (required for Replit Auth)

### Real-time Features
- **WebSocket Implementation**: Custom WebSocket server for live chat functionality
- **Typing Indicators**: Real-time typing status during AI response generation
- **Live Updates**: Instant message delivery and conversation synchronization

### Design System
- **Theme Support**: Light/dark mode with smooth transitions and system preference detection
- **Responsive Design**: Mobile-first approach with touch-friendly interfaces
- **Accessibility**: Screen reader support, keyboard navigation, and ARIA compliance
- **Visual Hierarchy**: Consistent spacing, typography, and color schemes using design tokens

## External Dependencies

### Core Services
- **Neon Database**: PostgreSQL hosting for production data storage
- **OpenAI API**: GPT-4o model for AI-powered tutoring and wellbeing assistance
- **Replit Auth**: Authentication service with OpenID Connect integration

### Development Tools
- **Drizzle Kit**: Database schema management and migrations
- **ESBuild**: Fast JavaScript bundling for production builds
- **TypeScript**: Static type checking and enhanced developer experience

### UI Libraries
- **Radix UI**: Headless component primitives for accessible UI elements
- **Lucide React**: Icon library with consistent design language
- **date-fns**: Date manipulation and formatting utilities
- **class-variance-authority**: Type-safe CSS class composition

### Real-time Communication
- **ws**: WebSocket library for real-time chat functionality
- **connect-pg-simple**: PostgreSQL session store for Express sessions

### Styling and Assets
- **Tailwind CSS**: Utility-first CSS framework with custom configuration
- **PostCSS**: CSS processing with autoprefixer for browser compatibility
- **Google Fonts**: Inter font family for consistent typography
- **Font Awesome**: Additional icon library for enhanced visual elements