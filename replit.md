# Overview

AgriVenture is a gamified agricultural learning platform designed to promote sustainable farming practices through interactive education and real-world rewards. The application combines a React frontend with an Express backend to create an ecosystem where farmers can learn sustainable techniques, manage virtual farms, earn credits, and purchase equipment discounts. The platform bridges the knowledge gap between traditional farming methods and modern sustainable practices while providing financial incentives for adoption.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management and caching
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Styling**: Tailwind CSS with custom design tokens and CSS variables
- **Build Tool**: Vite for fast development and optimized production builds

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API endpoints organized by feature domains
- **Error Handling**: Centralized error middleware with structured error responses
- **Development**: Hot reload with request logging and response tracking

## Data Storage Solutions
- **ORM**: Drizzle ORM for type-safe database interactions
- **Database**: PostgreSQL with Neon serverless configuration
- **Schema Management**: Drizzle migrations with shared TypeScript schema definitions
- **Validation**: Zod schemas for runtime type validation and API contracts

## Key Data Models
- **Users**: Profile management with credits, levels, and learning streaks
- **Farm Plots**: 3x3 grid simulation with crop lifecycle management
- **Learning Modules**: Structured educational content with progress tracking
- **Equipment**: Marketplace items purchasable with earned credits
- **Achievements**: Gamification rewards for user engagement
- **Community**: Social features with posts and user interactions

## Feature Domains
- **Dashboard**: Overview of user progress, farm status, and achievements
- **Farm Management**: Interactive crop planting and growth simulation
- **Learning System**: Module-based education with progress tracking
- **Marketplace**: Equipment purchasing with credit-based economy
- **Community**: Social features and success story sharing

## Development Tooling
- **Code Quality**: TypeScript strict mode with comprehensive type checking
- **Path Resolution**: Absolute imports using @ aliases for clean code organization
- **Development Experience**: Replit integration with runtime error overlays

# External Dependencies

## Core Framework Dependencies
- **@tanstack/react-query**: Server state management and caching
- **wouter**: Lightweight React routing
- **express**: Node.js web framework
- **drizzle-orm**: Type-safe ORM for database operations
- **drizzle-kit**: Database migration and schema management tools

## Database and Storage
- **@neondatabase/serverless**: Serverless PostgreSQL database connection
- **connect-pg-simple**: PostgreSQL session store for Express

## UI and Styling
- **@radix-ui/***: Primitive UI components for accessibility
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Type-safe CSS variant management
- **clsx**: Conditional className utility

## Development Tools
- **vite**: Build tool and development server
- **tsx**: TypeScript execution for Node.js
- **esbuild**: JavaScript bundler for production builds
- **@replit/vite-plugin-***: Replit-specific development enhancements

## Validation and Forms
- **zod**: Runtime type validation
- **react-hook-form**: Form management
- **@hookform/resolvers**: Form validation integration

## Utilities
- **date-fns**: Date manipulation library
- **nanoid**: Unique ID generation
- **embla-carousel-react**: Carousel component