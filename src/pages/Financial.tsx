import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

export default function Financial() {
  const { data: financialData, isLoading } = useQuery({
    queryKey: ['financial-overview'],
    queryFn: async () => {
      // TODO: Implement financial data fetching
      return {
        payables: 0,
        receivables: 0,
        availableFunds: 0
      };
    },
  });

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-4rem)] w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Financial Overview</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Payables</h3>
          <p className="text-2xl font-semibold mt-2">${financialData?.payables.toFixed(2)}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Receivables</h3>
          <p className="text-2xl font-semibold mt-2">${financialData?.receivables.toFixed(2)}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Available Funds</h3>
          <p className="text-2xl font-semibold mt-2">${financialData?.availableFunds.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}