import React from 'react';
import { Landmark, Info, Library, Search, Globe, ShieldCheck, Heart, ExternalLink } from 'lucide-react';
import { ViewState } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeView: ViewState;
  setView: (view: ViewState) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, setView }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-gray-200">
      {/* Header */}
      <header className="bg-black/80 backdrop-blur-3xl p-6 sticky top-0 z-[100] border-b border-[#b8860b]/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 cursor-pointer group" onClick={() => setView('home')}>
            <div className="bg-[#b8860b] p-2.5 rounded-2xl text-black shadow-[0_0_20px_rgba(184,134,11,0.3)] group-hover:scale-105 transition-transform">
              <Landmark size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-serif-kr font-black tracking-tighter text-white leading-tight">
                  Antique-Korea.com
                </h1>
                <ShieldCheck size={14} className="text-[#b8860b]" />
              </div>
              <p className="text-[9px] text-gray-500 font-black uppercase tracking-[0.2em] font-serif-kr flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Connected to Official Domain
              </p>
            </div>
          </div>
          
          <nav className="flex items-center gap-1 md:gap-3">
            {[
              { id: 'home', label: '고증실', icon: Search },
              { id: 'museum', label: '박물관', icon: Library },
              { id: 'library', label: '이주 센터', icon: Globe },
              { id: 'about', label: '인사', icon: Info },
            ].map((item) => (
              <button 
                key={item.id}
                onClick={() => setView(item.id as ViewState)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all text-sm font-serif-kr font-bold ${activeView === item.id ? 'bg-[#b8860b] text-black shadow-xl scale-105' : 'text-gray-500 hover:text-[#b8860b] hover:bg-white/5'}`}
              >
                <item.icon size={16} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative">
        <div className="absolute inset-0 hanji-texture-dark opacity-[0.03]" />
        <div className="relative z-10 max-w-6xl mx-auto">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black border-t border-white/5 pt-28 pb-16 px-6 mt-32 relative overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-20 relative z-10">
          
          {/* Donation & Blog Link Combined Box */}
          <div className="bg-white p-12 md:p-16 rounded-[64px] text-center shadow-3xl relative overflow-hidden border-t-[12px] border-[#2d5a4c]">
            <div className="space-y-8 relative z-10">
              <h4 className="text-3xl md:text-5xl font-serif-kr font-black text-gray-900 leading-tight tracking-tighter">
                "방 정리가 끝나는 그날까지 <br className="hidden md:block" /> 사랑방에서 기다리겠습니다."
              </h4>
              
              <div className="flex flex-col md:flex-row justify-center gap-4">
                <a 
                  href="https://blog.naver.com/keumsukcho" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-[#2d5a4c] text-white px-10 py-5 rounded-2xl font-black font-serif-kr text-xl flex items-center gap-4 shadow-xl hover:bg-[#1e3d33] transition-all justify-center"
                >
                  블로그 쉼터 방문 <ExternalLink size={24} />
                </a>
                <button className="bg-gray-100 text-gray-800 px-10 py-5 rounded-2xl font-black font-serif-kr text-xl flex items-center gap-4 shadow-xl hover:bg-gray-200 transition-all justify-center">
                  아카이브 후원 <Heart size={24} className="text-red-500" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-8 text-center text-gray-500">
            <div className="space-y-4">
               <p className="font-serif-kr font-black text-lg tracking-widest uppercase flex items-center gap-3">
                  <Globe size={18} className="text-[#b8860b]" /> www.antique-korea.com
               </p>
               <div className="text-[11px] font-serif-kr font-medium space-y-1 opacity-60">
                <p>운영 및 고증 총괄: THE HUMAN | blog.naver.com/keumsukcho</p>
                <p>Copyright © 2025 Antique-Korea.com. All rights reserved.</p>
               </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
