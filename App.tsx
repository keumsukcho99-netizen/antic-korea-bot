import React, { useState, useEffect } from 'react';
import { Layout } from './Layout';
import { ArtifactUploader } from './components/ArtifactUploader';
import { ResultDisplay } from './components/ResultDisplay';
import { StudioMode } from './components/StudioMode';
import { getAppraisal } from './services/geminiService';

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'app' | 'studio'>('landing');
  const [isAppraising, setIsAppraising] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [currentImages, setCurrentImages] = useState<string[]>([]);
  
  const [siteInfo, setSiteInfo] = useState({
    title: localStorage.getItem('site_title') || "시간의 적체미를 잇는 연구소",
    slogan: localStorage.getItem('site_slogan') || "전통의 가치를 디지털의 지혜로 잇습니다.",
    owner: localStorage.getItem('site_owner') || "고산 큐레이터",
    domain: localStorage.getItem('site_domain') || "antique-korea.com",
    phone: localStorage.getItem('site_phone') || "010-0000-0000"
  });

  const handleAppraisal = async (data: { images: string[], notes: string }) => {
    setIsAppraising(true);
    setCurrentImages(data.images);
    try {
      const imagePayload = data.images.map(img => {
        const [meta, base64] = img.split(',');
        const mimeType = meta.split(':')[1].split(';')[0];
        return { data: base64, mimeType };
      });
      const response = await getAppraisal(data.notes, imagePayload);
      setResult(response);
    } catch (error) {
      console.error(error);
      alert("분석 장치가 과열되었습니다. 관리 집무실에서 API_KEY 설정을 확인해주세요.");
    } finally {
      setIsAppraising(false);
    }
  };

  if (view === 'landing') {
    return (
      <Layout>
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 animate-in fade-in duration-1000">
          <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] pointer-events-none"></div>
          <div className="relative z-10 space-y-12">
            <div className="inline-block px-4 py-1 border border-amber-900 text-amber-900 text-[10px] font-black tracking-widest uppercase rounded-full mb-4">
              A Heritage AI Project
            </div>
            <h1 className="text-6xl md:text-8xl font-black serif-kr text-slate-900 tracking-tighter leading-tight">
              {siteInfo.title}
            </h1>
            <p className="text-xl md:text-2xl text-slate-500 serif-kr italic max-w-3xl mx-auto leading-relaxed">
              "{siteInfo.slogan}"
            </p>
            <div className="flex flex-col md:flex-row gap-6 justify-center pt-8">
              <button 
                onClick={() => setView('app')}
                className="bg-slate-900 text-white px-12 py-5 rounded-2xl font-black text-lg tracking-widest hover:bg-amber-950 transition-all shadow-2xl active:scale-95"
              >
                연구실 입장하기
              </button>
              <button 
                onClick={() => setView('studio')}
                className="bg-white border-2 border-slate-900 text-slate-900 px-12 py-5 rounded-2xl font-black text-lg tracking-widest hover:bg-slate-50 transition-all active:scale-95"
              >
                관리 집무실
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8 min-h-screen">
        <nav className="flex justify-between items-center mb-16">
          <button onClick={() => setView('landing')} className="text-slate-400 font-black text-xs uppercase tracking-widest hover:text-slate-900 transition-colors">← Back Home</button>
          <div className="bg-slate-900 p-1 rounded-2xl flex gap-1 shadow-xl">
            <button onClick={() => setView('app')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'app' ? 'bg-amber-500 text-black' : 'text-slate-400'}`}>분석실</button>
            <button onClick={() => setView('studio')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'studio' ? 'bg-amber-500 text-black' : 'text-slate-400'}`}>집무실</button>
          </div>
        </nav>

        {view === 'app' ? (
          <div className="animate-in fade-in duration-700">
            {!result ? (
              <ArtifactUploader onAppraise={(data) => handleAppraisal({images: data.images, notes: data.notes})} isAppraising={isAppraising} />
            ) : (
              <div className="space-y-12">
                <ResultDisplay result={result} images={currentImages} />
                <div className="flex justify-center">
                  <button onClick={() => setResult(null)} className="px-12 py-4 border-2 border-slate-900 rounded-full font-black text-sm tracking-widest hover:bg-slate-900 hover:text-white transition-all">다른 유물 의뢰하기</button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <StudioMode siteInfo={siteInfo} setSiteInfo={setSiteInfo} />
        )}
      </div>

      {isAppraising && (
        <div className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
          <div className="w-16 h-16 border-4 border-t-amber-500 border-white/10 rounded-full animate-spin mb-8"></div>
          <h2 className="text-white text-3xl font-black serif-kr mb-4">유물의 혼을 분석하는 중...</h2>
          <p className="text-slate-400 font-medium italic">고산 큐레이터가 정밀 감정을 진행하고 있습니다.</p>
        </div>
      )}
    </Layout>
  );
};

export default App;
