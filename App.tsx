
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout.tsx';
import ArtifactUploader from './components/ArtifactUploader.tsx';
import ResultDisplay from './components/ResultDisplay.tsx';
import Museum from './components/Museum.tsx';
import Library from './components/Library.tsx';
import About from './components/About.tsx';
import DisclaimerModal from './components/DisclaimerModal.tsx';
import { AppraisalResult, ViewState, AppraisalConfig } from './types.ts';
import { analyzeArtifact } from './services/geminiService.ts';
import { RefreshCcw, Sparkles } from 'lucide-react';

const DAILY_LIMIT = 3;

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewState>('home');
  const [results, setResults] = useState<AppraisalResult[]>([]);
  const [currentResult, setCurrentResult] = useState<AppraisalResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasAgreed, setHasAgreed] = useState<boolean>(false);
  const [dailyCount, setDailyCount] = useState<number>(0);

  useEffect(() => {
    const saved = localStorage.getItem('appraisal_history');
    if (saved) {
      try { setResults(JSON.parse(saved)); } catch (e) { console.error(e); }
    }
    if (localStorage.getItem('user_has_agreed_disclaimer') === 'true') setHasAgreed(true);
    
    const today = new Date().toISOString().split('T')[0];
    const lastDate = localStorage.getItem('last_appraisal_date');
    if (lastDate !== today) {
      localStorage.setItem('last_appraisal_date', today);
      localStorage.setItem('daily_appraisal_count', '0');
      setDailyCount(0);
    } else {
      setDailyCount(parseInt(localStorage.getItem('daily_appraisal_count') || '0'));
    }
  }, []);

  const handleAnalyze = async (images: string[], config: AppraisalConfig) => {
    if (dailyCount >= DAILY_LIMIT) {
      alert("오늘의 고증 한도(3회)를 모두 사용하셨습니다. 내일 다시 시도해 주세요.");
      return;
    }
    setIsLoading(true);
    try {
      const result = await analyzeArtifact(images, config);
      setCurrentResult(result);
      const newCount = dailyCount + 1;
      setDailyCount(newCount);
      localStorage.setItem('daily_appraisal_count', newCount.toString());
      const updatedResults = [result, ...results];
      setResults(updatedResults);
      localStorage.setItem('appraisal_history', JSON.stringify(updatedResults));
      setActiveView('result');
    } catch (error) {
      console.error(error);
      alert("고증 분석 중 오류가 발생했습니다. 이미지 용량을 줄이거나 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    switch (activeView) {
      case 'result':
        return currentResult ? <ResultDisplay result={currentResult} onReset={() => setActiveView('home')} /> : null;
      case 'museum': 
        return <Museum results={results} onViewDetail={(res) => { setCurrentResult(res); setActiveView('result'); }} />;
      case 'library': 
        return <Library />;
      case 'about': 
        return <About />;
      case 'home':
      default:
        return (
          <div className="space-y-20 py-10 px-6">
            <section className="max-w-4xl mx-auto space-y-8 pt-16">
              <div className="inline-flex items-center gap-2 px-4 py-1 bg-emerald-500/10 rounded-full text-emerald-500 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                <RefreshCcw size={12} className="animate-spin-slow" /> 시스템 아카이브 연결됨
              </div>
              <h2 className="text-5xl md:text-7xl font-serif-kr font-black text-white leading-tight">
                과거의 숨결을 <br /> <span className="text-gold-gradient">데이터로 정돈합니다.</span>
              </h2>
              <p className="text-gray-400 font-serif-kr text-xl max-w-2xl leading-relaxed">
                Antique-Korea.com은 인공지능 기술을 통해 고미술품, 고서, 낙관의 학술적 가치를 정밀 분석하는 디지털 아카이브입니다.
              </p>
            </section>
            <section id="appraisal-engine" className="text-center pt-20 border-t border-white/5 max-w-5xl mx-auto">
              <div className="mb-10 inline-flex items-center gap-3 px-6 py-2 bg-[#2d5a4c]/10 rounded-full text-[#2d5a4c] text-xs font-serif-kr font-black tracking-widest border border-[#2d5a4c]/30">
                <Sparkles size={14} /> 정밀 고증 엔진 v3.1 (오늘 {dailyCount}/{DAILY_LIMIT}회 사용)
              </div>
              <ArtifactUploader onAnalyze={handleAnalyze} isLoading={isLoading} dailyCount={dailyCount} dailyLimit={DAILY_LIMIT} />
            </section>
          </div>
        );
    }
  };

  return (
    <Layout activeView={activeView} setView={setActiveView}>
      {!hasAgreed && <DisclaimerModal onAgree={() => { localStorage.setItem('user_has_agreed_disclaimer', 'true'); setHasAgreed(true); }} />}
      {renderContent()}
    </Layout>
  );
};

export default App;
