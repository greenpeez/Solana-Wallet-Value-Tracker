# Architecture Overview

## 1. Overview

The Solana Token Value Tracker is a web application that allows users to monitor the real-time USD value of specific Solana tokens in a wallet. The system is built using a modern React frontend with a lightweight Express backend, focusing primarily on client-side interactions with the Solana blockchain and external price APIs.

The application follows a client-focused architecture where most of the business logic related to token tracking happens in the browser, while the backend primarily serves the frontend assets and provides minimal API functionality.

## 2. System Architecture

### High-Level Architecture

The application follows a standard web architecture with the following components:

1. **Frontend**: React-based single-page application (SPA) using Vite as the build tool
2. **Backend**: Lightweight Express.js server that serves the SPA and provides basic API functionality
3. **Database**: Schema defined using Drizzle ORM, though minimal database usage is currently implemented
4. **External Services**: Integration with Solana blockchain and Solscan API for token data

```
Client (Browser) <---> Express Server <---> External APIs (Solscan)
                          |
                          v
                       Database
                      (Optional)
```

### Technology Stack

- **Frontend**:
  - React (with hooks pattern)
  - TanStack Query (React Query) for data fetching
  - Tailwind CSS with shadcn/ui components
  - TypeScript for type safety
  
- **Backend**:
  - Express.js for API server
  - TypeScript for type safety
  
- **Database**:
  - Drizzle ORM for database schema management
  - PostgreSQL (via Neon Database's serverless offering)
  
- **Build/Development**:
  - Vite for frontend bundling and development
  - ESBuild for backend bundling
  - TypeScript for static typing across the codebase

## 3. Key Components

### Frontend Components

1. **Main Application (App.tsx)**
   - Provides routing using Wouter
   - Sets up global providers (QueryClientProvider, TooltipProvider)

2. **TokenValueTracker**
   - Core component handling the display of token values
   - Manages refresh intervals and update states
   - Displays token balance and USD value

3. **UI Component Library**
   - Based on shadcn/ui with Radix UI primitives
   - Comprehensive set of accessible, styled components
   - Custom theming with orange-based color scheme

### Backend Components

1. **Express Server (server/index.ts)**
   - Serves the compiled frontend application
   - Provides logging middleware for API requests
   - Handles error responses

2. **Storage Layer (server/storage.ts)**
   - Abstract interface for data storage
   - MemStorage implementation for in-memory storage
   - Support for basic user operations (though not currently utilized heavily)

### Data Schema

```typescript
// User schema from shared/schema.ts
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});
```

## 4. Data Flow

### Token Value Tracking Flow

1. User accesses the application and views the TokenValueTracker component
2. The component uses the `useTokenValue` hook to fetch token data
3. The hook makes two major API calls:
   - Fetches token balance from Solana blockchain
   - Retrieves token price data from external APIs
4. The component displays the token balance, price, and calculated USD value
5. An auto-refresh mechanism periodically updates the data

### Data Fetching Strategy

- React Query is used for data fetching, caching, and synchronization
- Custom hooks encapsulate the data fetching logic
- The application uses optimistic UI updates when data changes

## 5. External Dependencies

### Solana Blockchain Integration

- `@solana/web3.js` for Solana blockchain interactions
- `@solana/spl-token` for SPL token interactions
- Custom utility functions in `lib/solana.ts` abstract the blockchain interactions

### External APIs

- Solscan API for token metadata and pricing
  - API key stored in environment variables
  - Endpoints for token metadata, pricing, and transaction history

### UI Component Libraries

- Radix UI primitives for accessible component foundations
- shadcn/ui for styled components on top of Radix
- Tailwind CSS for styling

## 6. Deployment Strategy

The application is configured for deployment on Replit with the following setup:

1. **Development Mode**:
   - `npm run dev` starts both frontend and backend in development mode
   - Vite provides hot module replacement for frontend
   - Environment variables loaded from `.env` file

2. **Production Build**:
   - Frontend built with Vite (`vite build`)
   - Backend bundled with ESBuild into the dist directory
   - Static assets served from the dist/public directory

3. **Deployment Configuration**:
   - `.replit` file defines the deployment configuration
   - Uses autoscaling deployment strategy
   - Exposes port 5000 externally on port 80

4. **Database Provisioning**:
   - Database connection configured via `DATABASE_URL` environment variable
   - Drizzle ORM used for schema management
   - Migration scripts available via `npm run db:push`

### Environment Configuration

The application requires the following environment variables:

- `DATABASE_URL`: Connection string for PostgreSQL database
- `VITE_SOLSCAN_API_KEY`: API key for Solscan API
- `NODE_ENV`: Environment setting (development/production)