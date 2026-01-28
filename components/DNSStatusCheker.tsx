import React, { useState, useEffect } from 'react';
import { checkDNSStatus } from '../dnsService';

export const DNSStatusChecker: React.FC<{ domain: string }> = ({ domain }) => {
  const [ips, setIps] = useState<string[]>([]);
  const [checking, setChecking] = useState(false);

  const isVercelIP = (ip: string) => 
    ip === '76.76.21.21' || ip.startsWith('76.76.21.') || ip.startsWith('66.33.');

  const handleCheck = async () => {
    setChecking(true);
    try {
        const result = await checkDNSStatus(domain);
        setIps(result.currentIPs);
    } catch (e) {
        console.error("DNS 확인 실패", e);
    }
    setTimeout(() => setChecking(false), 1000);
  };

  useEffect(() => {
    handleCheck();
    const timer = setInterval(handleCheck, 30000);
    return () => clearInterval(timer);
  }, [domain]);

  const isFullyConnected = ips.some(isVercelIP);

  return (
    <div className={`bg-white rounded-[3rem] p-10 border-4 transition-all duration-1000 h-full flex flex-col justify-between ${isFullyConnected ? 'border-green-500 shadow-[20px_20px_0px_rgba(34,197,94,0.1)]' : 'border-red-500 shadow-[20px_20px_0px_rgba(239,68,68,0.1)]'} relative overflow-hidden`}>
      <div className="absolute -right-4 -bottom-4 text-[120px] font-black text-slate-50 opacity-10 select-none serif-kr">
        {isFullyConnected ? "通" : "待"}
      </div>

      <div>
        <header className="mb-8 text-center">
          <div className={`inline-block px-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase mb-4 transition-colors ${isFullyConnected ? 'bg-green-500 text-white animate-bounce' : 'bg-red-100 text-red-900'}`}>
            {isFullyConnected ? "🎊 NETWORK ACTIVE" : "⚠️ NETWORK PENDING"}
          </div>
          <h3 className="text-2xl font-black text-slate-900 serif-kr tracking-tight mb-2">
            도메인 연결 현황
          </h3>
          <p className="text-slate-400 text-xs font-medium font-mono">{domain}</p>
        </header>

        {isFullyConnected ? (
          <div className="mb-10 animate-in fade-in zoom-in duration-1000">
            <div className="flex justify-center mb-6">
               <div className="w-24 h-24 border-4 border-green-500 rounded-full flex items-center justify-center text-3xl font-black text-green-500 rotate-12 shadow-inner">
                  通
               </div>
            </div>
            <div className="p-6 bg-green-50 rounded-2xl text-center">
              <p className="text-green-900 font-black text-sm mb-1 serif-kr">대성공! 주소 연결 완료</p>
              <p className="text-green-700 text-[10px] leading-relaxed">
                이제 전 세계 어디서든 어르신의 <br/>
                연구소에 접속할 수 있습니다.
              </p>
            </div>
          </div>
        ) : (
          <div className="mb-10">
            <div className="flex justify-center mb-6 opacity-30">
               <div className="w-24 h-24 border-4 border-slate-300 rounded-full flex items-center justify-center text-3xl font-black text-slate-300 rotate-12">
                  待
               </div>
            </div>
            <div className="p-6 bg-red-50 border-2 border-red-100 rounded-2xl">
              <p className="text-[11px] font-bold text-red-900 mb-4 flex items-center gap-2">
                <span>📌</span> 카페24 설정 확인:
              </p>
              <div className="bg-white p-4 rounded-xl border border-red-200 text-center mb-4">
                <p className="text-2xl font-mono font-black text-slate-900 tracking-tighter">76.76.21.21</p>
              </div>
              <p className="text-[10px] text-red-700 leading-relaxed font-medium">
                카페24 관리 화면에서 이 숫자를 입력하셨나요? <br/>
                연결될 때까지는 조금 시간이 걸립니다.
              </p>
            </div>
          </div>
        )}
      </div>

      <button 
        onClick={handleCheck}
        disabled={checking}
        className={`w-full py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl transition-all active:scale-95 ${checking ? 'bg-slate-100 text-slate-400' : 'bg-slate-900 text-white hover:bg-black'}`}
      >
        {checking ? "주소지를 확인하는 중..." : "🔄 실시간 상태 새로고침"}
      </button>
    </div>
  );
};
