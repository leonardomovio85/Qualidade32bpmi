import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Indicator } from '../types';

export const generateIndicatorsPDF = (indicators: Indicator[], title: string) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.setTextColor(22, 101, 192); // Blue 800
  doc.text('32º BPM/I - Painel de Gestão', 14, 22);
  
  doc.setFontSize(14);
  doc.setTextColor(100);
  doc.text(`Relatório de Indicadores: ${title}`, 14, 32);
  
  doc.setFontSize(10);
  doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')}`, 14, 40);

  // Summary Table
  const total = indicators.length;
  const sim = indicators.filter(i => i.status === 'SIM').length;
  const nao = indicators.filter(i => i.status === 'NÃO').length;
  const igual = indicators.filter(i => i.status === 'IGUAL').length;

  autoTable(doc, {
    startY: 45,
    head: [['Indicador', 'Dados']],
    body: [
      ['Total de Indicadores', total.toString()],
      ['Meta Atingida (SIM)', sim.toString()],
      ['Fora da Meta (NÃO)', nao.toString()],
      ['Estável (IGUAL)', igual.toString()],
    ],
    theme: 'striped',
    headStyles: { fillColor: [22, 101, 192], textColor: [255, 255, 255] },
  });

  // Main Table
  const tableData = indicators.map(i => [
    i.name,
    i.section,
    i.status,
    i.goalValue.toFixed(2),
    i.currentValue.toFixed(2)
  ]);

  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 10,
    head: [['Nome', 'Seção', 'Status', 'Meta', 'Atual']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [31, 41, 55] },
    columnStyles: {
      0: { cellWidth: 70 },
      1: { cellWidth: 40 },
      2: { cellWidth: 30 },
      3: { cellWidth: 25 },
      4: { cellWidth: 25 },
    },
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 2) {
        const val = data.cell.raw;
        if (val === 'SIM') data.cell.styles.textColor = [16, 185, 129];
        if (val === 'NÃO') data.cell.styles.textColor = [244, 63, 94];
        if (val === 'IGUAL') data.cell.styles.textColor = [245, 158, 11];
      }
    }
  });

  doc.save(`Relatorio_Indicadores_${title.replace(/\s+/g, '_')}_${Date.now()}.pdf`);
};
