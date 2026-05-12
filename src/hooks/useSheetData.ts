import { useState, useEffect } from 'react';
import { Indicator } from '../types';
import { fetchSheetData } from '../services/sheetService';

export function useSheetData() {
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const refreshData = async () => {
    setLoading(true);
    try {
      const data = await fetchSheetData();
      setIndicators(data);
      setLastUpdated(new Date().toLocaleTimeString('pt-BR'));
      setError(null);
    } catch (err) {
      setError('Erro ao carregar dados da planilha.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
    // Auto-refresh every 5 minutes
    const interval = setInterval(refreshData, 300000);
    return () => clearInterval(interval);
  }, []);

  const rawSections: string[] = Array.from(new Set(indicators.map(i => i.section)));
  
  const preferredOrder = ['P/1', 'P/2', 'P/3', 'P/4', 'MOTOMEC', 'P/5', 'PJMD', 'NAPS', 'UIS', 'GT'];
  
  const sections: string[] = rawSections.sort((a: string, b: string) => {
    const indexA = preferredOrder.findIndex(p => p.toUpperCase() === a.toUpperCase());
    const indexB = preferredOrder.findIndex(p => p.toUpperCase() === b.toUpperCase());
    
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    return a.localeCompare(b);
  });

  return { indicators, sections, loading, error, lastUpdated, refreshData };
}
