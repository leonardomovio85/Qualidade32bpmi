import { motion } from 'motion/react';
import { Indicator } from '../types';
import { cn, formatPercent } from '../lib/utils';
import { CheckCircle2, XCircle, MinusCircle, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';

interface IndicatorCardProps {
  indicator: Indicator;
  onDetails: (indicator: Indicator) => void;
}

export default function IndicatorCard({ indicator, onDetails }: IndicatorCardProps) {
  const chartData = indicator.projection2025.map((val, i) => ({ value: val, month: i }));
  
  const statusConfig = {
    SIM: { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', label: 'Meta Atingida' },
    NÃO: { icon: XCircle, color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/20', label: 'Fora da Meta' },
    IGUAL: { icon: MinusCircle, color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20', label: 'Sem Alteração' },
  };

  const StatusIcon = statusConfig[indicator.status].icon;

  return (
    <motion.div
      layout
      whileHover={{ y: -4, shadow: '0 20px 25px -5px rgb(0 0 0 / 0.4), 0 8px 10px -6px rgb(0 0 0 / 0.4)' }}
      className={cn(
        "bg-zinc-900/40 backdrop-blur-sm rounded-3xl p-6 border transition-all flex flex-col group cursor-pointer h-full",
        statusConfig[indicator.status].border,
        "hover:border-blue-500/50 hover:bg-zinc-900/60"
      )}
      onClick={() => onDetails(indicator)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn("p-2 rounded-xl", statusConfig[indicator.status].bg)}>
          <StatusIcon className={cn("w-5 h-5", statusConfig[indicator.status].color)} />
        </div>
        <div className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider", statusConfig[indicator.status].bg, statusConfig[indicator.status].color)}>
          {indicator.status}
        </div>
      </div>

      <div className="flex-1">
        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">{indicator.section}</p>
        <h3 className="font-bold text-zinc-100 leading-tight group-hover:text-blue-400 transition-colors line-clamp-2 mb-4">
          {indicator.name}
        </h3>
      </div>

      <div className="mt-auto">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="space-y-1">
            <p className="text-[10px] text-zinc-500 uppercase font-medium">Atual</p>
            <p className="font-mono text-lg font-bold tabular-nums text-white">{indicator.currentValue.toFixed(1)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] text-zinc-500 uppercase font-medium">Meta</p>
            <p className="font-mono text-lg font-bold tabular-nums text-zinc-600">{indicator.goalValue.toFixed(1)}</p>
          </div>
        </div>

        <div className="h-12 w-full -mx-5 -mb-5 mt-4 rounded-b-2xl overflow-hidden relative">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id={`gradient-${indicator.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={indicator.status === 'SIM' ? '#10b981' : indicator.status === 'NÃO' ? '#f43f5e' : '#f59e0b'} stopOpacity={0.2} />
                  <stop offset="100%" stopColor={indicator.status === 'SIM' ? '#10b981' : indicator.status === 'NÃO' ? '#f43f5e' : '#f59e0b'} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={indicator.status === 'SIM' ? '#10b981' : indicator.status === 'NÃO' ? '#f43f5e' : '#f59e0b'} 
                fill={`url(#gradient-${indicator.id})`}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-end justify-between px-5 pb-2 pointer-events-none">
             <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-500">
                {indicator.status === 'SIM' ? (
                  <TrendingUp className="w-3 h-3 text-emerald-500" />
                ) : indicator.status === 'NÃO' ? (
                  <TrendingDown className="w-3 h-3 text-rose-500" />
                ) : (
                  <ArrowRight className="w-3 h-3 text-amber-500" />
                )}
                PROJEÇÃO 2025
             </div>
             <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-blue-500 transition-colors" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
