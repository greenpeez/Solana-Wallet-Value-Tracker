# Architecture Overview

## 1. Overview

This application is a Solana Token Value Tracker that allows users to monitor the real-time USD value of specified tokens in Solana wallets. The application follows a modern full-stack architecture with a clear separation between client and server components.

The system is built as a single codebase with separate directories for client (frontend) and server (backend) code, using a shared schema definition for database models and types. It employs a React frontend with a Node.js/Express backend, PostgreSQL database with Drizzle ORM, and integrates with the Solana blockchain.

## 2. System Architecture

### High-Level Architecture

The application follows a client-server architecture with the following components:

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│             │       │             │       │             │       │             │
│  React UI   │◄─────►│  Express    │◄─────►│ PostgreSQL  │       │   Solana    │
│  (Client)   │       │  (Server)   │       │ (Database)  │       │ Blockchain  │
│             │       │             │       │             │       │             │
└─────────────┘       └─────────────┘       └─────────────┘       └─────────────┘
                                                                       ▲
                                                                       │
                      ┌─────────────────────────────────────────────────┘
                      │
                      │
                ┌─────────────┐
                │             │
                │  External   │
                │  APIs       │
                │             │
                └─────────────┘
```

### Frontend Architecture

The frontend is built with React and follows a component-based architecture using modern React practices:

- Uses functional components with hooks
- Employs a UI component library based on Radix UI primitives with shadcn/ui styling
- Uses Tailwind CSS for styling
- React Query for data fetching and caching
- Uses a client-side routing solution (wouter)

### Backend Architecture

The backend is a Node.js application with Express framework:

- RESTful API structure with Express
- PostgreSQL database accessed via Drizzle ORM
- Serverless-compatible database connection using Neon database
- TypeScript for type safety across the stack

### Data Layer

- PostgreSQL database managed through Drizzle ORM
- Shared schema definitions between frontend and backend
- Database migrations handled by Drizzle Kit

## 3. Key Components

### Frontend Components

1. **UI Component Library**
   - Built on Radix UI primitives with custom styling
   - Provides consistent design patterns across the application
   - Includes complex components like cards, toasts, modals, and form elements

2. **Token Value Tracker Component**
   - Core feature component that displays token values and refreshes data
   - Shows token balances, USD values, and historical data

3. **Data Fetching Layer**
   - Uses React Query for data fetching and state management
   - Custom hooks for fetching token data from Solana and price data from external sources

### Backend Components

1. **Express Server**
   - Serves the frontend application
   - Provides API endpoints for data access and operations
   - Handles logging and error reporting

2. **Database Layer**
   - Drizzle ORM for database operations
   - Schema definitions for users, tokens, wallets, and historical data
   - Connection pooling for database access

3. **Solana Integration**
   - Integration with Solana blockchain for token data
   - Uses @solana/web3.js and @solana/spl-token libraries

## 4. Data Flow

1. **Frontend to Backend**
   - React components request data via custom hooks
   - Hooks use React Query to fetch from API endpoints
   - API responses are cached and managed for performance

2. **Backend to Database**
   - Express routes handle API requests
   - Database operations executed through Drizzle ORM
   - Results returned as JSON responses

3. **Blockchain Integration**
   - Direct integration with Solana blockchain from the frontend
   - Token balances and prices fetched from blockchain and external APIs
   - Historical data stored in the database for tracking changes over time

## 5. External Dependencies

### Frontend Dependencies
- React ecosystem (React, React DOM)
- React Query for data fetching
- Radix UI primitives for accessible UI components
- Tailwind CSS for styling
- Solana Web3 libraries for blockchain integration

### Backend Dependencies
- Express.js for the web server
- Drizzle ORM for database operations
- Neon serverless PostgreSQL client
- TypeScript for type safety

### External Services
- Solana blockchain (via web3.js)
- Price data APIs (integrated directly from frontend)
- Neon PostgreSQL for database storage

## 6. Deployment Strategy

The application is designed to be deployable on various platforms with a focus on cloud environments:

- **Development**: Local development server with hot reloading
- **Production**: Built static assets served by Express
- **Database**: Neon serverless PostgreSQL
- **Configuration**: Environment variables for configuration management

The repository includes Replit configuration for easy development and deployment in the Replit environment.

### Build Process

1. Frontend built with Vite
2. Backend compiled with esbuild
3. Combined deployment with static assets served by Express

### Deployment Commands

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server

## 7. Schema Design

The database schema includes the following tables:

1. **users**: Authentication and account management
   - id (PK)
   - username (unique)
   - password

2. **tokens**: Metadata for tracked tokens
   - id (PK)
   - address (unique)
   - name
   - symbol
   - decimals
   - currentPrice
   - lastUpdated

3. **wallets**: Information about tracked wallets
   - id (PK)
   - address (unique)
   - label
   - lastUpdated

4. **tokenPriceHistory**: Historical price data
   - id (PK)
   - tokenAddress
   - price
   - timestamp

5. **tokenBalanceHistory**: Historical balance data
   - id (PK)
   - walletAddress
   - tokenAddress
   - balance
   - usdValue
   - timestamp

This schema is designed to track token values over time, supporting the primary use case of monitoring token values in specified wallets.