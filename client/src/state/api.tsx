import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { FraudModelResponse } from "@/state/type";

export const Api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://w-eye-de-production.up.railway.app/api/",
  }),
  tagTypes: ["FraudData"],
  endpoints: (builder) => ({
    getFraudData: builder.query<FraudModelResponse, void>({
      query: () => "/fraud/detect",
      providesTags: ["FraudData"],
    }),
  }),
});

export const { useGetFraudDataQuery } = Api;
