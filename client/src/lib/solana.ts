import { apiRequest } from './queryClient';

// Defining interfaces for our token data
interface TokenMetadata {
  price: number;
  name?: string;
  symbol?: string;
  logoUrl?: string;
}

interface TokenAccountInfo {
  mint: string;
  owner: string;
  amount: number;
  decimals: number;
}

/**
 * Get token balance for a specific wallet and token address
 * This is a simplified implementation for demonstration purposes
 */
export async function getTokenBalance(walletAddress: string, tokenAddress: string): Promise<{amount: number, decimals: number}> {
  // Generate slightly different values on each call for a more realistic demo
  // In a real implementation, this would fetch data from the Solana blockchain
  try {
    // For this demo, we'll simulate a known wallet and token combination
    if (walletAddress === "H8r7GkQktUQNdA98tpVHuE3VupjTKpjTGpQsPRHsd9zE" &&
        tokenAddress === "2LmeQwAKJPcyUeQKS7CzNMRGyoQt1FsZbUrHCQBdbonk") {
      
      // Simulated balance with 7 decimals
      const baseAmount = 25;
      // Add small random variation for demo purposes
      const variation = Math.random() * 0.5 - 0.25; // -0.25 to +0.25
      const actualAmount = baseAmount + variation;
      const rawAmount = Math.round(actualAmount * 10000000); // 7 decimals
      
      return {
        amount: rawAmount,
        decimals: 7
      };
    }
    
    // Default for any other wallet/token combination
    return {
      amount: 0,
      decimals: 0
    };
  } catch (error) {
    console.error('Error simulating token balance:', error);
    return {
      amount: 0,
      decimals: 0
    };
  }
}

/**
 * Get token metadata and price
 * This is a simplified implementation for demonstration purposes
 */
export async function getTokenMetadata(tokenAddress: string): Promise<TokenMetadata> {
  try {
    // In a production app, this would fetch from a real API
    // For this demo, we'll simulate data for the specific token
    
    if (tokenAddress === "2LmeQwAKJPcyUeQKS7CzNMRGyoQt1FsZbUrHCQBdbonk") {
      // Generate slightly different price on each call for a more realistic demo
      const basePrice = 0.052;
      // Add small random variation
      const variation = Math.random() * 0.004 - 0.002; // -0.002 to +0.002
      
      return {
        price: basePrice + variation,
        name: "Demo Token",
        symbol: "DEMO"
      };
    }
    
    // Default for any other token
    return {
      price: 0,
      name: "Unknown Token",
      symbol: "UNKNOWN"
    };
  } catch (error) {
    console.error('Error simulating token metadata:', error);
    
    // Even on error, return valid data for demonstration
    return {
      price: 0.052,
      name: "Demo Token",
      symbol: "DEMO"
    };
  }
}
