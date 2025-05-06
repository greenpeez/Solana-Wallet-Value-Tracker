import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import useTokenValue from "@/hooks/useTokenValue";
import { formatCurrency, formatNumber, formatTokenPrice } from "@/lib/utils";
import { RefreshCw, AlertCircle } from "lucide-react";

interface TokenValueTrackerProps {
  walletAddress: string;
  tokenAddress: string;
}

export default function TokenValueTracker({ walletAddress, tokenAddress }: TokenValueTrackerProps) {
  const { toast } = useToast();
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval] = useState("60"); // Default to 1 minute
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const { 
    tokenData, 
    isLoading, 
    isError, 
    refetch,
    previousValue
  } = useTokenValue(walletAddress, tokenAddress);

  const handleRefresh = useCallback(() => {
    refetch();
    setLastUpdated(new Date());
  }, [refetch]);

  // Format the last updated time
  const getLastUpdatedText = useCallback(() => {
    if (!lastUpdated) return "Never";
    
    const seconds = Math.floor((new Date().getTime() - lastUpdated.getTime()) / 1000);
    
    if (seconds < 5) return "Just now";
    if (seconds < 60) return `${seconds} seconds ago`;
    if (seconds < 120) return "1 minute ago";
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 7200) return "1 hour ago";
    return `${Math.floor(seconds / 3600)} hours ago`;
  }, [lastUpdated]);

  // Set up auto-refresh
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    
    if (autoRefresh) {
      const interval = parseInt(refreshInterval, 10) * 1000;
      timer = setInterval(handleRefresh, interval);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [autoRefresh, refreshInterval, handleRefresh]);

  // Initial data fetch
  useEffect(() => {
    handleRefresh();
  }, [handleRefresh]);

  // Calculate value change direction and percentage
  const getValueChangeInfo = () => {
    if (!tokenData?.usdValue || !previousValue || previousValue === 0) {
      return { direction: 'neutral', percentage: 0 };
    }
    
    const direction = tokenData.usdValue > previousValue ? 'up' : 'down';
    const percentage = ((tokenData.usdValue - previousValue) / previousValue) * 100;
    
    return { direction, percentage };
  };

  const valueChange = getValueChangeInfo();

  return (
    <div className="flex flex-col space-y-6 p-4 rounded-lg shadow-sm w-full max-w-sm">
      {/* Header with Live Data indicator */}
      <div className="flex justify-end mb-2">
        <div className="flex items-center">
          <span className="h-2 w-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
          <span className="text-xs text-black">Live Data</span>
        </div>
      </div>

      {/* Value Display */}
      <div className="rounded-lg p-6 text-center bg-primary/5 border border-primary">
        {/* Loading State - only show on initial load */}
        {isLoading && !tokenData && (
          <div>
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-black mb-2"></div>
            <p className="text-sm text-black">Fetching latest value...</p>
          </div>
        )}

        {/* Error State */}
        {isError && !isLoading && !tokenData && (
          <div>
            <div className="text-red-500 mb-2">
              <AlertCircle className="mx-auto h-8 w-8" />
            </div>
            <p className="text-red-600 text-sm font-medium">Unable to fetch token data</p>
            <p className="text-red-500 text-xs mt-1">Please try again later</p>
          </div>
        )}

        {/* Value State - show data even during refresh if we have it */}
        {tokenData && (
          <div className={isLoading ? "opacity-70" : ""}>
            <h3 className="text-sm font-medium mb-1 text-black">Donations raised</h3>
            <div className="flex items-center justify-center">
              <span className="text-3xl font-bold text-black">
                {formatCurrency(tokenData.usdValue)}
              </span>
              {valueChange.direction !== 'neutral' && (
                <span className={`ml-2 text-sm font-medium ${valueChange.direction === 'up' ? 'text-green-500' : 'text-gray-800'} flex items-center`}>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className={`h-4 w-4 mr-1 ${valueChange.direction === 'up' ? '' : 'rotate-180'}`}
                  >
                    <polyline points="18 15 12 9 6 15"></polyline>
                  </svg>
                  <span>{Math.abs(valueChange.percentage).toFixed(2)}%</span>
                </span>
              )}
            </div>

          </div>
        )}
      </div>

      {/* Token Details */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded p-3 bg-primary/5 border border-primary">
          <p className="text-xs mb-1 text-black">$BANI balance</p>
          <p className="font-medium text-black">
            {tokenData ? formatNumber(tokenData.balance) : '-'}
          </p>
        </div>
        <div className="rounded p-3 bg-primary/5 border border-primary">
          <p className="text-xs mb-1 text-black">BANI price</p>
          <p className="font-medium text-black">
            {tokenData ? formatTokenPrice(tokenData.price) : '-'}
          </p>
        </div>
      </div>
    </div>
  );
}
