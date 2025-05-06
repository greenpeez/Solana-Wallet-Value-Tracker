
import { Connection, PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, getAccount } from '@solana/spl-token';

// Define interfaces
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

// Initialize Solana connection (using public RPC endpoint)
const connection = new Connection('https://api.mainnet-beta.solana.com');

// Get token account for a specific wallet and token
async function getTokenAccount(walletAddress: string, tokenMint: string) {
  try {
    const walletPubkey = new PublicKey(walletAddress);
    const tokenMintPubkey = new PublicKey(tokenMint);
    
    // Find token account
    const tokenAccounts = await connection.getTokenAccountsByOwner(walletPubkey, {
      mint: tokenMintPubkey,
    });
    
    return tokenAccounts.value[0]?.pubkey;
  } catch (error) {
    console.error('Error getting token account:', error);
    return null;
  }
}

export async function getTokenBalance(walletAddress: string, tokenAddress: string): Promise<{amount: number, decimals: number}> {
  try {
    const tokenAccountPubkey = await getTokenAccount(walletAddress, tokenAddress);
    
    if (!tokenAccountPubkey) {
      return { amount: 0, decimals: 9 }; // Default to 9 decimals for Solana tokens
    }

    const tokenAccount = await getAccount(connection, tokenAccountPubkey);
    
    return {
      amount: Number(tokenAccount.amount),
      decimals: 9 // BANI token uses 9 decimals
    };
  } catch (error) {
    console.error('Error fetching token balance:', error);
    return {
      amount: 0,
      decimals: 9
    };
  }
}

export async function getTokenMetadata(tokenAddress: string): Promise<TokenMetadata> {
  try {
    // For BANI token specifically, we'll use a fixed price for now
    // In production, you would want to fetch this from a price oracle or DEX
    if (tokenAddress === "2LmeQwAKJPcyUeQKS7CzNMRGyoQt1FsZbUrHCQBdbonk") {
      return {
        price: 0.052, // Current market price
        name: "BANI Token",
        symbol: "BANI"
      };
    }
    
    return {
      price: 0,
      name: "Unknown Token",
      symbol: "UNKNOWN"
    };
  } catch (error) {
    console.error('Error fetching token metadata:', error);
    return {
      price: 0,
      name: "Unknown Token",
      symbol: "UNKNOWN"
    };
  }
}
