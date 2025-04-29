import React, { useState } from "react"; // Import React
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import revenueData from "../revenueData.json"; // Correct path from src/components to src

const Analysis: React.FC = () => {
  // Add React.FC type
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Add type for state

  // Access data directly from the imported JSON object
  const forecast = revenueData;

  return (
    <div className="flex items-start justify-center flex-wrap">
      <Card className="w-full bg-primary text-white border-none">
        <CardHeader className="text-center">
          <h2 className="text-4xl font-bayon">Analysis</h2>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center font-mulish text-gray-400">
            <p className="text-sm">{forecast.analysis.insights}</p>

            <div className="pt-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className="block text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Recommendation
              </button>

              {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="bg-[#1D2328] rounded-lg p-6 max-w-md w-full shadow-lg dark:bg-gray-700">
                    <h3 className="text-lg font-semibold text-gray-200 dark:text-white">
                      Model Recommendation
                    </h3>
                    <p className="mt-2 text-sm text-gray-400 dark:text-gray-300">
                      {forecast.analysis.recommendation}
                    </p>
                    <div className="flex justify-end mt-4">
                      <button
                        onClick={() => setIsModalOpen(false)}
                        className="block text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analysis;
