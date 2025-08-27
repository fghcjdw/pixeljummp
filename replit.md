# Overview

A 2D web-based puzzle platformer game built with React and TypeScript, featuring a complex 67-level system with Super Meat Boy-inspired dark art style and unlockable character skins. The application combines modern web technologies with a custom-built 2D game engine to deliver smooth platforming gameplay with puzzle elements including switches, keys, doors, moving platforms, and hazards.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **React with TypeScript**: Component-based architecture using functional components and hooks for UI management
- **Vite Build System**: Fast development server with HMR and optimized production builds
- **Custom 2D Game Engine**: Canvas-based game engine with modular design
  - Physics system for gravity, movement, and collision detection
  - Entity system for player, platforms, and puzzle elements
  - Camera system with smooth player tracking
  - Input handling for keyboard controls (WASD, arrows, space)
  - Particle system for visual effects
- **State Management**: Zustand stores for game state, audio state, and character skin management
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent UI elements

## Game Engine Design
- **Physics Engine**: Custom physics system with gravity, velocity, and collision resolution
- **Collision Detection**: Rectangle-based collision system with side detection for platform interactions
- **Level System**: JSON-based level definitions with platforms, puzzle elements, and metadata
- **Puzzle Elements**: Switches, doors, keys, moving platforms, pressure plates, spikes, and checkpoints
- **Character System**: Unlockable character skins with rarity levels and unlock conditions
- **Progressive Difficulty**: 67 levels ranging from easy tutorials to expert challenges

## Backend Architecture
- **Express.js Server**: RESTful API structure with middleware for request logging
- **Pluggable Storage**: Interface-based storage system with in-memory implementation
- **Development Integration**: Vite middleware for seamless development experience
- **Session Management**: Express session handling with connect-pg-simple for PostgreSQL session storage

## Data Layer
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for migrations and schema updates
- **Connection**: Neon Database serverless PostgreSQL integration
- **Type Safety**: Zod schema validation for data integrity

## Audio System
- **Sound Management**: Web Audio API integration for game sounds
- **Audio Assets**: Hit sounds, success sounds, and background music
- **Mute Controls**: User-configurable audio settings with persistent state

# External Dependencies

## Database Services
- **Neon Database**: Serverless PostgreSQL hosting with automatic scaling
- **Drizzle ORM**: Type-safe database toolkit with PostgreSQL dialect support

## Development Tools
- **Vite**: Frontend build tool with TypeScript support and GLSL shader loading
- **ESBuild**: Fast JavaScript bundler for server-side code compilation

## UI Components
- **Radix UI**: Headless component primitives for accessibility and functionality
- **shadcn/ui**: Pre-built component library built on Radix UI primitives
- **Tailwind CSS**: Utility-first CSS framework with PostCSS processing
- **Lucide React**: Icon library for consistent iconography

## Game Development
- **Canvas API**: Native browser 2D rendering for game graphics
- **Web Audio API**: Browser audio processing for sound effects and music
- **React Three Fiber**: 3D graphics library (configured but not actively used)

## State Management
- **Zustand**: Lightweight state management for game logic and UI state
- **TanStack Query**: Data fetching and caching for API interactions

## Build and Development
- **TypeScript**: Static type checking with strict configuration
- **PostCSS**: CSS processing with Tailwind CSS and Autoprefixer
- **connect-pg-simple**: PostgreSQL session store for Express sessions