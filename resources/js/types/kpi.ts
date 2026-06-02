export interface ParetoItem {
    label: string;
    count: number;
    percent: number;
    cumulative: number;
}

export interface AmdecItem {
    component: string;
    gravity: number;
    occurrence: number;
    detection: number;
    criticality: number;
    level: 'critique' | 'important' | 'modere';
}

export interface KpiTrends {
    mtbf: number;
    mttr: number;
    availability: number;
    pannesCount: number;
}

export interface HistoryItem {
    month: string;
    mtbf: number;
    mttr: number;
}

export interface KpiData {
    mtbf: number;
    mttr: number;
    availability: number;
    pannesCount: number;
    trends: KpiTrends;
    pareto: ParetoItem[];
    amdec: AmdecItem[];
    history: HistoryItem[];
    computed_at: string;
}
