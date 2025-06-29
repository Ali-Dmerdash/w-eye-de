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
    // Download fraud report endpoint (PDF)
    downloadFraudReport: builder.mutation<any, void>({
      query: () => ({
        url: "/fraud/pdf",
        method: "GET",
        responseHandler: async (response) => {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `fraud-detection-report-${new Date().toISOString().split('T')[0]}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          return { success: true };
        },
      }),
    }),
    // Download revenue report endpoint (PDF)
    downloadRevenueReport: builder.mutation<any, void>({
      query: () => ({
        url: "/revenue/pdf",
        method: "GET",
        responseHandler: async (response) => {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `revenue-report-${new Date().toISOString().split('T')[0]}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          return { success: true };
        },
      }),
    }),
    // Download market report endpoint
    downloadMarketReport: builder.mutation<any, void>({
      query: () => ({
        url: "/market/download-report",
        method: "GET",
        responseHandler: async (response) => {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `market-analysis-report-${new Date().toISOString().split('T')[0]}.json`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          return { success: true };
        },
      }),
    }),
    // Download revenue JSON report endpoint
    downloadRevenueJsonReport: builder.mutation<any, void>({
      query: () => ({
        url: "/revenue/download-report",
        method: "GET",
        responseHandler: async (response) => {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `revenue-report-${new Date().toISOString().split('T')[0]}.json`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          return { success: true };
        },
      }),
    }),
    // Download fraud PDF report endpoint
    downloadFraudReportPdf: builder.mutation<any, void>({
      query: () => ({
        url: "/fraud/pdf",
        method: "GET",
        responseHandler: async (response) => {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `fraud-detection-report-${new Date().toISOString().split('T')[0]}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          return { success: true };
        },
      }),
    }),
    // Download market PDF report endpoint
    downloadMarketReportPdf: builder.mutation<any, void>({
      query: () => ({
        url: "/market/pdf",
        method: "GET",
        responseHandler: async (response) => {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `market-analysis-report-${new Date().toISOString().split('T')[0]}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          return { success: true };
        },
      }),
    }),
  }),
});

// Export hooks for all endpoints
export const {
  useGetFraudDataQuery,
  useGetMarketDataQuery,
  useGetRevenueDataQuery,
  useDownloadFraudReportMutation,
  useDownloadRevenueReportMutation,
  useDownloadMarketReportMutation,
  useDownloadMarketReportPdfMutation,
} = Api; // Added useDownloadMarketReportPdfMutation
