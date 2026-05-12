import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from 'recharts';
import { Indicator } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, TrendingUp, TrendingDown, ArrowRight, Info } from 'lucide-react';
import { formatPercent, cn } from '../lib/utils';

interface DetailsPanelProps {
  indicator: Indicator | null;
  onClose: () => void;
}

const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

export default function DetailsPanel({ indicator, onClose }: DetailsPanelProps) {
  if (!indicator) return null;

  const data = indicator.projection2025.map((val, i) => ({
    name: MONTHS[i],
    "Projeção Mensal": Number(val.toFixed(2)),
    "Meta Mensal Definida": Number(indicator.goalValue.toFixed(2)),
    actual: i < 5 ? Number((val * (0.9 + Math.random() * 0.2)).toFixed(2)) : null // Simulated actuals for past months
  }));

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-end p-4 bg-black/40 backdrop-blur-sm">
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          className="w-full max-w-2xl h-full bg-[#141414] rounded-3xl shadow-2xl flex flex-col overflow-hidden border-l border-zinc-800"
        >
          <div className="p-8 border-b border-zinc-800/50 flex items-center justify-between bg-zinc-950">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded-full text-[10px] font-bold tracking-widest uppercase border border-blue-500/20">
                  {indicator.section}
                </span>
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase border",
                  indicator.status === 'SIM' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                  indicator.status === 'NÃO' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                )}>
                  {indicator.status}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">{indicator.name}</h2>
            </div>
            <button 
              onClick={onClose}
              className="p-3 hover:bg-zinc-800 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-zinc-500" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-10 bg-[#121212]">
            <div className="grid grid-cols-3 gap-6">
              <div className="p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800/50">
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Situação Atual</p>
                <p className="text-3xl font-mono font-bold tracking-tighter text-white">{indicator.currentValue.toFixed(1)}</p>
                <div className={cn(
                  "flex items-center gap-1 mt-1",
                  indicator.trend === 'up' ? 'text-emerald-500' : 
                  indicator.trend === 'down' ? 'text-rose-500' : 'text-amber-500'
                )}>
                  {indicator.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : 
                   indicator.trend === 'down' ? <TrendingDown className="w-3 h-3" /> : 
                   <ArrowRight className="w-3 h-3" />}
                  <span className="text-[10px] font-bold">
                    {indicator.trend === 'up' ? '+12% vs mês anterior' : 
                     indicator.trend === 'down' ? '-5% vs mês anterior' : 'Estável vs mês anterior'}
                  </span>
                </div>
              </div>
              <div className="p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800/50">
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Meta Mensal Definida</p>
                <p className="text-3xl font-mono font-bold tracking-tighter text-zinc-700">{indicator.goalValue.toFixed(1)}</p>
              </div>
              <div className="p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800/50">
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Aproveitamento</p>
                <p className="text-3xl font-mono font-bold tracking-tighter text-white">
                  {formatPercent((indicator.currentValue / indicator.goalValue) * 100)}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  <h3 className="font-bold text-lg text-white">Projeção Mensal 2025</h3>
                </div>
                <div className="flex items-center gap-4 text-[10px] font-bold tracking-widest uppercase text-zinc-500">
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500" /> Projeção Mensal</div>
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-yellow-500" /> Meta Mensal Definida</div>
                </div>
              </div>
              
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorProj" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fontWeight: 700, fill: '#52525b' }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fontWeight: 700, fill: '#52525b' }}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#18181b', borderRadius: '16px', border: '1px solid #27272a', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)', fontWeight: 700, color: '#f4f4f5' }}
                      itemStyle={{ color: '#f4f4f5' }}
                      formatter={(value: number, name: string) => [value.toFixed(2), name]}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="Projeção Mensal" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorProj)" 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="Meta Mensal Definida" 
                      stroke="#facc15" 
                      strokeDasharray="5 5" 
                      strokeWidth={2}
                      dot={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-blue-500/5 p-6 rounded-3xl border border-blue-500/10 flex gap-4">
              <div className="p-2 bg-blue-600 rounded-xl shrink-0 h-fit">
                <Info className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-blue-400 mb-1">Análise da Tendência</h4>
                <p className="text-sm text-blue-100/60 leading-relaxed">
                  Com base nos dados coletados e na projeção para 2025, o indicador apresenta uma tendência de {indicator.trend === 'up' ? 'CRESCIMENTO' : indicator.trend === 'stable' ? 'ESTABILIDADE' : 'QUEDA'}. 
                  A manutenção da meta exige acompanhamento constante dos processos na seção de {indicator.section}.
                </p>
              </div>
            </div>
          </div>
          

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
