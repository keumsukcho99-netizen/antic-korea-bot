import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import ArtifactUploader from './components/ArtifactUploader';
import ResultDisplay from './components/ResultDisplay';
import Museum from './components/Museum';
import Library from './components/Library';
import About from './components/About';
import DisclaimerModal from './components/DisclaimerModal';
import { AppraisalResult, ViewState, AppraisalConfig } from './types';
import { analyzeArtifact } from './services/geminiService';
import { CloudSync, Coffee, ExternalLink, Sparkles } from 'lucide-react';

const DAILY_LIMIT = 3;

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewState>('home');
  const [results, setResults] = useState<AppraisalResult[]>([]);
  const [currentResult, setCurrentResult] = useState<AppraisalResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasAgreed, setHasAgreed] = useState<boolean>(false);
  const [dailyCount, setDailyCount] = useState<number>(0);

  // 데이터 로드
  useEffect(() => {
    const saved = localStorage.getItem('appraisal_history');
    if (saved) {
      try {
        setResults(JSON.parse(saved));
      } catch (e) {
        console.error("데이터 복구 실패", e);
      }
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
      alert("일일 고증 한도(3회)를 초과했습니다. 내일 다시 이용해 주세요.");
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
      alert("분석 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    switch (activeView) {
      case 'result':
        return currentResult ? (
          <ResultDisplay result={currentResult} onReset={() => setActiveView('home')} />
        ) : <div className="p-20 text-center font-serif-kr text-gray-500">고증 결과를 불러올 수 없습니다.</div>;
      
      case 'museum':
        return <Museum results={results} onViewDetail={(res) => { setCurrentResult(res); setActiveView('result'); }} />;
      
      case 'library':
        return <Library />;
      
      case 'about':
        return <About />;
      
      case 'home':
      default:
        return (
          <div className="space-y-20 py-10 px-6 animate-fadeIn">
            {/* 히어로 섹션 */}
            <section className="max-w-4xl mx-auto space-y-8 pt-16">
              <div className="inline-flex items-center gap-2 px-4 py-1 bg-emerald-500/10 rounded-full text-emerald-500 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                <CloudSync size={12} /> 시스템 아카이브 연결됨
              </div>
              <h2 className="text-5xl md:text-7xl font-serif-kr font-black text-white leading-tight">
                과거의 숨결을 <br />
                <span className="text-gold-gradient">데이터로 정돈합니다.</span>
              </h2>
              <p className="text-gray-400 font-serif-kr text-xl max-w-2xl leading-relaxed">
                Antique-Korea.com은 인공지능 기술을 통해 고미술품, 고서, 낙관의 학술적 가치를 정밀 분석하는 디지털 아카이브입니다.
              </p>
            </section>

            {/* 고증 엔진 섹션 */}
            <section id="appraisal-engine" className="text-center pt-20 border-t border-white/5 max-w-5xl mx-auto">
              <div className="mb-10 inline-flex items-center gap-3 px-6 py-2 bg-[#2d5a4c]/10 rounded-full text-[#2d5a4c] text-xs font-serif-kr font-black tracking-widest border border-[#2d5a4c]/30">
                <Sparkles size={14} /> 정밀 고증 엔진 v3.1 (오늘 {dailyCount}/{DAILY_LIMIT}회 사용)
              </div>
              <ArtifactUploader onAnalyze={handleAnalyze} isLoading={isLoading} dailyCount={dailyCount} dailyLimit={DAILY_LIMIT} />
            </section>

            {/* 하단 배너 */}
            <section className="max-w-5xl mx-auto pb-20">
              <div className="bg-gradient-to-br from-[#111] to-black border-2 border-[#b8860b]/20 p-12 md:p-16 rounded-[64px] flex flex-col md:flex-row items-center justify-between gap-10">
                <div className="space-y-4 text-center md:text-left">
                  <h3 className="text-3xl font-serif-kr font-black text-white">더 깊은 이야기가 궁금하신가요?</h3>
                  <p className="text-gray-500 font-serif-kr">수집가의 사랑방(블로그)에서 고미술의 세계를 공유합니다.</p>
                </div>
                <a href="https://blog.naver.com/keumsukcho" target="_blank" rel="noopener noreferrer" className="shrink-0 bg-white text-black px-8 py-4 rounded-2xl font-black font-serif-kr flex items-center gap-3 hover:bg-[#b8860b] transition-all">
                  사랑방 방문 <ExternalLink size={20} />
                </a>
              </div>
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
