interface FraudMetrics {
    incident_rate: string;
    common_patterns_percentage: string;
}

interface Analysis {
    cause: string;
    recommendation: string;
}

export interface FraudModelResponse {
    intent: string;
    category: string;
    fraud_metrics: FraudMetrics;
    analysis: Analysis;
}