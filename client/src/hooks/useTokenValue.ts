import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { getTokenBalance, getTokenMetadata } from "@/lib/solana";

interface TokenData {
  usdValue: number;
  balance: number;
  price: number;
  timestamp?: number;
}

export default function useTokenValue(walletAddress: string, tokenAddress: string) {
  const [previousData, setPreviousData] = useState<TokenData | null>(null);
  const [dayStartData, setDayStartData] = useState<TokenData | null>(null);
  const [initialDataSet, setInitialDataSet] = useState(false);

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
            price,
            timestamp: Date.now()
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

  // Store previous data and manage reference points
  useEffect(() => {
    if (tokenData) {
      // Update previous data for immediate changes
      if (!previousData || 
          tokenData.usdValue !== previousData.usdValue ||
          tokenData.balance !== previousData.balance ||
          tokenData.price !== previousData.price
      ) {
        setPreviousData(tokenData);
      }

      // Set initial reference point to $0
      if (!initialDataSet) {
        setDayStartData({
          ...tokenData,
          usdValue: 0,
          timestamp: Date.now() - (24 * 60 * 60 * 1000) // 24 hours ago
        });
        setInitialDataSet(true);
      }
      // Update 24-hour reference point after initial period
      else if (dayStartData && 
          tokenData.timestamp && dayStartData.timestamp && 
          tokenData.timestamp - dayStartData.timestamp >= 24 * 60 * 60 * 1000
      ) {
        setDayStartData(tokenData);
      }
    }
  }, [tokenData, initialDataSet]);

  return {
    tokenData,
    isLoading,
    isError,
    refetch,
    previousData,
    dayStartData
  };
}