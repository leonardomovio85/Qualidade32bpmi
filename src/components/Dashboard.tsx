import React, { useMemo } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
  ResponsiveContainer as ChartContainer
} from 'recharts';
import { Indicator } from '../types';
import { motion } from 'motion/react';
import { LayoutGrid, Target, XCircle, MinusCircle, FileText } from 'lucide-react';
import { cn } from '../lib/utils';

interface DashboardProps {
  indicators: Indicator[];
  sections: string[];
}

export const Dashboard: React.FC<DashboardProps> = ({ indicators, sections }) => {
  const stats = useMemo(() => {
    const total = indicators.length;
    const sim = indicators.filter(i => i.status === 'SIM').length;
    const nao = indicators.filter(i => i.status === 'NÃO').length;
    const igual = indicators.filter(i => i.status === 'IGUAL').length;

    return {
      total,
      sim,
      nao,
      igual,
      simPercent: total > 0 ? (sim / total) * 100 : 0,
      naoPercent: total > 0 ? (nao / total) * 100 : 0,
      igualPercent: total > 0 ? (igual / total) * 100 : 0
    };
  }, [indicators]);

  const pieData = [
    { name: 'Meta Atingida', value: stats.sim, color: '#10b981' },
    { name: 'Fora da Meta', value: stats.nao, color: '#f43f5e' },
    { name: 'Estável', value: stats.igual, color: '#f59e0b' },
  ];

  const sectionData = useMemo(() => {
    return sections.map(section => {
      const sectionIndicators = indicators.filter(i => i.section === section);
      return {
        name: section,
        'Meta Atingida': sectionIndicators.filter(i => i.status === 'SIM').length,
        'Fora da Meta': sectionIndicators.filter(i => i.status === 'NÃO').length,
        'Estável': sectionIndicators.filter(i => i.status === 'IGUAL').length,
        total: sectionIndicators.length
      };
    });
  }, [indicators, sections]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataItems = payload;
      // If it's a section bar chart, payload[0].payload.total holds the section total.
      // If it's the global pie chart, payload[0].payload is the status object itself, but we can compute percent relative to global stats.total.
      const totalForPercent = payload[0].payload.total || stats.total;
      
      return (
        <div className="bg-[#0c0c0e] p-6 rounded-[2rem] border border-white/10 shadow-2xl backdrop-blur-2xl ring-1 ring-white/5 z-50 relative">
          {label && (
            <p className="text-white font-black text-xl mb-1 tracking-tighter uppercase">{label}</p>
          )}
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] mb-4">
            Resumo de Indicadores
          </p>
          
          <div className="space-y-4">
            {dataItems.map((item: any, index: number) => {
              const percent = totalForPercent > 0 ? Math.round((item.value / totalForPercent) * 100) : 0;
              if (item.value === 0) return null;

              return (
                <div key={index} className="flex items-center gap-6 group">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.fill }} />
                      <span className="text-[10px] font-black tracking-widest text-zinc-500 uppercase">{item.name}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-3xl font-mono font-black leading-none mb-1" style={{ color: item.fill }}>
                        {item.value}
                      </span>
                      <span className="text-[10px] font-mono font-medium text-yellow-400/90 bg-zinc-900 w-fit px-2 py-0.5 rounded-md">
                        {percent}% do total
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total de Indicadores', value: stats.total, icon: FileText, color: 'blue', desc: 'Monitorados no 32º BPM/I' },
          { label: 'Meta Atingida', value: stats.sim, percent: stats.simPercent, icon: Target, color: 'emerald', desc: 'dentro do esperado' },
          { label: 'Fora da Meta', value: stats.nao, percent: stats.naoPercent, icon: XCircle, color: 'rose', desc: 'Necessitam atenção imediata' },
          { label: 'Estável', value: stats.igual, percent: stats.igualPercent, icon: MinusCircle, color: 'amber', desc: 'Manutenção ou sem variação' },
        ].map((s, idx) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={s.label}
            className="bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-sm rounded-[2.5rem] p-6 shadow-sm hover:bg-zinc-900/60 transition-all group overflow-hidden relative"
          >
            <div className="relative z-10 space-y-3">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform", 
                s.color === 'blue' ? 'bg-blue-500/10 text-blue-500' : 
                s.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-500' : 
                s.color === 'rose' ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500'
              )}>
                <s.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none mb-1">{s.label}</p>
                <p className={cn("text-4xl font-mono font-bold tracking-tighter tabular-nums", 
                  s.color === 'blue' ? 'text-blue-500' : 
                  s.color === 'emerald' ? 'text-emerald-500' : 
                  s.color === 'rose' ? 'text-rose-500' : 'text-amber-500'
                )}>{s.value}</p>
              </div>
            </div>
            <div className={cn("absolute -right-4 -bottom-4 w-24 h-24 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity", 
                s.color === 'blue' ? 'bg-blue-500/10' : s.color === 'emerald' ? 'bg-emerald-500/10' : s.color === 'rose' ? 'bg-rose-500/10' : 'bg-amber-500/10'
            )} />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Progress Overview Chart */}
        <div className="lg:col-span-2 bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-sm rounded-[3rem] p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-6 w-1.5 bg-blue-600 rounded-full" />
            <h3 className="font-bold text-xl text-white tracking-tight">Status Global</h3>
          </div>
          
          <div className="h-[300px] w-full flex flex-col items-center justify-center relative">
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0">
              <span className="text-4xl font-mono font-bold text-white tracking-tighter">{Math.round(stats.simPercent)}%</span>
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Aproveitamento</span>
            </div>
            <ResponsiveContainer width="100%" height="100%" className="z-10">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={8}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={1500}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <RechartsTooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 gap-2 mt-4">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center justify-between p-3 rounded-2xl bg-zinc-800/20 border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs font-bold text-zinc-300">{item.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-mono font-bold text-zinc-500">
                    {stats.total > 0 ? Math.round((item.value / stats.total) * 100) : 0}%
                  </span>
                  <span className="font-mono text-xs font-bold text-white">{item.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section Distribution Bar Chart */}
        <div className="lg:col-span-3 bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-sm rounded-[3rem] p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="h-6 w-1.5 bg-blue-600 rounded-full" />
              <h3 className="font-bold text-xl text-white tracking-tight">Qualitativo por Seção</h3>
            </div>
          </div>

          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sectionData} layout="vertical" margin={{ left: 10, right: 30, top: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#27272a" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fontWeight: 700, fill: '#f4f4f5' }}
                  width={60}
                />
                <RechartsTooltip 
                   cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                   content={<CustomTooltip />}
                />
                <Legend 
                  verticalAlign="bottom" 
                  align="right" 
                  iconType="circle" 
                  wrapperStyle={{ paddingTop: '20px', fontSize: '11px', fontWeight: 700 }}
                  formatter={(value) => <span className="text-zinc-400 font-bold tracking-tight">{value}</span>}
                />
                <Bar dataKey="Meta Atingida" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} barSize={24} />
                <Bar dataKey="Estável" stackId="a" fill="#f59e0b" barSize={24} />
                <Bar dataKey="Fora da Meta" stackId="a" fill="#f43f5e" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
