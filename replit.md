# LegalTracker Pro - Law Firm Management System

## Overview

LegalTracker Pro is a comprehensive law firm management system built as a full-stack web application. The system provides tools for managing legal cases, clients, deadlines, hearings, documents, and financial records. It features a modern React frontend with a Node.js/Express backend, using PostgreSQL for data persistence.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack React Query for server state management
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom legal-themed color palette
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js for REST API
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: Built-in session handling preparation
- **API Structure**: RESTful endpoints organized by resource type

### Application Structure
```
├── client/          # React frontend application
├── server/          # Express.js backend application  
├── shared/          # Shared TypeScript schemas and types
└── migrations/      # Database migration files
```

## Key Components

### Database Schema
The system uses a relational database with the following core entities:
- **Clients**: Customer information and contact details
- **Cases**: Legal cases with process numbers, court info, and parties
- **Activities**: Tasks, deadlines, and case-related activities
- **Hearings**: Court hearings and appointments
- **Documents**: File attachments and document management
- **Financial**: Financial records, fees, and expenses
- **Communications**: Client communication logs

### API Structure
RESTful API endpoints organized by resource:
- `/api/clients` - Client management
- `/api/cases` - Case management with search functionality
- `/api/activities` - Task and deadline management
- `/api/hearings` - Court hearing scheduling
- `/api/documents` - Document management
- `/api/financial` - Financial record keeping
- `/api/communications` - Communication logs
- `/api/dashboard/stats` - Dashboard analytics

### UI Components
- **Layout System**: Fixed header with collapsible sidebar navigation
- **Dashboard**: Overview cards with statistics and recent activity
- **Data Tables**: Sortable, searchable tables for entity listings
- **Modal Forms**: Form dialogs for creating/editing records
- **Notification System**: Toast notifications and activity alerts

## Data Flow

1. **Client Requests**: React components make API calls through TanStack Query
2. **API Processing**: Express routes validate requests and interact with database
3. **Database Operations**: Drizzle ORM handles SQL queries to PostgreSQL
4. **Response Handling**: Data flows back through the API to update UI state
5. **Real-time Updates**: Query invalidation keeps data synchronized

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL database connection
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **react-hook-form**: Form validation and handling
- **@hookform/resolvers**: Zod integration for form validation
- **wouter**: Lightweight React routing

### UI Dependencies
- **@radix-ui/***: Headless UI component library
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **date-fns**: Date manipulation and formatting
- **lucide-react**: Icon library

## Deployment Strategy

### Development Environment
- **Dev Server**: Vite development server with HMR
- **API Server**: Express server with TypeScript compilation via tsx
- **Database**: Neon Database with connection pooling
- **Environment**: Replit-optimized with runtime error handling

### Production Build
- **Frontend**: Vite builds static assets to `dist/public`
- **Backend**: esbuild bundles server code to `dist/index.js`
- **Database**: Drizzle migrations handle schema updates
- **Deployment**: Single-command deployment with `npm start`

### Configuration
- Database connection via `DATABASE_URL` environment variable
- TypeScript configuration supports both client and server code
- Path aliases configured for clean imports (`@/`, `@shared/`)

## Changelog

```
Changelog:
- June 30, 2025. Initial setup and migration from Replit Agent
- June 30, 2025. Fixed DOM nesting error in Sidebar navigation
- June 30, 2025. Implemented complete Calendar page with functional calendar view
- June 30, 2025. Added comprehensive Reports page with charts and analytics
- June 30, 2025. Fixed date validation error in hearing creation (datetime string conversion)
- June 30, 2025. Enhanced database storage with getAllHearings method
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```