export interface Indicator {
  id: string;
  name: string;
  section: string;
  status: 'SIM' | 'NÃO' | 'IGUAL';
  currentValue: number;
  goalValue: number;
  projection2025: number[]; // 12 months
  trend: 'up' | 'down' | 'stable';
}

export interface DashboardState {
  indicators: Indicator[];
  sections: string[];
  lastUpdated: string;
}
