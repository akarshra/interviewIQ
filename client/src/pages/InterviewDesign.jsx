import React, { useState, useEffect } from 'react';
import { FiMic, FiMicOff, FiVideo, FiVideoOff, FiSettings, FiPhoneMissed, FiActivity, FiEye, FiClock, FiMaximize2, FiMessageSquare } from 'react-icons/fi';
import { BsEmojiSmile, BsLightningCharge, BsSoundwave } from 'react-icons/bs';
import { BiVolumeFull } from 'react-icons/bi';

const InterviewDesign = () => {
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [time, setTime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTime(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="min-h-screen bg-[#0E0E10] text-slate-200 font-sans p-4 lg:p-6 flex flex-col relative overflow-hidden selection:bg-[#6366F1]/30">
      
      {/* Background Ambient Gradients */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#6366F1]/10 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#10B981]/5 blur-[120px]"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center mb-6 px-2">
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#6366F1] to-[#4F46E5] flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.4)] group-hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] transition-all duration-300 transform group-hover:-translate-y-0.5">
            <BsLightningCharge className="text-white text-2xl drop-shadow-md" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">InterviewIQ</h1>
            <p className="text-[11px] text-[#6366F1] font-bold tracking-[0.2em] uppercase mt-0.5">AI-Powered Assessment</p>
          </div>
        </div>

        <div className="flex items-center gap-5">
          {/* Status Indicator */}
          <div className="hidden md:flex px-5 py-2 rounded-full bg-black/40 border border-white/5 backdrop-blur-xl items-center gap-3 hover:bg-black/60 transition-colors cursor-default">
            <div className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
            </div>
            <span className="text-sm font-semibold text-slate-300 tracking-wide">Live Session</span>
            <div className="w-px h-4 bg-white/10 mx-1"></div>
            <span className="text-sm font-mono text-slate-400 w-12 text-center">{formatTime(time)}</span>
          </div>

          {/* User Profile */}
          <button className="w-12 h-12 rounded-full border-2 border-slate-800 p-0.5 relative overflow-hidden hover:border-[#6366F1]/50 transition-colors group">
            <div className="w-full h-full rounded-full overflow-hidden">
               <img src="https://i.pravatar.cc/150?img=11" alt="User" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#10B981] border-2 border-[#0E0E10] rounded-full"></div>
          </button>
        </div>
      </header>

      {/* Main Content: Bento Grid */}
      <main className="relative z-10 flex-1 grid grid-cols-1 md:grid-cols-12 md:grid-rows-12 gap-5 h-[calc(100vh-110px)] min-h-[700px]">
        
        {/* === GRID ITEM 1: MAIN VIDEO (Span cols 1-8, rows 1-9) === */}
        <div className="col-span-1 md:col-span-8 row-span-1 md:row-span-9 rounded-3xl overflow-hidden relative group border border-white/5 bg-black/50 backdrop-blur-sm shadow-2xl">
          {/* Glowing active ring */}
          <div className="absolute inset-0 rounded-3xl ring-1 ring-[#6366F1]/20 group-hover:ring-[#6366F1]/40 transition-all duration-500 pointer-events-none z-20"></div>
          <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] pointer-events-none z-10"></div>
          
          {/* Main Candidate Video */}
          <img 
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2000&auto=format&fit=crop" 
            alt="Candidate Video" 
            className="absolute inset-0 w-full h-full object-cover opacity-85 transition-transform duration-1000 group-hover:scale-[1.02]"
          />

          {/* Name Tag */}
          <div className="absolute bottom-6 left-6 z-20 backdrop-blur-xl bg-black/60 border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-3 animate-fade-in-up">
            <div className="w-2 h-2 rounded-full bg-[#10B981]"></div>
            <span className="text-sm font-medium text-white tracking-wide">Sarah Jenkins (You)</span>
          </div>

          {/* Audio Visualizer Overlay */}
          <div className="absolute bottom-6 right-6 z-20 backdrop-blur-xl bg-black/50 border border-white/10 p-3 rounded-2xl flex items-end gap-1.5 h-12 w-32 justify-center pb-3">
            {[4, 12, 8, 16, 10, 20, 14, 6].map((h, i) => (
              <div 
                key={i} 
                className="w-1.5 bg-gradient-to-t from-[#6366F1] to-[#10B981] rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" 
                style={{ 
                  height: `${h}px`, 
                  animation: `pulse-height 1.${i}s infinite ease-in-out alternate` 
                }}
              ></div>
            ))}
          </div>

          <button className="absolute top-6 right-6 z-20 p-2.5 rounded-xl bg-black/40 hover:bg-black/60 border border-white/10 text-white backdrop-blur-md transition-all">
            <FiMaximize2 />
          </button>
        </div>

        {/* === GRID ITEM 2: AI INTERVIEWER PIP (Span cols 9-12, rows 1-5) === */}
        <div className="col-span-1 md:col-span-4 row-span-1 md:row-span-5 rounded-3xl overflow-hidden relative border border-white/10 bg-[#1A1A1B] shadow-2xl group">
          <img 
            src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=800&auto=format&fit=crop" 
            alt="AI Interviewer" 
            className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
          
          <div className="absolute top-4 left-4 backdrop-blur-md bg-black/40 border border-white/10 px-3 py-1.5 rounded-lg flex items-center gap-2">
            <BsSoundwave className="text-[#6366F1] animate-pulse" />
            <span className="text-[10px] font-bold text-white uppercase tracking-wider">AI Speaking</span>
          </div>

          <div className="absolute bottom-4 left-4 right-4">
            <p className="text-sm font-semibold text-white mb-1 drop-shadow-md">Alex (AI Technical Host)</p>
            <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden backdrop-blur-sm">
                <div className="h-full bg-gradient-to-r from-[#6366F1] to-[#818CF8]" style={{width: '70%'}}></div>
            </div>
            <p className="text-[10px] text-slate-300 mt-1.5 text-right font-medium">Confidence: 98%</p>
          </div>
        </div>

        {/* === GRID ITEM 3: QUESTION / CONTEXT CARD (Span cols 9-12, rows 6-12) === */}
        <div className="col-span-1 md:col-span-4 row-span-1 md:row-span-7 rounded-3xl border border-white/10 bg-[#151518]/80 backdrop-blur-2xl p-6 shadow-2xl flex flex-col relative overflow-hidden group">
          {/* Subtle top glare */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#6366F1]/10 border border-[#6366F1]/20 text-[#6366F1]">
              <FiMessageSquare className="text-sm" />
              <span className="text-xs font-bold uppercase tracking-widest">Current Prompt</span>
            </div>
            <div className="text-xs font-semibold text-slate-400 bg-white/5 px-3 py-1.5 rounded-full">Task 2 of 5</div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 relative z-10">
            <h2 className="text-2xl font-medium leading-normal text-slate-100 mb-4 tracking-tight">
              Design a highly available URL shortener (like bit.ly) that can handle 100M new URLs per day.
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              Focus on the core API design, database schema, and capacity planning. Consider read/write ratios and how you would ensure minimal latency for redirections.
            </p>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer flex gap-3 items-start">
                <div className="mt-0.5 text-[#10B981]"><FiClock /></div>
                <div>
                  <h4 className="text-sm font-semibold text-white mb-1">Suggested Time Idea</h4>
                  <p className="text-xs text-slate-400">Aim to answer within 15 minutes. Break down into Requirements, API, and Schema.</p>
                </div>
              </div>
            </div>
          </div>

          {/* AI Transcription preview */}
          <div className="mt-4 p-4 rounded-2xl bg-[#0A0A0B] border border-white/5 relative">
            <div className="absolute -top-3 left-4 bg-[#10B981] text-black text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]">
              Live Transcript
            </div>
            <p className="text-sm text-slate-300 italic leading-relaxed pt-1 flex items-center gap-2">
              "...I would start by estimating the traffic. Let's assume we have 100M writes..."
              <span className="inline-block w-1 h-4 bg-[#10B981] animate-pulse"></span>
            </p>
          </div>
        </div>

        {/* === GRID ITEM 4: METRICS WIDGETS (Span cols 1-4, rows 10-12) === */}
        <div className="col-span-1 md:col-span-4 row-span-1 md:row-span-3 grid grid-cols-2 gap-5 z-20">
          
          {/* Metric 1 */}
          <div className="rounded-3xl border border-white/10 bg-[#151518]/80 backdrop-blur-xl p-5 shadow-2xl flex flex-col justify-center relative group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#10B981]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-center gap-3 mb-2">
               <div className="p-2 rounded-xl bg-[#10B981]/20 text-[#10B981] shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                 <FiEye className="text-lg" />
               </div>
               <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">Eye Contact</span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-white tracking-tighter">94<span className="text-lg text-slate-500">%</span></span>
              <span className="text-xs font-semibold text-[#10B981] mb-1.5 px-2 py-0.5 rounded-md bg-[#10B981]/10">Excellent</span>
            </div>
          </div>

          {/* Metric 2 */}
          <div className="rounded-3xl border border-white/10 bg-[#151518]/80 backdrop-blur-xl p-5 shadow-2xl flex flex-col justify-center relative group overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-br from-[#6366F1]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
             <div className="flex items-center gap-3 mb-2">
               <div className="p-2 rounded-xl bg-[#6366F1]/20 text-[#6366F1] shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                 <FiActivity className="text-lg" />
               </div>
               <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">Pacing</span>
             </div>
             <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-white tracking-tighter">135</span>
              <span className="text-xs font-semibold text-slate-400 mb-1.5">wpm</span>
            </div>
            <div className="mt-2 text-[10px] text-[#6366F1] font-medium flex items-center gap-1">
              Perfect conversational speed
            </div>
          </div>
        </div>

        {/* === GRID ITEM 5: CONTROL BAR (Span cols 5-8, rows 10-12) === */}
        <div className="col-span-1 md:col-span-4 row-span-1 md:row-span-3 rounded-3xl border border-white/10 bg-[#151518]/80 backdrop-blur-xl p-6 shadow-2xl flex items-center justify-center relative">
           <div className="flex items-center justify-between w-full max-w-sm">
             <button 
              onClick={() => setMicOn(!micOn)}
              className={`p-4 rounded-2xl transition-all duration-300 ${micOn ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-red-500/20 text-red-500 hover:bg-red-500/30 border border-red-500/30'}`}
            >
               {micOn ? <FiMic className="text-2xl" /> : <FiMicOff className="text-2xl" />}
             </button>
             
             <button 
              onClick={() => setVideoOn(!videoOn)}
              className={`p-4 rounded-2xl transition-all duration-300 ${videoOn ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-red-500/20 text-red-500 hover:bg-red-500/30 border border-red-500/30'}`}
            >
               {videoOn ? <FiVideo className="text-2xl" /> : <FiVideoOff className="text-2xl" />}
             </button>

             <button className="p-4 rounded-2xl bg-white/5 text-white hover:bg-white/15 transition-all duration-300">
               <FiSettings className="text-2xl" />
             </button>

             <button className="p-4 px-6 rounded-2xl bg-[#E11D48] text-white hover:bg-[#BE123C] transition-all duration-300 shadow-[0_0_20px_rgba(225,29,72,0.4)] flex items-center gap-2 group">
               <FiPhoneMissed className="text-xl group-hover:scale-110 transition-transform" />
             </button>
           </div>
        </div>

      </main>

      {/* Global generic styles inserted directly for the custom-scrollbar utility and animations */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.2); }
        
        @keyframes pulse-height {
          0% { transform: scaleY(0.5); transform-origin: bottom; opacity: 0.6; }
          100% { transform: scaleY(1.5); transform-origin: bottom; opacity: 1; }
        }

        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
      `}} />
    </div>
  );
};

export default InterviewDesign;
