import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { FraudModelResponse } from "@/state/type";

export const Api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3001/api", // Corrected base URL
  }),
  tagTypes: ["FraudData"],
  endpoints: (builder) => ({
    // The type here should likely be FraudModelResponse[] based on the JSON sample
    getFraudData: builder.query<FraudModelResponse[], void>({
      query: () => "/fraud/results",
      providesTags: ["FraudData"],
    }),
  }),
});

export const { useGetFraudDataQuery } = Api;
