import TokenValueTracker from "@/components/TokenValueTracker";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <TokenValueTracker 
        walletAddress="H8r7GkQktUQNdA98tpVHuE3VupjTKpjTGpQsPRHsd9zE"
        tokenAddress="2LmeQwAKJPcyUeQKS7CzNMRGyoQt1FsZbUrHCQBdbonk"
      />
    </div>
  );
}
