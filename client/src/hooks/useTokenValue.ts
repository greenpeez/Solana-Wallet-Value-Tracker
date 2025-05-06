import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { getTokenBalance, getTokenMetadata } from "@/lib/solana";

interface TokenData {
  usdValue: number;
  balance: number;
  price: number;
}

export default function useTokenValue(walletAddress: string, tokenAddress: string) {
  const [previousData, setPreviousData] = useState<{
    usdValue: number;
    balance: number;
    price: number;
  } | null>(null);

  const {
    data: tokenData,
    isLoading,
    isError,
    refetch
  } = useQuery<TokenData | null>({
    queryKey: [`token-value-${walletAddress}-${tokenAddress}`],
    queryFn: async () => {
      try {
        // For BANI token in the specified wallet, we'll use accurate values
        if (walletAddress === "H8r7GkQktUQNdA98tpVHuE3VupjTKpjTGpQsPRHsd9zE" &&
            tokenAddress === "2LmeQwAKJPcyUeQKS7CzNMRGyoQt1FsZbUrHCQBdbonk") {
          
          let balance;
          let decimals = 6;
          let price;
          
          // First try to get the balance using QuickNode RPC
          try {
            // Get token balance and metadata in parallel for efficiency
            const [balanceResult, priceResult] = await Promise.all([
              getTokenBalance(walletAddress, tokenAddress),
              getTokenMetadata(tokenAddress)
            ]);
            
            // Extract data
            const { amount, decimals: resultDecimals } = balanceResult;
            decimals = resultDecimals;
            const { price: resultPrice } = priceResult;
            
            // Convert raw amount to actual token amount based on decimals
            balance = amount / Math.pow(10, decimals);
            price = resultPrice;
          } catch (apiError) {
            console.error("API Error, using fallback methods:", apiError);
            
            // If all API methods fail, throw error to prevent using hardcoded data
            throw apiError;
          }
          
          // Calculate USD value
          const usdValue = balance * price;
          
          return {
            usdValue,
            balance,
            price
          };
        }
        
        // For any other token/wallet combo
        return null;
      } catch (error) {
        console.error("Error fetching token value:", error);
        throw error; // Re-throw to prevent fallback data
      }
    },
    refetchOnWindowFocus: true,
    refetchInterval: 10 * 1000, // 10 seconds auto-refresh for even more real-time data
    staleTime: 5 * 1000, // 5 seconds
    retry: 3,
    retryDelay: 1000,
    // Make query more aggressive to get real-time data
    gcTime: 5 * 1000 // v5 renamed cacheTime to gcTime
  });

  // Store previous data for change calculation
  useEffect(() => {
    if (tokenData) {
      if (!previousData) {
        // Initial values
        setPreviousData(tokenData);
      } else if (
        tokenData.usdValue !== previousData.usdValue ||
        tokenData.balance !== previousData.balance ||
        tokenData.price !== previousData.price
      ) {
        // Update when any value changes
        setPreviousData(tokenData);
      }
    }
  }, [tokenData]);

  return {
    tokenData,
    isLoading,
    isError,
    refetch,
    previousData
  };
}
