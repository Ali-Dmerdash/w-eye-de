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

// --- Market Service Types ---

export interface SwotAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface PricingComparison {
  competitors: Record<string, string>; // e.g., { Xiaomi: "232 (Source...)" }
  discount_strategies: string[];
}

export interface CompetitivePositioning {
  metrics: string[];
  // Use Record<string, (string | number)[]> to allow mixed types in scores array
  scores: Record<string, (string | number)[]>;
  visualization_note: string;
}

export interface MarketTrend {
  name: string;
  growth: string;
  impact: string; // e.g., "high", "medium"
}

export interface MarketAnalysis {
  trends: MarketTrend[];
  market_share: Record<string, string>; // e.g., { Xiaomi: "12% (Source...)" }
}

export interface Recommendations {
  immediate_actions: string[];
  strategic_initiatives: string[];
  urgent_alerts: string[];
}

export interface MarketModelResponse {
  _id: string;
  id: number;
  swot_analysis: SwotAnalysis;
  pricing_comparison: PricingComparison;
  competitive_positioning: CompetitivePositioning;
  market_analysis: MarketAnalysis;
  recommendations: Recommendations;
}

// --- Revenue Service Types ---

export interface RevenueKeyFactors {
  [key: string]: string; // e.g., "Seasonal Demand": "0.3/Medium"
}

export interface RevenueAnalysis {
  insights: string;
  recommendation: string;
}

export interface RevenueTrend {
  _id: string;
  revenue_forecast: string; // e.g., "$1,234,563"
  confidence_level: string; // e.g., "High"
  key_factors: RevenueKeyFactors;
  analysis: RevenueAnalysis;
  monthly_forecast_next_year?: Record<string, string>; // e.g., { January: "$175,000", ... }
}

export interface RawRevenueApiResponse {
  success: boolean;
  trends: RevenueTrend[];
}
