import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import BiChart from "@/app/fraud-page/[[...fraud-page]]/components/biChart";

const FraudInc = () => {
  return (
    <div className="flex items-start justify-center w-full h-full flex-wrap">
      <Tabs
        defaultValue="account"
        className="w-[400px] rounded-lg bg-primary shadow p-6"
      >
        <TabsList className="flex bg-primary">
          <TabsTrigger
            value="account"
            className="px-4 py-2 font-medium border-b-2 border-transparent data-[state=active]:border-black"
          >
            Rate
          </TabsTrigger>
          <TabsTrigger
            value="password"
            className="px-4 py-2 font-medium border-b-2 border-transparent data-[state=active]:border-black"
          >
            Patterns
          </TabsTrigger>
        </TabsList>
        <TabsContent value="account" className="mt-4">
          <div className="mt-6 flex items-center justify-center">
            {/* Fraud Incidence Rate Card */}
            <div className="w-full p-4 bg-blue-900 rounded-lg shadow-lg text-center">
              <h3 className="text-sm font-semibold text-white mb-2">
                FRAUD INCIDENCE RATE
              </h3>
              <p className="text-4xl font-bold text-red-600">90%</p>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="password" className="mt-4">
          {/* <h2 className="text-lg font-semibold">Password</h2>
          <p className="text-sm text-gray-600 mb-4">
            Change your password here.
          </p> */}
          <div className="mt-6 flex items-center justify-center">
            {/* Common Fraudulent Patterns Card */}
            <div className="w-full p-4 bg-blue-900 rounded-lg shadow-lg">
              <h3 className="text-sm font-semibold text-white mb-4">
                COMMON FRAUDULENT PATTERNS
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-white">
                  <span className="text-2xl font-bold">60%</span>
                  <span className="text-sm">
                    Card-not-present transactions.
                  </span>
                </div>
                <div className="flex items-center justify-between text-white">
                  <span className="text-2xl font-bold">25%</span>
                  <span className="text-sm">Transactions from high-risk.</span>
                </div>
                <div className="flex items-center justify-between text-white">
                  <span className="text-2xl font-bold">15%</span>
                  <span className="text-sm">Account takeovers.</span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        <BiChart />
      </Tabs>
    </div>
  );
};

export default FraudInc;
