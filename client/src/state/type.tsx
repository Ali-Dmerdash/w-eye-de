// Based on the provided JSON structure

// Type for individual transactions
export interface Transaction {
  // Added export
  _id?: string; // Optional if backend provides it
  name: string;
  amount: number;
  currency: string;
  flag: string; // e.g., "orange", "green"
  date: string; // e.g., "2025-04-20"
  description: string;
  category: string;
  type: string; // e.g., "Credit", "Debit"
  fraud_rate: number;
}

// Type for fraud rate over time data points
export interface FraudRateOverTime {
  // Added export
  date: string; // e.g., "2025-04-20"
  fraud_rate: number;
}

// Type for fraud metrics
export interface FraudMetrics {
  // Added export
  incident_rate: string; // e.g., "83%"
  // Using Record<string, string> for dynamic keys like "CARD-NOT-PRESENT TRANSACTIONS"
  common_patterns: Record<string, string>;
}

// Type for analysis
export interface Analysis {
  // Added export
  cause: string;
  recommendation: string;
}

// Main response structure for a single fraud data entry
export interface FraudModelResponse {
  _id: string;
  intent: string;
  category: string;
  fraud_metrics: FraudMetrics;
  analysis: Analysis;
  transactions: Transaction[];
  fraud_rate_over_time: FraudRateOverTime[];
  // Optional: If the API might include column definitions
  columns?: ApiColumnDefinition[];
}

// Optional: Define type for API column definitions if used
export interface ApiColumnDefinition {
  // Added export
  key: string;
  label: string;
  required?: boolean;
  description?: string;
}

// Note: The API endpoint /fraud/results returns an array: FraudModelResponse[]
