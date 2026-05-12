import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutDashboard, CheckCircle2, XCircle, MinusCircle, ChevronRight, Info, Users, X } from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
  sections: string[];
  activeSection: string | null;
  onSelectSection: (section: string | null) => void;
  indicators: any[];
}

export default function Sidebar({ sections, activeSection, onSelectSection, indicators }: SidebarProps) {
  const [showMembers, setShowMembers] = useState(false);

  const getSectionStats = (section: string) => {
    const sectionIndicators = indicators.filter(i => i.section === section);
    const sim = sectionIndicators.filter(i => i.status === 'SIM').length;
    const nao = sectionIndicators.filter(i => i.status === 'NÃO').length;
    const igual = sectionIndicators.filter(i => i.status === 'IGUAL').length;
    return { total: sectionIndicators.length, sim, nao, igual };
  };

  return (
    <aside id="sidebar" className="w-80 h-screen bg-[#0a0a0a] text-white flex flex-col border-r border-white/5 overflow-hidden">
      <div className="p-8 border-b border-white/5 bg-[#0d0d0d]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="font-extrabold text-xl tracking-tighter leading-none">32º BPM/I</h1>
              <p className="text-[10px] text-blue-500 font-bold uppercase tracking-[0.2em] mt-1 text-glow">COMISSÃO DE QUALIDADE</p>
            </div>
          </div>
          <button 
            onClick={() => setShowMembers(true)}
            className="w-10 h-10 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-blue-600 transition-all mr-2"
            title="Membros da Comissão"
          >
            <Users className="w-5 h-5" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showMembers && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-24 overflow-hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMembers(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-zinc-950 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-white/5 flex items-center justify-between bg-zinc-900/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black tracking-tighter text-white uppercase leading-none">Comissão de Qualidade</h2>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] mt-1">32º Batalhão de Polícia Militar do Interior</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowMembers(false)}
                  className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mb-4">Composição da Comissão</h3>
                  <div className="grid gap-3">
                    {[
                      { name: "Ten Cel PM Marlus Guedes", role: "Presidente" },
                      { name: "Maj PM Ronny Emerson Gomes", role: "Membro" },
                      { name: "Maj PM Marcelo Shigeo Garcia Tsuda", role: "Membro" },
                      { name: "Cap PM André Luis Coelho Piedade", role: "Membro" },
                      { name: "Cap PM Pedro Nicolau de Carvalho", role: "Membro" },
                      { name: "Cap PM Milton Lúcio de Carvalho Junior", role: "Membro" },
                      { name: "Cap PM Alan Eduardo Domingues", role: "Membro" },
                      { name: "Cap PM Tiago Siqueira Machado", role: "Membro" },
                      { name: "1º Ten PM Willian de Souza Albertini", role: "Membro" },
                      { name: "1º Ten PM Clélio Augusto Vieira", role: "Membro" },
                      { name: "1º Ten PM Leandro Miranda de Souza", role: "Membro" },
                      { name: "Subten PM Leonardo Móvio Santana", role: "Membro" },
                      { name: "Subten PM Hugo Damião da Costa", role: "Membro" },
                      { name: "Cb PM Alexandre Latuffe", role: "Membro" },
                    ].map((member, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                        <span className="font-bold text-sm text-zinc-200">{member.name}</span>
                        <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 bg-zinc-900 px-2 py-1 rounded-md">{member.role}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-8 bg-zinc-900/30 text-center border-t border-white/5">
                <p className="text-[10px] text-zinc-600 font-medium uppercase tracking-widest leading-relaxed mb-2">
                  Trabalhando para a excelência na prestação de serviço <br/> à sociedade através da Melhoria Contínua.
                </p>
                <p className="text-[9px] text-zinc-700 font-bold uppercase tracking-widest">
                  Conforme Bol Int CPI8-030/25
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <nav className="flex-1 overflow-y-auto pt-6 pb-20 px-4 space-y-1 custom-scrollbar">
        <div className="px-4 mb-4">
          <p className="text-[10px] font-bold text-zinc-700 uppercase tracking-[0.3em]">Navegação Principal</p>
        </div>

        <button
          onClick={() => onSelectSection(null)}
          className={cn(
            "w-full flex items-center justify-between p-4 rounded-2xl transition-all group relative overflow-hidden",
            activeSection === null 
              ? "bg-blue-600 text-white shadow-lg shadow-blue-600/10" 
              : "text-zinc-500 hover:bg-white/5 hover:text-white"
          )}
        >
          <div className="flex items-center gap-3 relative z-10">
            <LayoutDashboard className={cn("w-5 h-5", activeSection === null ? "text-white" : "text-zinc-600 group-hover:text-white")} />
            <span className="font-bold text-sm tracking-tight uppercase">DASHBOARD</span>
          </div>
          <ChevronRight className={cn("w-4 h-4 transition-transform relative z-10", activeSection === null ? "rotate-90" : "opacity-0 group-hover:opacity-100")} />
          {activeSection === null && (
            <motion.div layoutId="sidebar-hover" className="absolute inset-0 bg-blue-600" />
          )}
        </button>

        <div className="mt-10 mb-4 px-4">
          <p className="text-[10px] font-bold text-zinc-700 uppercase tracking-[0.3em]">Seções</p>
        </div>

        <div className="space-y-1">
          {sections.map((section) => {
            const stats = getSectionStats(section);
            const isActive = activeSection === section;
            
            return (
              <button
                key={section}
                onClick={() => onSelectSection(section)}
                className={cn(
                  "w-full text-left p-4 rounded-2xl transition-all group relative flex flex-col gap-2",
                  isActive ? "bg-white/5 text-white" : "text-zinc-500 hover:bg-white/5 hover:text-white"
                )}
              >
                <div className="flex items-center justify-between relative z-10">
                  <span className={cn("font-bold text-xs uppercase tracking-tight truncate pr-4", isActive ? "text-white" : "text-zinc-400")}>{section}</span>
                  <ChevronRight className={cn("w-4 h-4 transition-transform shrink-0", isActive ? "rotate-90 text-blue-500" : "opacity-0 group-hover:opacity-100")} />
                </div>
                
                <div className="flex items-center gap-4 relative z-10">
                  <div className="h-1 flex-1 bg-zinc-900 rounded-full overflow-hidden flex">
                    <div 
                      className="h-full bg-emerald-500 transition-all duration-500" 
                      style={{ width: `${(stats.sim / stats.total) * 100}%` }} 
                    />
                    <div 
                      className="h-full bg-amber-500 transition-all duration-500" 
                      style={{ width: `${(stats.igual / stats.total) * 100}%` }} 
                    />
                    <div 
                      className="h-full bg-rose-500 transition-all duration-500" 
                      style={{ width: `${(stats.nao / stats.total) * 100}%` }} 
                    />
                  </div>
                  <span className="text-[9px] font-black font-mono tabular-nums opacity-60 tracking-widest">{stats.total}</span>
                </div>

                {isActive && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute left-[-1px] top-4 bottom-4 w-1 bg-blue-500 rounded-r-full"
                  />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}
