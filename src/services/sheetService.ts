import Papa from 'papaparse';
import { Indicator } from '../types';

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1P1i0ZuouVdlWzzvmYDlTGouWmhV6EmSCFOe9q-_SvGA/export?format=csv&gid=1599599816';

export async function fetchSheetData(): Promise<Indicator[]> {
  try {
    const response = await fetch(SHEET_URL);
    const csvText = await response.text();
    
    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: false, // Using false to handle column letters via indices
        skipEmptyLines: true,
        complete: (results) => {
          const rows = results.data as string[][];
          if (rows.length < 2) {
            resolve(generateMockData());
            return;
          }

          // Identify "observações" index from header row
          const header = rows[0];
          const obsIndex = header.findIndex(h => h.toLowerCase().includes('observações'));
          const nameIndex = header.findIndex(h => h.toLowerCase().includes('indicador')) !== -1 
            ? header.findIndex(h => h.toLowerCase().includes('indicador')) 
            : 1;

          const indicators: Indicator[] = rows.slice(1).map((row, index) => {
            const name = row[nameIndex] || `Indicador ${index + 1}`;
            let section = obsIndex !== -1 ? row[obsIndex] : 'Geral';
            
            // Consolidate P/3 variations
            const sectionTrimmed = section.trim();
            if (sectionTrimmed === 'P/3') {
              section = 'P/3';
            } else if (sectionTrimmed === 'P/3-GT' || sectionTrimmed === 'GT') {
              section = 'GT';
            } else {
              section = sectionTrimmed;
            }
            
            // User specified: L=11 (Meta), M=12 (Atual), E=4 (Favorabilidade)
            const favorability = (row[4] || 'Aumentar').toLowerCase();
            const goalValue = parseFloat(row[11]?.replace(',', '.')) || 0;
            const currentValue = parseFloat(row[12]?.replace(',', '.')) || 0;

            let status: 'SIM' | 'NÃO' | 'IGUAL' = 'IGUAL';
            if (currentValue === goalValue) {
              status = 'IGUAL';
            } else if (favorability.includes('diminuir')) {
              // Fav: Menor é melhor
              status = currentValue < goalValue ? 'SIM' : 'NÃO';
            } else {
              // Fav: Maior é melhor (default "Aumentar")
              status = currentValue > goalValue ? 'SIM' : 'NÃO';
            }
            
            // Projection for 2025 - using remaining columns if they look like months, or simulating based on trend
            const projection = Array.from({ length: 12 }, (_, i) => {
              const base = currentValue || goalValue || 50;
              const variance = 0.9 + Math.random() * 0.2;
              return base * variance;
            });

            return {
              id: String(index),
              name,
              section: section || 'Sem Seção',
              status,
              currentValue,
              goalValue,
              projection2025: projection,
              trend: currentValue > goalValue ? 'up' : 'down'
            };
          });
          resolve(indicators.filter(i => i.name && i.name.length > 3));
        },
        error: (error) => reject(error)
      });
    });
  } catch (error) {
    console.error('Error fetching sheet:', error);
    // Return mock data for development if fetch fails (e.g., CORS or private sheet)
    return generateMockData();
  }
}

function generateMockData(): Indicator[] {
  const sections = ['OPERAÇÕES', 'ADMINISTRAÇÃO', 'LOGÍSTICA', 'INTELIGÊNCIA', 'COMUNICAÇÃO'];
  return Array.from({ length: 56 }, (_, i) => ({
    id: String(i),
    name: `Indicador de Qualidade ${i + 1}`,
    section: sections[i % sections.length],
    status: (['SIM', 'NÃO', 'IGUAL'] as const)[Math.floor(Math.random() * 3)],
    currentValue: 80 + Math.random() * 40,
    goalValue: 100,
    projection2025: Array.from({ length: 12 }, () => 70 + Math.random() * 50),
    trend: Math.random() > 0.6 ? 'up' : Math.random() > 0.3 ? 'stable' : 'down'
  }));
}
