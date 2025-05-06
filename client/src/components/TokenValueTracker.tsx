import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import useTokenValue from "@/hooks/useTokenValue";
import { formatCurrency, formatNumber, truncateAddress, formatTokenPrice } from "@/lib/utils";
import { RefreshCw, Copy, ExternalLink, Wallet, CheckCircle, AlertCircle } from "lucide-react";

interface TokenValueTrackerProps {
  walletAddress: string;
  tokenAddress: string;
}

export default function TokenValueTracker({ walletAddress, tokenAddress }: TokenValueTrackerProps) {
  const { toast } = useToast();
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState("60");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [copiedWallet, setCopiedWallet] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);

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
    toast({
      title: "Refreshing data",
      description: "Fetching the latest token value.",
      duration: 2000,
    });
  }, [refetch, toast]);

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
    // Set initial fetch on component mount
    handleRefresh();
  }, [handleRefresh]);

  // Handle copying addresses
  const copyToClipboard = (text: string, type: 'wallet' | 'token') => {
    navigator.clipboard.writeText(text)
      .then(() => {
        if (type === 'wallet') {
          setCopiedWallet(true);
          setTimeout(() => setCopiedWallet(false), 2000);
        } else {
          setCopiedToken(true);
          setTimeout(() => setCopiedToken(false), 2000);
        }
        
        toast({
          title: "Copied to clipboard",
          description: `${type === 'wallet' ? 'Wallet' : 'Token'} address copied.`,
          duration: 2000,
        });
      })
      .catch(() => {
        toast({
          title: "Failed to copy",
          description: "Could not copy to clipboard.",
          variant: "destructive",
        });
      });
  };

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
    <Card className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-md transition-all duration-300 border border-gray-200">
      {/* Header */}
      <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 flex justify-between items-center">
        <h2 className="text-white text-lg font-semibold flex items-center">
          <Wallet className="mr-2 h-5 w-5" />
          Solana Token Tracker
        </h2>
        <div className="flex items-center">
          <span className="h-2 w-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
          <span className="text-white text-xs">Live Data</span>
        </div>
      </CardHeader>

      {/* Main Content Area */}
      <CardContent className="p-6">
        {/* Wallet Info Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-600 text-sm font-medium">Wallet Address</h3>
            <button 
              onClick={handleRefresh}
              className="text-blue-500 hover:text-blue-700 text-sm flex items-center focus:outline-none transition-colors duration-200"
            >
              <RefreshCw className={`mr-1 h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          </div>
          <div className="bg-gray-50 rounded-md p-3 border border-gray-200 flex items-center justify-between">
            <div className="text-gray-600 text-sm font-mono truncate">
              {truncateAddress(walletAddress)}
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    className="text-gray-400 hover:text-gray-600 transition-colors" 
                    onClick={() => copyToClipboard(walletAddress, 'wallet')}
                  >
                    {copiedWallet ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy address</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Token Info Section */}
        <div className="mb-6">
          <h3 className="text-gray-600 text-sm font-medium mb-3">Token Contract</h3>
          <div className="bg-gray-50 rounded-md p-3 border border-gray-200 flex items-center justify-between">
            <div className="text-gray-600 text-sm font-mono truncate">
              {truncateAddress(tokenAddress)}
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    className="text-gray-400 hover:text-gray-600 transition-colors" 
                    onClick={() => copyToClipboard(tokenAddress, 'token')}
                  >
                    {copiedToken ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy token address</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Value Display */}
        <div className="bg-blue-50 rounded-lg p-6 border border-blue-100 text-center">
          {/* Loading State - only show on initial load */}
          {isLoading && !tokenData && (
            <div>
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2"></div>
              <p className="text-blue-500 text-sm">Fetching latest value...</p>
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
              <h3 className="text-gray-600 text-sm font-medium mb-1">Current Token Value</h3>
              <div className="flex items-center justify-center">
                <span className="text-3xl font-bold text-blue-600">
                  {formatCurrency(tokenData.usdValue)}
                </span>
                {valueChange.direction !== 'neutral' && (
                  <span className={`ml-2 text-sm font-medium ${valueChange.direction === 'up' ? 'text-green-500' : 'text-red-500'} flex items-center`}>
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
              <p className="text-gray-500 text-xs mt-2">
                Last updated: <span>{getLastUpdatedText()}</span>
              </p>
            </div>
          )}
        </div>

        {/* Token Details */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded p-3 border border-gray-200">
            <p className="text-xs text-gray-500 mb-1">Token Balance</p>
            <p className="text-gray-700 font-medium">
              {tokenData ? formatNumber(tokenData.balance) : '-'}
            </p>
          </div>
          <div className="bg-gray-50 rounded p-3 border border-gray-200">
            <p className="text-xs text-gray-500 mb-1">Token Price</p>
            <p className="text-gray-700 font-medium">
              {tokenData ? formatTokenPrice(tokenData.price) : '-'}
            </p>
          </div>
        </div>

        {/* Auto-refresh Settings */}
        <div className="mt-6 flex items-center justify-between text-sm">
          <div className="flex items-center">
            <label className="flex items-center cursor-pointer space-x-2">
              <Checkbox 
                checked={autoRefresh} 
                onCheckedChange={(checked) => setAutoRefresh(checked === true)}
                id="auto-refresh"
              />
              <span className="text-gray-600">Auto-refresh</span>
            </label>
          </div>
          <Select 
            value={refreshInterval} 
            onValueChange={setRefreshInterval}
            disabled={!autoRefresh}
          >
            <SelectTrigger className="w-[110px] h-8 text-xs">
              <SelectValue placeholder="Select interval" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">Every 30s</SelectItem>
              <SelectItem value="60">Every 1m</SelectItem>
              <SelectItem value="300">Every 5m</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>

      {/* Footer */}
      <CardFooter className="bg-gray-50 px-6 py-3 border-t border-gray-200">
        <div className="flex items-center justify-between w-full">
          <span className="text-xs text-gray-500 flex items-center">
            <span className="h-2 w-2 rounded-full bg-green-500 mr-1"></span>
            <span>Solana Mainnet</span>
          </span>
          <a 
            href={`https://explorer.solana.com/address/${walletAddress}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-500 hover:text-blue-700 text-xs flex items-center transition-colors"
          >
            <span>View on Explorer</span>
            <ExternalLink className="ml-1 h-3 w-3" />
          </a>
        </div>
      </CardFooter>
    </Card>
  );
}
