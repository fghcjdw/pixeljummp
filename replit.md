# Overview

A 2D web-based puzzle platformer game built with React and TypeScript, featuring a complex 67-level system with Super Meat Boy-inspired dark art style and unlockable character skins. The application includes a custom-built game engine with physics, collision detection, particle effects, and comprehensive puzzle mechanics including switches, doors, keys, moving platforms, pressure plates, spikes, and checkpoints.

# User Preferences

Preferred communication style: Simple, everyday language.
Art style: Super Meat Boy-inspired dark, gritty visual design with industrial platforms and atmospheric effects.
Content: Complex puzzle platforming with unlockable character skins and progression system.

# System Architecture

## Frontend Architecture
- **React with TypeScript**: Component-based architecture using functional components and hooks
- **Vite Build System**: Fast development server with HMR (Hot Module Replacement) and optimized builds
- **Game Engine**: Custom 2D canvas-based game engine with modular design
  - Physics system for gravity and movement
  - Collision detection system for platform interactions
  - Game state management with Zustand stores
- **Styling**: Tailwind CSS with shadcn/ui component library for UI elements
- **State Management**: Zustand for game state (phase, score) and audio state (sounds, mute status)

## Backend Architecture
- **Express.js Server**: RESTful API structure with middleware for logging and error handling
- **Storage Interface**: Pluggable storage system with in-memory implementation
- **Development Integration**: Vite middleware integration for seamless dev experience

## Game Engine Design
- **Modular Components**: Separate classes for Physics, CollisionDetector, and GameEngine
- **Entity System**: Player and platform entities with position, velocity, and collision properties
- **Camera System**: Follows player movement for smooth gameplay experience
- **Input Handling**: Keyboard event system for movement controls (WASD, arrows, space)
- **Particle System**: Dynamic particle effects for jumping, landing, and visual feedback
- **Character Skin System**: Unlockable characters with unique visual styles and textures
- **Progressive Unlock System**: Statistics tracking for deaths, completion times, and achievement-based unlocks

## Data Layer
- **Database**: PostgreSQL with Drizzle ORM for schema management
- **Migration System**: Drizzle Kit for database migrations and schema updates
- **Connection**: Neon Database serverless PostgreSQL integration

## UI Component System
- **Design System**: Comprehensive shadcn/ui component library with Radix UI primitives
- **Responsive Design**: Mobile-first approach with Tailwind responsive utilities
- **Theme Support**: CSS custom properties for consistent theming
- **Accessibility**: ARIA labels and keyboard navigation support

# External Dependencies

## Database Services
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **Drizzle ORM**: Type-safe database operations and schema management

## Development Tools
- **Vite**: Build tool and development server with React plugin support
- **ESBuild**: Fast JavaScript bundler for production builds
- **TypeScript**: Static type checking and development tooling

## UI Libraries
- **Radix UI**: Unstyled, accessible UI primitives for complex components
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Lucide React**: Icon library for consistent iconography
- **React Three Fiber**: 3D graphics capabilities (included but unused in current implementation)

## Audio Integration
- **Web Audio API**: Native browser audio support for game sounds
- **Preloaded Assets**: Audio files loaded and managed through custom audio store

## Fonts and Assets
- **Inter Font**: Modern typography via Fontsource package
- **Static Assets**: Support for GLTF, GLB, and audio file formats through Vite

## State Management
- **Zustand**: Lightweight state management with TypeScript support
- **React Query**: Server state management and caching (included for future API integration)