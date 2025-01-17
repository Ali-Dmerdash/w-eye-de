/*  NOT ALL DATA IS THE DATA THAT SHOULD BE GIVEN BY THE MODEL (THE DATA IS JUST AN EXAMPLE OF WHAT THE DASHBOARD SHOULD HAVE AS A DATA) 

    Transaction Table
        cols: id,name of one doing the transaction, date, description, amount, category , type, currency, fraud rate, flag
        
        Green: Fraud rate ≤ 0.05 (low likelihood).
        Orange: 0.05 < Fraud rate ≤ 0.20 (medium likelihood).
        Red: Fraud rate > 0.20 (high likelihood).
    
    Fraud rate graph
        cols: date, fraud rate
    
    fraud incident rate
        cols: main percentage, common fraudlent patterns (percentages of each type of fraud)

    AI recommendation ( analysis of the data)
        cols: cause, recommendation

    Bichart of fraud risk score distribution
        cols: score (percentage) => transaction is divided on three categories (risk, medium risk, no risk) the bi chart represents percentage of each category of each transaction

*/
//   {
//     clientId: 102,
//     transactionData: [
//       {
//         id: 3,
//         name: "Jane Smith",
//         date: "2025-01-14",
//         description: "grouped Payment",
//         amount: 45.8,
//         category: "Salaries",
//         type: "Debit",
//         currency: "USD",
//         fraudRate: 0.05,
//         flag: "Green",
//       },
//       {
//         id: 4,
//         name: "Jane Smith",
//         date: "2025-01-12",
//         description: "Utility Bill",
//         amount: 89.9,
//         category: "Utilities",
//         type: "Debit",
//         currency: "USD",
//         fraudRate: 0.03,
//         flag: "Green",
//       },
//     ],
//     fraudRateGraphData: [
//       { date: "2025-01-12", fraudRate: 0.03 },
//       { date: "2025-01-14", fraudRate: 0.05 },
//     ],
//     fraudIncidentRateData: {
//       mainPercentage: 0.05,
//       commonFraudulentPatterns: [
//         { type: "Account Takeover", percentage: 0.15 },
//         { type: "Identity Theft", percentage: 0.3 },
//       ],
//     },
//     aiRecommendations: [
//       {
//         cause: "High-value transaction flagged",
//         recommendation:
//           "Require additional authentication for transactions above $1,000.",
//       },
//       {
//         cause: "Repeated small transactions",
//         recommendation: "Monitor for potential card testing fraud.",
//       },
//     ],
//     fraudRiskScoreBiChartData: [
//       { date: "2025-01-12", risk: 15, mediumRisk: 35, noRisk: 50 },
//       { date: "2025-01-14", risk: 10, mediumRisk: 30, noRisk: 60 },
//     ],
//   },

// data.ts
export type FraudRateGraphData = {
  date: string;
  fraudRate: number;
};

export type TransactionData = {
  id: number;
  name: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  type: string;
  currency: string;
  fraudRate: number;
  flag: string;
};

export type FraudIncidentRateData = {
  mainPercentage: number;
  commonFraudulentPatterns: { type: string; percentage: number }[];
};

export type AIRecommendation = {
  cause: string;
  recommendation: string;
};

export type FraudRiskScoreBiChartData = {
  risk: number;
  mediumRisk: number;
  noRisk: number;
};

export type ClientData = {
  clientId: number;
  transactionData: TransactionData[];
  fraudRateGraphData: FraudRateGraphData[];
  fraudIncidentRateData: FraudIncidentRateData;
  AmmenReport: AIRecommendation;
  aiRecommendations: AIRecommendation[];
  fraudRiskScoreBiChartData: FraudRiskScoreBiChartData[];
};

export const clientData: ClientData[] = [
  {
    clientId: 101,
    transactionData: [
      {
        id: 1,
        name: "John Doe",
        date: "2025-01-15",
        description: "Online Purchase",
        amount: 120.5,
        category: "Tools",
        type: "Debit",
        currency: "USD",
        fraudRate: 0.12,
        flag: "Orange",
      },
      {
        id: 2,
        name: "John Doe",
        date: "2025-01-13",
        description: "Travel Expense",
        amount: 320.75,
        category: "Travel",
        type: "Debit",
        currency: "USD",
        fraudRate: 0.18,
        flag: "Orange",
      },
    ],
    fraudRateGraphData: [
      { date: "2025-01-13", fraudRate: 0.18 },
      { date: "2025-01-15", fraudRate: 0.12 },
      { date: "2025-01-10", fraudRate: 0.15 },
      { date: "2025-01-11", fraudRate: 0.05 },
      { date: "2025-01-12", fraudRate: 0.09 },
      { date: "2025-01-13", fraudRate: 0.18 },
      { date: "2025-01-14", fraudRate: 0.22 },
      { date: "2025-01-15", fraudRate: 0.12 },
      { date: "2025-01-16", fraudRate: 0.07 },
      { date: "2025-01-17", fraudRate: 0.1 },
    ],
    fraudIncidentRateData: {
      mainPercentage: 0.07,
      commonFraudulentPatterns: [
        { type: "Phishing", percentage: 0.25 },
        { type: "Card Skimming", percentage: 0.2 },
      ],
    },
    AmmenReport: {
      cause: "High-value transaction flagged",
      recommendation:
        "Require additional authentication for transactions above $1,000.",
    },
    aiRecommendations: [
      {
        cause: "Unusual transaction location",
        recommendation: "Enable location-based transaction alerts.",
      },
      {
        cause: "Large transaction during odd hours",
        recommendation:
          "Notify the customer immediately and verify the transaction.",
      },
    ],
    fraudRiskScoreBiChartData: [
      { risk: 25, mediumRisk: 40, noRisk: 35 },
      { risk: 20, mediumRisk: 25, noRisk: 55 },
    ],
  },
];
