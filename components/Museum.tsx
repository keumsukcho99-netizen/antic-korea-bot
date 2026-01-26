import React from 'react';
import { AppraisalResult } from '../types';
import { Landmark, Calendar, Award, ChevronRight, SearchX } from 'lucide-react';

interface MuseumProps {
  results: AppraisalResult[];
  onViewDetail: (result: AppraisalResult) => void;
}

const Museum: React.FC<MuseumProps> = ({ results, onViewDetail }) => {
  return (
    <div className="py-20 px-6 max-w-6xl mx-auto space-y-16 animate-fadeIn">
      <header className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#b8860b]/10 border border-[#b8860b]/30 rounded-full text-[#b8860b] text-[10px] font-black tracking-widest uppercase mb-4">
          Digital Archive Gallery
        </div>
        <h2 className="text-5xl font-serif-kr font-black text-white">디지털 기증관</h2>
        <p className="text-gray-500 font-serif-kr text-lg">"당신이 깨운 시간이 이곳에 머뭅니다."</p>
      </header>

      {results.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-[48px] p-24 text-center space-y-6">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto text-gray-700">
            <SearchX size={40} />
          </div>
          <p className="text-gray-500 font-serif-kr">아직 기증된 유물 데이터가 없습니다. 고증을 시작해 보세요.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {results.map((item) => (
            <div 
              key={item.id} 
              onClick={() => onViewDetail(item)}
              className="group bg-[#0a0a0a] border border-[#b8860b]/20 rounded-[40px] overflow-hidden hover:border-[#b8860b] transition-all cursor-pointer shadow-2xl hover:-translate-y-2"
            >
              <div className="aspect-[4/3] relative overflow-hidden bg-black flex items-center justify-center p-6">
                <img src={item.imageUrls[0]} alt={item.title} className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] text-[#b8860b] font-black border border-[#b8860b]/30">
                  {item.confidenceScore}% Verified
                </div>
              </div>
              <div className="p-8 space-y-4">
                <div className="flex items-center gap-2 text-[10px] text-gray-500 font-black uppercase tracking-widest">
                  <Calendar size={12} /> {new Date(item.timestamp).toLocaleDateString()}
                </div>
                <h3 className="text-2xl font-serif-kr font-black text-white group-hover:text-[#b8860b] transition-colors">{item.title}</h3>
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2 text-[#b8860b] text-xs font-serif-kr">
                    <Award size={14} /> {item.category}
                  </div>
                  <div className="text-white/20 group-hover:text-[#b8860b] transition-colors">
                    <ChevronRight size={20} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Museum;
