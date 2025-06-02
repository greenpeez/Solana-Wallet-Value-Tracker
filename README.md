
# 🚀 Solana Token Value Tracker

A real-time web application for monitoring the USD value of Solana tokens in specific wallet addresses. Built with React, TypeScript, and Express, this tracker provides live updates on token balances, prices, and percentage changes with a clean, responsive interface.

## ✨ Features

- **Real-time Token Tracking**: Monitor live USD values of BANI tokens in Solana wallets
- **Live Price Updates**: Automatic refresh every 10 seconds with manual refresh capability
- **Percentage Change Indicators**: Visual arrows and percentage displays showing value changes
- **Token Balance Display**: Current token balance and individual token price information
- **Responsive Design**: Clean, mobile-friendly interface built with Tailwind CSS
- **Blockchain Integration**: Direct integration with Solana blockchain via RPC endpoints
- **Price Data Sources**: Multiple API integrations including DexScreener for accurate pricing

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Radix UI** primitives with shadcn/ui components
- **React Query** for data fetching and caching
- **Wouter** for client-side routing

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **Drizzle ORM** with PostgreSQL
- **Neon** serverless database

### Blockchain Integration
- **@solana/web3.js** for Solana blockchain interaction
- **DexScreener API** for token price data
- **QuickNode RPC** for blockchain data access

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or higher
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/greenpeez/Solana-Wallet-Value-Tracker.git
   cd Solana-Wallet-Value-Tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=your_neon_database_url
   QUICKNODE_RPC_URL=your_quicknode_rpc_endpoint
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:5000](http://localhost:5000)

## 📊 Current Configuration

The tracker is pre-configured to monitor:
- **Wallet**: `H8r7GkQktUQNdA98tpVHuE3VupjTKpjTGpQsPRHsd9zE`
- **Token**: BANI (`2LmeQwAKJPcyUeQKS7CzNMRGyoQt1FsZbUrHCQBdbonk`)

## 🏗️ Architecture

The application follows a modern full-stack architecture:

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
                ┌─────────────┐
                │             │
                │ DexScreener │
                │   API       │
                │             │
                └─────────────┘
```

### Key Components

- **TokenValueTracker**: Main component displaying real-time token data
- **useTokenValue**: Custom hook managing token data fetching and state
- **Solana Integration**: Direct blockchain interaction for token balances
- **Price APIs**: Multiple fallback sources for accurate pricing

## 📁 Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility libraries
│   │   └── pages/         # Page components
├── server/                 # Backend Express application
│   ├── db.ts             # Database configuration
│   ├── index.ts          # Server entry point
│   └── routes.ts         # API routes
├── shared/                # Shared types and schemas
└── README.md
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run check` - Type check with TypeScript
- `npm run db:push` - Push database schema changes

## 🌐 Deployment

This application is deployed on **Replit** and can be easily deployed to other platforms:

1. **Replit**: Already configured for Replit deployment
2. **Production Build**: Use `npm run build` to create production assets
3. **Environment Variables**: Configure DATABASE_URL and RPC endpoints

## 🔑 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | Neon PostgreSQL connection string | Yes |
| `QUICKNODE_RPC_URL` | Solana RPC endpoint URL | Optional |

## 📈 Features in Detail

### Real-time Updates
- Fetches token data every 10 seconds
- Displays live price changes with visual indicators
- Shows percentage changes from initial reference point

### Price Data Sources
1. **Primary**: DexScreener API for real-time pricing
2. **Fallback**: QuickNode RPC for token metadata
3. **Blockchain**: Direct Solana queries for token balances

### User Interface
- Clean, responsive design using Tailwind CSS
- Radix UI components for accessibility
- Real-time refresh controls
- Visual percentage change indicators with arrows

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Live Demo

Check out the live application: [Solana Token Value Tracker on Replit](https://replit.com/@greenpeez/Solana-Wallet-Value-Tracker)

## 📞 Support

For questions or support, please open an issue on GitHub or contact the maintainer.

---

*Built for tracking donation progress and token value changes in real-time.*
