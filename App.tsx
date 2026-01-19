import React, { useState, useCallback, useEffect } from 'react';
import { Layout } from './Layout';
import { ArtifactUploader } from './components/ArtifactUploader';
import { ResultDisplay } from './components/ResultDisplay';
import { StudioMode } from './components/StudioMode';
import { getAppraisal } from './services/geminiService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'analysis' | 'studio'>('analysis');
  const [isAppraising, setIsAppraising] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [currentImages, setCurrentImages] = useState<string[]>([]);
  
  const [siteInfo, setSiteInfo] = useState({
    title: localStorage.getItem('site_title') || "어르신의 고미술 연구소",
    slogan: localStorage.getItem('site_slogan') || "전통의 가치를 디지털의 지혜로 잇습니다.",
    owner: localStorage.getItem('site_owner') || "어르신 성함",
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

  const handleReset = useCallback(() => {
    setIsAppraising(false);
    setResult(null);
    setCurrentImages([]);
  }, []);

  const handleAppraisal = async (data: { images: string[], category: string, modules: string[], notes: string }) => {
    if (isAppraising) return;
    setIsAppraising(true);
    setCurrentImages(data.images);
    try {
      const imagePayload = data.images.map(img => {
        const parts = img.split(',');
        return { data: parts[1], mimeType: parts[0].split(';')[0].split(':')[1] };
      });
      const response = await getAppraisal(data.notes, imagePayload, {
        category: data.category,
        modules: data.modules
      });
      setResult(response);
    } catch (error) {
      alert("분석 장치가 과열되었습니다. 잠시 열을 식힌 후 다시 시도해주십시오.");
    } finally {
      setIsAppraising(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8 min-h-screen">
        <div className="flex justify-center mb-12 relative z-50">
          <div className="bg-slate-900 p-1.5 rounded-2xl flex gap-1 shadow-2xl border border-white/10">
            <button 
              onClick={() => setActiveTab('analysis')}
              className={`px-8 py-3 rounded-xl text-xs font-black tracking-widest uppercase transition-all ${activeTab === 'analysis' ? 'bg-amber-500 text-black shadow-lg scale-105' : 'text-slate-400 hover:text-white'}`}
            >
              🏛️ 분석 전시실
            </button>
            <button 
              onClick={() => setActiveTab('studio')}
              className={`px-8 py-3 rounded-xl text-xs font-black tracking-widest uppercase transition-all ${activeTab === 'studio' ? 'bg-amber-500 text-black shadow-lg scale-105' : 'text-slate-400 hover:text-white'}`}
            >
              ⚙️ 관리 집무실
            </button>
          </div>
        </div>

        {activeTab === 'analysis' ? (
          <div className="animate-in fade-in duration-1000">
            <header className="text-center mb-20 space-y-6">
              <div className="inline-block">
                <div className="flex flex-col items-center justify-center gap-4 mb-4">
                  <div className="bg-slate-900 px-4 py-1 rounded-full">
                    <span className="text-amber-500 font-mono text-[10px] tracking-widest font-black uppercase">{siteInfo.owner} 수석 큐레이터</span>
                  </div>
                </div>
                <h1 className="text-5xl md:text-7xl font-black serif-kr tracking-tighter mb-6 text-slate-900">
                  {siteInfo.title}
                </h1>
                <p className="text-slate-500 text-xl font-medium serif-kr max-w-2xl mx-auto leading-relaxed italic">
                  "{siteInfo.slogan}"
                </p>
                <div className="mt-8 text-[11px] text-amber-700 font-mono font-bold tracking-widest">
                   CONTACT: {siteInfo.phone}
                </div>
              </div>
            </header>

            {!result ? (
              <ArtifactUploader onAppraise={handleAppraisal} isAppraising={isAppraising} />
            ) : (
              <div className="space-y-12">
                <ResultDisplay result={result} images={currentImages} />
                <div className="flex justify-center">
                  <button onClick={handleReset} className="group flex items-center gap-4 text-slate-600 hover:text-amber-700 font-bold transition-all py-4 px-8 border-2 border-slate-200 rounded-full hover:bg-white shadow-sm">
                    <span className="text-xl group-hover:rotate-180 transition-transform duration-500">🔄</span>
                    다른 유물 감정 의뢰하기
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <StudioMode siteInfo={siteInfo} setSiteInfo={setSiteInfo} />
        )}

        {isAppraising && (
          <div className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
            <div className="relative w-32 h-32 mb-8">
               <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
               <div className="absolute inset-0 border-4 border-t-amber-500 rounded-full animate-spin"></div>
            </div>
            <h2 className="text-white text-3xl font-black serif-kr mb-4">유물을 정밀 분석하는 중...</h2>
            <p className="text-slate-400 max-w-sm mx-auto font-medium">잠시만 기다려 주시면 AI 큐레이터가 감정서를 작성합니다.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default App;
