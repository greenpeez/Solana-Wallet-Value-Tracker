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

interface DexscreenerResponse {
  pairs: {
    baseToken: {
      address: string;
      name: string;
      symbol: string;
    };
    priceUsd: string;
  }[];
}

// Interface for Solana RPC response
interface SolanaRpcResponse {
  jsonrpc: string;
  id: string | number;
  result: {
    context: { slot: number };
    value: any;
  };
}

// Known token accounts that hold the BANI token in our target wallet
// This is based on Solscan data for the specified wallet
const KNOWN_TOKEN_ACCOUNTS = {
  "GC6XPwiSa8zCRtUf8XXVjnJPB5mnJyo6FA9EanD8t4Jk": {
    mint: "2LmeQwAKJPcyUeQKS7CzNMRGyoQt1FsZbUrHCQBdbonk", // BANI token
    owner: "H8r7GkQktUQNdA98tpVHuE3VupjTKpjTGpQsPRHsd9zE"
  }
};

/**
 * Get token balance using either Solscan API or Solana RPC API
 */
export async function getTokenBalance(walletAddress: string, tokenAddress: string): Promise<{amount: number, decimals: number}> {
  try {
    // Try Solscan API first (more reliable for token balances)
    try {
      console.log('Trying Solscan API with authentication');
      const solscanApiKey = process.env.SOLSCAN_API_KEY || import.meta.env.VITE_SOLSCAN_API_KEY;
      
      // For the BANI token, use the known token account address
      if (walletAddress === "H8r7GkQktUQNdA98tpVHuE3VupjTKpjTGpQsPRHsd9zE" &&
          tokenAddress === "2LmeQwAKJPcyUeQKS7CzNMRGyoQt1FsZbUrHCQBdbonk") {
        
        const tokenAccountAddress = "GC6XPwiSa8zCRtUf8XXVjnJPB5mnJyo6FA9EanD8t4Jk";
        
        // Get token account info from Solscan API
        const response = await fetch(`https://api.solscan.io/account?address=${tokenAccountAddress}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'token': solscanApiKey
          }
        });
        
        if (!response.ok) {
          throw new Error(`Solscan API error: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data && data.data && data.data.tokenInfo) {
          const tokenInfo = data.data.tokenInfo;
          return {
            amount: parseInt(tokenInfo.amount || "0"),
            decimals: parseInt(tokenInfo.decimals || "6")
          };
        }
      }
    } catch (solscanError) {
      console.error('Error with Solscan API, falling back to RPC:', solscanError);
    }
    
    // Fallback to using the QuickNode RPC endpoint (with cache-busting query parameter)
    const timestamp = Date.now();
    console.log('Trying RPC endpoint: https://green-restless-silence.solana-mainnet.quiknode.pro/b8ff0d28d7f30e4190568de541e32f6a607f4680/');
    const rpcEndpoint = `https://green-restless-silence.solana-mainnet.quiknode.pro/b8ff0d28d7f30e4190568de541e32f6a607f4680/?t=${timestamp}`;
    
    // For the BANI token
    if (walletAddress === "H8r7GkQktUQNdA98tpVHuE3VupjTKpjTGpQsPRHsd9zE" &&
        tokenAddress === "2LmeQwAKJPcyUeQKS7CzNMRGyoQt1FsZbUrHCQBdbonk") {
      
      // Use the known token account address
      const tokenAccountAddress = "GC6XPwiSa8zCRtUf8XXVjnJPB5mnJyo6FA9EanD8t4Jk";
      
      // Prepare RPC request to get token account info
      const response = await fetch(rpcEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'getTokenAccountBalance',
          params: [tokenAccountAddress]
        })
      });
      
      if (!response.ok) {
        throw new Error(`Solana RPC error: ${response.statusText}`);
      }
      
      const data: SolanaRpcResponse = await response.json();
      
      if (data.result && data.result.value) {
        const { amount, decimals } = data.result.value;
        // Successfully fetched the token balance from RPC
        return {
          amount: parseInt(amount),
          decimals: parseInt(decimals)
        };
      }
    }
    
    // If all methods fail, we need to throw an error to ensure we don't use fallback data
    throw new Error('Failed to fetch token balance from both Solscan and RPC');
    
  } catch (error) {
    console.error('Error retrieving token balance:', error);
    throw error; // Re-throw to prevent fallback data from being used
  }
}

/**
 * Get token price from DexScreener API
 */
export async function getTokenMetadata(tokenAddress: string): Promise<TokenMetadata> {
  try {
    // Add cache-busting query parameter
    const timestamp = Date.now();
    
    // For the specific token we're tracking (BANI)
    if (tokenAddress === "2LmeQwAKJPcyUeQKS7CzNMRGyoQt1FsZbUrHCQBdbonk") {
      // Make the API request with cache-busting
      const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}?t=${timestamp}`);
      
      if (!response.ok) {
        throw new Error(`DexScreener API error: ${response.statusText}`);
      }
      
      const data: DexscreenerResponse = await response.json();
      
      if (data.pairs && data.pairs.length > 0) {
        // Use the most liquid pair (first in the response)
        const pair = data.pairs[0];
        
        return {
          price: parseFloat(pair.priceUsd),
          name: pair.baseToken.name,
          symbol: pair.baseToken.symbol
        };
      }
      
      // If no pairs, try an alternative API (Jupiter Aggregator price API)
      console.log('No pairs found in DexScreener, trying alternative API');
      const jupiterResponse = await fetch(`https://price.jup.ag/v4/price?ids=${tokenAddress}&t=${timestamp}`);
      
      if (jupiterResponse.ok) {
        const jupiterData = await jupiterResponse.json();
        if (jupiterData.data && jupiterData.data[tokenAddress]) {
          const price = jupiterData.data[tokenAddress].price;
          return {
            price,
            name: "BONK SPIRIT ANIMAL",
            symbol: "BANI"
          };
        }
      }
      
      // If we couldn't get data from either source, throw error to prevent using stale data
      throw new Error('Could not retrieve price data from any source');
    }
    
    // For any other token (should not be reached in this app)
    throw new Error('Unsupported token');
  } catch (error) {
    console.error('Error fetching token price:', error);
    throw error; // Re-throw to prevent using fallback data
  }
}
