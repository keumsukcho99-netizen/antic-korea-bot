import React, { useState } from 'react';
import { DNSStatusChecker } from './DNSStatusChecker';

interface SiteInfo {
  title: string;
  slogan: string;
  owner: string;
  domain: string;
  phone: string;
}

interface Props {
  siteInfo: SiteInfo;
  setSiteInfo: (info: SiteInfo) => void;
}

export const StudioMode: React.FC<Props> = ({ siteInfo, setSiteInfo }) => {
  const [showGithubGuide, setShowGithubGuide] = useState(true);
  
  const getApiKeyStatus = () => {
    try {
      const key = process.env.API_KEY || "";
      if (!key) return { status: 'missing', text: '열쇠가 없습니다 (등록 필요)' };
      return { status: 'active', text: `연결됨 (${key.substring(0, 4)}***)` };
    } catch (e) {
      return { status: 'missing', text: '확인 불가' };
    }
  };

  const keyInfo = getApiKeyStatus();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-20">
      <div className="flex flex-col gap-10">
        
        <div className="bg-slate-900 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-amber-500/10 to-transparent pointer-events-none"></div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
              <span className="text-amber-500 font-mono text-[10px] tracking-[0.3em] font-black uppercase mb-4 block">Administrator Console</span>
              <h2 className="text-4xl md:text-5xl font-black serif-kr mb-4">수석 큐레이터 집무실</h2>
              <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start">
                <p className="text-slate-400 font-medium serif-kr">연구소 대문과 시스템을 관리하는 중앙 통제소입니다.</p>
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black border ${keyInfo.status === 'active' ? 'bg-green-500/10 border-green-500 text-green-500' : 'bg-rose-500/10 border-rose-500 text-rose-500 animate-pulse'}`}>
                  분석기 열쇠: {keyInfo.text}
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => setShowGithubGuide(!showGithubGuide)}
                className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all border border-white/20"
              >
                {showGithubGuide ? "가이드 접기" : "설정 도움말 보기"}
              </button>
            </div>
          </div>
        </div>

        {showGithubGuide && (
          <div className="grid md:grid-cols-2 gap-6 animate-in slide-in-from-top-10 duration-700">
            <div className="bg-white rounded-[3rem] p-10 border-4 border-amber-500 shadow-2xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center text-black text-2xl font-black">🔑</div>
                <h3 className="text-2xl font-black text-slate-900 serif-kr">API_KEY 등록법</h3>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                Vercel 설정(Settings) -> Environment Variables에서 <strong>API_KEY</strong>라는 이름으로 열쇠 번호를 등록하세요.
              </p>
              <a href="https://aistudio.google.com/app/apikey" target="_blank" className="text-amber-900 font-bold underline">구글에서 열쇠 번호 받기 →</a>
            </div>

            <div className="bg-white rounded-[3rem] p-10 border-4 border-red-500 shadow-2xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white text-2xl font-black">🌐</div>
                <h3 className="text-2xl font-black text-slate-900 serif-kr">도메인 오류 해결법</h3>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                이메일에 뜬 <strong>'잘못된 구성'</strong>은 카페24 설정이 누락되었다는 뜻입니다.
              </p>
              <ul className="text-xs text-red-600 space-y-2 font-bold">
                <li>1. 카페24 접속 -> 도메인 관리</li>
                <li>2. DNS 관리 -> 'A 레코드' 선택</li>
                <li>3. IP 주소 칸에 <strong>76.76.21.21</strong> 입력 후 저장</li>
              </ul>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5">
            <DNSStatusChecker domain={siteInfo.domain} />
          </div>
          
          <div className="lg:col-span-7">
            <div className="bg-white rounded-[3rem] p-12 border border-slate-200 shadow-2xl h-full flex flex-col">
              <header className="mb-10 border-b border-slate-100 pb-8 flex justify-between items-center">
                <h3 className="text-3xl font-black text-slate-900 serif-kr">연구소 명패 설정</h3>
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Edit Mode</span>
              </header>
              
              <div className="space-y-8 flex-1">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">연구소 간판 이름</label>
                  <input 
                    type="text" 
                    value={siteInfo.title}
                    onChange={(e) => setSiteInfo({...siteInfo, title: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-8 py-5 text-xl font-black text-slate-900 focus:border-amber-500 outline-none font-serif transition-all focus:bg-white focus:shadow-xl"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">수석 큐레이터 성함</label>
                    <input 
                      type="text" 
                      value={siteInfo.owner}
                      onChange={(e) => setSiteInfo({...siteInfo, owner: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-8 py-5 text-xl font-black text-slate-900 focus:border-amber-500 outline-none transition-all focus:bg-white focus:shadow-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">문의 연락처</label>
                    <input 
                      type="text" 
                      value={siteInfo.phone}
                      onChange={(e) => setSiteInfo({...siteInfo, phone: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-8 py-5 text-xl font-black text-slate-900 focus:border-amber-500 outline-none transition-all focus:bg-white focus:shadow-xl"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">연구소 슬로건</label>
                  <textarea 
                    value={siteInfo.slogan}
                    onChange={(e) => setSiteInfo({...siteInfo, slogan: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-lg font-medium text-slate-600 focus:border-amber-500 outline-none min-h-[100px] transition-all focus:bg-white focus:shadow-xl italic serif-kr"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
