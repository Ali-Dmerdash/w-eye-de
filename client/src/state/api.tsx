import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// Import all response types
import {
  FraudModelResponse,
  MarketModelResponse,
  RevenueTrend,
  RawRevenueApiResponse,
} from "@/state/type"; // Added RevenueTrend, RawRevenueApiResponse

export const Api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3001/api", // Base URL for all API endpoints
  }),
  // Add tag types for all data sets
  tagTypes: ["FraudData", "MarketData", "RevenueData"], // Added RevenueData
  endpoints: (builder) => ({
    // Fraud data endpoint (existing)
    getFraudData: builder.query<FraudModelResponse[], void>({
      query: () => "/fraud/results",
      providesTags: ["FraudData"],
    }),
    // Market data endpoint (existing)
    getMarketData: builder.query<MarketModelResponse[], void>({
      query: () => "/market/results", // Endpoint for market data
      providesTags: ["MarketData"], // Tag for caching/invalidation
    }),
    // Revenue data endpoint (new)
    getRevenueData: builder.query<RevenueTrend[], void>({
      query: () => "/revenue/results", // Endpoint for revenue data
      providesTags: ["RevenueData"], // Tag for caching/invalidation
      // Transform the response to extract the 'trends' array
      transformResponse: (response: RawRevenueApiResponse) => {
        return response.trends;
      },
    }),
  }),
});

// Export hooks for all endpoints
export const {
  useGetFraudDataQuery,
  useGetMarketDataQuery,
  useGetRevenueDataQuery,
} = Api; // Added useGetRevenueDataQuery
