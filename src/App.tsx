import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCcw, Search, Filter, AlertCircle, Info, LayoutGrid, List, Download, Menu, X } from 'lucide-react';
import Sidebar from './components/Sidebar';
import IndicatorCard from './components/IndicatorCard';
import DetailsPanel from './components/DetailsPanel';
import { Dashboard } from './components/Dashboard';
import { generateIndicatorsPDF } from './lib/pdfGenerator';
import { useSheetData } from './hooks/useSheetData';
import { Indicator } from './types';
import { cn } from './lib/utils';

export default function App() {
  const { indicators, sections, loading, error, lastUpdated, refreshData } = useSheetData();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedIndicator, setSelectedIndicator] = useState<Indicator | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const filteredIndicators = useMemo(() => {
    return indicators.filter(i => {
      const matchesSection = activeSection ? i.section === activeSection : true;
      const matchesSearch = i.name.toLowerCase().includes(search.toLowerCase());
      return matchesSection && matchesSearch;
    });
  }, [indicators, activeSection, search]);

  const stats = useMemo(() => {
    const total = filteredIndicators.length;
    const sim = filteredIndicators.filter(i => i.status === 'SIM').length;
    const nao = filteredIndicators.filter(i => i.status === 'NÃO').length;
    const igual = filteredIndicators.filter(i => i.status === 'IGUAL').length;
    return { total, sim, nao, igual };
  }, [filteredIndicators]);

  if (loading && indicators.length === 0) {
    return (
      <div className="h-screen w-full bg-[#121212] flex flex-col items-center justify-center gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        >
          <RefreshCcw className="w-10 h-10 text-blue-500" />
        </motion.div>
        <div className="text-center">
          <p className="font-bold text-white">Carregando indicadores...</p>
          <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Sincronizando com Google Sheets</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#161616] text-zinc-100 font-sans overflow-hidden relative">
      <Sidebar 
        sections={sections} 
        activeSection={activeSection} 
        onSelectSection={(section) => {
          setActiveSection(section);
          setIsSidebarOpen(false);
        }}
        indicators={indicators}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className="flex-1 overflow-y-auto relative flex flex-col w-full">
        {/* Sticky Header */}
        <header className="sticky top-0 z-30 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-zinc-800/50 px-4 md:px-8 py-4 md:py-5">
          <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white active:scale-95 transition-all"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg md:text-2xl font-bold tracking-tight text-white uppercase truncate max-w-[200px] md:max-w-none">
                    {activeSection || 'INDICADORES - v1.0'}
                  </h2>
                  {activeSection && (
                    <span className="hidden md:inline-block px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded-md text-[10px] font-bold border border-blue-500/20">
                      SETOR ATIVO
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-0.5 md:mt-1.5">
                  <span className="flex items-center gap-1.5 text-[8px] md:text-[10px] font-bold text-zinc-500 tracking-wider">
                    ÚLTIMA SINCRONIZAÇÃO: {lastUpdated}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              {activeSection && (
                <div className="relative group hidden sm:block">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-blue-500 transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Pesquisar..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-zinc-900 border-2 border-zinc-800 rounded-2xl text-xs text-white focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 w-40 md:w-72 transition-all outline-none font-medium"
                  />
                </div>
              )}
              <div className="flex items-center gap-2">
                <button 
                  onClick={refreshData}
                  disabled={loading}
                  className="p-2 md:p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl md:rounded-2xl hover:bg-zinc-800 transition-colors disabled:opacity-50 shadow-sm"
                >
                  <RefreshCcw className={cn("w-4 h-4 md:w-5 md:h-5 text-zinc-400", loading ? "animate-spin" : "")} />
                </button>
                <button 
                  onClick={() => generateIndicatorsPDF(filteredIndicators, activeSection || 'Geral')}
                  className="flex items-center gap-2 px-3 md:px-5 py-2 md:py-2.5 bg-blue-600 text-white rounded-xl md:rounded-2xl text-[10px] md:text-sm font-bold shadow-lg shadow-blue-900/20 hover:bg-blue-500 transition-all active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Relatório</span>
                </button>
              </div>
            </div>
          </div>
          {/* Mobile Search */}
          {activeSection && (
            <div className="relative group mt-3 sm:hidden">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Pesquisar indicadores..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-zinc-900 border-2 border-zinc-800 rounded-2xl text-xs text-white focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none font-medium"
              />
            </div>
          )}
        </header>

        {/* Content */}
        <div className="p-4 md:p-8 pb-16 flex-1">
          <div className="max-w-7xl mx-auto space-y-6 md:space-y-10">
            {/* Quick Stats Banner (Only when section is active) */}
            {activeSection && (
              <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {[
                  { label: 'Total na Seção', value: stats.total, color: 'blue', icon: LayoutGrid, desc: 'Indicadores no setor' },
                  { label: 'Meta Atingida', value: stats.sim, color: 'emerald', icon: RefreshCcw, desc: 'Nesta seção' },
                  { label: 'Fora da Meta', value: stats.nao, color: 'rose', icon: AlertCircle, desc: 'Atenção no setor' },
                  { label: 'Estável', value: stats.igual, color: 'amber', icon: Filter, desc: 'Sem alteração' },
                ].map((s, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={s.label} 
                    className="bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-sm rounded-[2rem] p-6 shadow-sm hover:shadow-md hover:bg-zinc-900/60 transition-all group overflow-hidden relative"
                  >
                    <div className="relative z-10 space-y-3">
                      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform", 
                        s.color === 'blue' ? 'bg-blue-500/10' : s.color === 'emerald' ? 'bg-emerald-500/10' : s.color === 'rose' ? 'bg-rose-500/10' : 'bg-amber-500/10'
                      )}>
                        <s.icon className={cn("w-6 h-6", 
                          s.color === 'blue' ? 'text-blue-500' : s.color === 'emerald' ? 'text-emerald-500' : s.color === 'rose' ? 'text-rose-500' : 'text-amber-500'
                        )} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none mb-1">{s.label}</p>
                    <p className="text-2xl md:text-4xl font-mono font-bold tracking-tighter tabular-nums text-white">{s.value}</p>
                      </div>
                      <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-wide">{s.desc}</p>
                    </div>
                    <div className={cn("absolute -right-4 -bottom-4 w-24 h-24 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity", 
                      s.color === 'blue' ? 'bg-blue-500/10' : s.color === 'emerald' ? 'bg-emerald-500/10' : s.color === 'rose' ? 'bg-rose-500/10' : 'bg-amber-500/10'
                    )} />
                  </motion.div>
                ))}
              </section>
            )}

            {/* Main Area */}
            {activeSection ? (
              <section className="space-y-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-6 w-1.5 bg-blue-600 rounded-full" />
                    <h3 className="font-bold text-xl text-white tracking-tight">
                      {activeSection}
                      <span className="ml-3 text-sm font-medium text-zinc-500 uppercase">EXIBINDO {filteredIndicators.length} RESULTADOS</span>
                    </h3>
                  </div>
                  {search && (
                    <button 
                      onClick={() => setSearch('')}
                      className="text-xs font-bold text-blue-500 hover:underline"
                    >
                      LIMPAR BUSCA
                    </button>
                  )}
                </div>

                {filteredIndicators.length > 0 ? (
                  <div className={cn(
                    "grid gap-8 auto-rows-fr",
                    viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
                  )}>
                    <AnimatePresence mode="popLayout" initial={false}>
                      {filteredIndicators.map((indicator, idx) => (
                        <motion.div
                          key={indicator.id}
                          layout
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.2, delay: idx * 0.05 }}
                        >
                          <IndicatorCard 
                            indicator={indicator} 
                            onDetails={setSelectedIndicator}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="h-80 border-2 border-dashed border-zinc-800 rounded-[3rem] flex flex-col items-center justify-center text-zinc-500 space-y-4 bg-zinc-900/20">
                    <div className="p-4 bg-zinc-900 rounded-full border border-zinc-800">
                      <Search className="w-8 h-8 opacity-40 text-white" />
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-white">Nenhum indicador encontrado</p>
                      <p className="text-sm font-medium opacity-60">Tente ajustar seus filtros ou termos de pesquisa.</p>
                    </div>
                  </div>
                )}
              </section>
            ) : (
              <Dashboard indicators={indicators} sections={sections} />
            )}
          </div>
        </div>
      </main>

      <DetailsPanel 
        indicator={selectedIndicator} 
        onClose={() => setSelectedIndicator(null)} 
      />

      {error && (
        <div className="fixed bottom-6 right-6 z-50 bg-rose-600 text-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-4 animate-in slide-in-from-bottom font-bold">
          <AlertCircle className="w-6 h-6" />
          <div className="flex flex-col">
            <span>{error}</span>
            <span className="text-[10px] opacity-70 uppercase tracking-widest font-normal">Tente recarregar a página</span>
          </div>
        </div>
      )}
    </div>
  );
}

