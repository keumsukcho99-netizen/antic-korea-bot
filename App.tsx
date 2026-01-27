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

  useEffect(() => {
    localStorage.setItem('site_title', siteInfo.title);
    localStorage.setItem('site_slogan', siteInfo.slogan);
    localStorage.setItem('site_owner', siteInfo.owner);
    localStorage.setItem('site_domain', siteInfo.domain);
    localStorage.setItem('site_phone', siteInfo.phone);
  }, [siteInfo]);

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
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] pointer-events-none"></div>
          
          {/* 장식용 낙관 */}
          <div className="absolute -top-10 -left-10 w-64 h-64 border border-slate-200 rounded-full opacity-20 pointer-events-none"></div>
          <div className="absolute -bottom-20 -right-20 w-96 h-96 border-4 border-slate-900/5 rounded-full pointer-events-none"></div>

          <div className="relative z-10 space-y-12 max-w-4xl mx-auto animate-in fade-in zoom-in duration-1000">
            <div className="inline-block px-4 py-1 border border-amber-900 text-amber-900 text-[10px] font-black tracking-widest uppercase rounded-full mb-4">
              AI Heritage Archive Project
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black serif-kr text-slate-900 tracking-tighter leading-tight">
              {siteInfo.title}
            </h1>
            
            <div className="h-1 w-24 bg-amber-900 mx-auto"></div>

            <p className="text-xl md:text-2xl text-slate-500 serif-kr italic leading-relaxed max-w-2xl mx-auto">
              "{siteInfo.slogan}"
            </p>
            
            <div className="flex flex-col md:flex-row gap-6 justify-center pt-8">
              <button 
                onClick={() => setView('app')}
                className="bg-slate-900 text-white px-12 py-5 rounded-2xl font-black text-lg tracking-widest hover:bg-amber-950 transition-all shadow-2xl active:scale-95 group"
              >
                연구실 입장하기 <span className="inline-block transition-transform group-hover:translate-x-2">→</span>
              </button>
              <button 
                onClick={() => setView('studio')}
                className="bg-white border-2 border-slate-900 text-slate-900 px-12 py-5 rounded-2xl font-black text-lg tracking-widest hover:bg-slate-50 transition-all active:scale-95"
              >
                관리 집무실
              </button>
            </div>

            <footer className="pt-24 opacity-40">
              <div className="flex justify-center gap-8 text-[10px] font-black tracking-[0.3em] uppercase text-slate-500">
                <span>Director: {siteInfo.owner}</span>
                <span>Location: Global Digital Archive</span>
                <span>Contact: {siteInfo.phone}</span>
              </div>
            </footer>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8 min-h-screen relative z-10">
        <nav className="flex justify-between items-center mb-16">
          <button 
            onClick={() => setView('landing')} 
            className="text-slate-400 font-black text-xs uppercase tracking-widest hover:text-slate-900 transition-colors flex items-center gap-2"
          >
            <span className="text-lg">←</span> 연구소 대문으로
          </button>
          <div className="bg-slate-900 p-1.5 rounded-2xl flex gap-1 shadow-2xl border border-white/10">
            <button 
              onClick={() => setView('app')} 
              className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'app' ? 'bg-amber-500 text-black shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              분석실
            </button>
            <button 
              onClick={() => setView('studio')} 
              className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'studio' ? 'bg-amber-500 text-black shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              집무실
            </button>
          </div>
        </nav>

        {view === 'app' ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {!result ? (
              <ArtifactUploader 
                onAppraise={(data) => handleAppraisal({images: data.images, notes: data.notes})} 
                isAppraising={isAppraising} 
              />
            ) : (
              <div className="space-y-12">
                <ResultDisplay result={result} images={currentImages} />
                <div className="flex justify-center">
                  <button 
                    onClick={() => setResult(null)} 
                    className="px-12 py-4 border-2 border-slate-900 rounded-full font-black text-sm tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-lg active:scale-95"
                  >
                    다른 유물 의뢰하기
                  </button>
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
