"use client";
import { useGetFraudDataQuery } from "@/state/api";
import { FraudModelResponse } from "@/state/type"; // Import the shared type

// Helper function to get a safe error message string
function getErrorMessage(error: unknown): string {
  if (!error) {
    return "An unknown error occurred";
  }
  if (typeof error === "object" && error !== null) {
    if ("status" in error) {
      return `Error: ${error.status}`;
    }
    if ("message" in error && typeof error.message === "string") {
      return error.message;
    }
  }
  // Fallback for other types of errors or if message is not a string
  try {
    return String(error);
  } catch {
    return "An unknown error occurred";
  }
}

export default function FraudInc() {
  const { data: fraudDataArray, isLoading, error } = useGetFraudDataQuery();
  const fraudDataState: FraudModelResponse | undefined = fraudDataArray?.[0];

  // --- Loading State ---
  if (isLoading)
    return (
      <div className="bg-[#4B65AB] dark:bg-[#1d2328] text-white font-bayon p-6 rounded-xl h-full flex flex-col ">
        {/* Skeleton remains the same */}
        <div className="shadow-lg">
          <div className="bg-[#AEC3FF]/50 dark:bg-[#243461] shadow-inner-custom p-6 rounded-xl text-center mb-6">
            <div className="h-6 w-48 mx-auto dark:bg-slate-600/50 bg-gray-300/50 rounded mb-4 animate-pulse" />
            <div className="h-12 w-32 mx-auto dark:bg-red-800/50 bg-red-700/50 rounded animate-pulse" />
          </div>
        </div>
        <div className="w-full border-t border-gray-700 mb-6"></div>
        <div className="flex-grow">
          <div className="h-6 w-60 dark:bg-gray-700/50 bg-gray-300/50 rounded mb-6 animate-pulse" />
          <ul className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <li key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-12 dark:bg-gray-700/50 bg-gray-400/50 rounded animate-pulse" />
                  <div className="h-4 w-48 dark:bg-gray-700/50 bg-gray-300/50 rounded animate-pulse" />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );

  // --- Error State ---
  if (error) {
    const errorMessage = getErrorMessage(error); // Use the helper function
    return (
      <div className="text-red-500 p-6 bg-[#4B65AB] dark:bg-[#1d2328] rounded-xl h-full flex items-center justify-center">
        Error: {errorMessage}
      </div>
    );
  }

  // --- No Data State ---
  if (!fraudDataState) {
    return (
      <div className="text-white p-6 bg-[#4B65AB] dark:bg-[#1d2328] rounded-xl h-full flex items-center justify-center">
        No data available.
      </div>
    );
  }

  // --- Success State ---
  return (
    <div className="bg-[#4B65AB] dark:bg-[#1d2328] text-white font-bayon p-6 rounded-xl h-full flex flex-col">
      {/* Content remains the same */}
      <div className="shadow-lg">
        <div className="bg-[#AEC3FF]/50 dark:bg-[#243461] shadow-inner-custom p-6 rounded-xl text-center mb-6">
          <h2 className="text-2xl tracking-wider text-white mb-2">
            FRAUD INCIDENCE RATE
          </h2>
          <p className="text-5xl dark:text-red-600 text-red-700">
            {fraudDataState.fraud_metrics.incident_rate}
          </p>
        </div>
      </div>
      <div className="w-full border-t border-gray-700 mb-6"></div>
      <div className="flex-grow">
        <h3 className="text-lg font-bold mb-4 font-mulish">
          COMMON FRAUDULENT PATTERNS
        </h3>
        <ul className="space-y-4">
          {Object.entries(fraudDataState.fraud_metrics.common_patterns).map(
            ([pattern, percentage], index) => (
              <li key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl dark:text-white text-[#AEC3FF]">
                    {percentage}
                  </span>
                  <span className="dark:text-gray-400 text-[#AEC3FF]/70 uppercase text-sm font-mulish">
                    {pattern.endsWith(".") ? pattern.slice(0, -1) : pattern}
                  </span>
                </div>
              </li>
            )
          )}
        </ul>
      </div>
    </div>
  );
}
