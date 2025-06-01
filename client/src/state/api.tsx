import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// Import both response types
import { FraudModelResponse, MarketModelResponse } from "@/state/type";

export const Api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3001/api", // Base URL for all API endpoints
  }),
  // Add tag types for both data sets
  tagTypes: ["FraudData", "MarketData"],
  endpoints: (builder) => ({
    // Fraud data endpoint (existing)
    getFraudData: builder.query<FraudModelResponse[], void>({
      query: () => "/fraud/results",
      providesTags: ["FraudData"],
    }),
    // Market data endpoint (new)
    getMarketData: builder.query<MarketModelResponse[], void>({
      query: () => "/market/results", // Endpoint for market data
      providesTags: ["MarketData"], // Tag for caching/invalidation
    }),
  }),
});

// Export hooks for both endpoints
export const { useGetFraudDataQuery, useGetMarketDataQuery } = Api;
