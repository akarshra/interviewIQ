import React, { useState, useEffect, useRef } from 'react';
import maleVideo from "../assets/videos/male-ai.mp4";
import femaleVideo from "../assets/videos/female-ai.mp4";
import { motion, AnimatePresence } from "motion/react";
import { BsArrowRight, BsLightningCharge, BsSoundwave } from 'react-icons/bs';
import { FiMic, FiMicOff, FiCode, FiMessageSquare, FiInfo, FiActivity, FiUser } from 'react-icons/fi';
import { api } from '../utils/apiClient';
import Editor from '@monaco-editor/react';

function Step2Interview({ interviewData, onFinish }) {
  const { interviewId, questions, userName } = interviewData;
  const [isIntroPhase, setIsIntroPhase] = useState(true);

  const [isMicOn, setIsMicOn] = useState(true);
  const recognitionRef = useRef(null);
  const [isAIPlaying, setIsAIPlaying] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [timeLeft, setTimeLeft] = useState(
    questions[0]?.timeLimit || 60
  );
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [voiceGender, setVoiceGender] = useState("female");
  const [subtitle, setSubtitle] = useState("");
  
  // Monaco Code Editor V2 Feature State
  const [showEditor, setShowEditor] = useState(false);
  const [codeValue, setCodeValue] = useState("// Discuss and implement your solution here\n\nfunction solution() {\n  \n}");

  const autoSubmittedRef = useRef(false);
  const isSubmittingRef = useRef(false);
  const feedbackRef = useRef("");

  useEffect(() => {
    isSubmittingRef.current = isSubmitting;
  }, [isSubmitting]);

  useEffect(() => {
    feedbackRef.current = feedback;
  }, [feedback]);

  const videoRef = useRef(null);

  const currentQuestion = questions[currentIndex];

  function startMic() {
    if (recognitionRef.current && !isAIPlaying) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.debug(e);
      }
    }
  }

  function stopMic() {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices.length) return;

      const femaleVoice = voices.find(v =>
        v.name.toLowerCase().includes("zira") ||
        v.name.toLowerCase().includes("samantha") ||
        v.name.toLowerCase().includes("female")
      );

      if (femaleVoice) {
        setSelectedVoice(femaleVoice);
        setVoiceGender("female");
        return;
      }

      const maleVoice = voices.find(v =>
        v.name.toLowerCase().includes("david") ||
        v.name.toLowerCase().includes("mark") ||
        v.name.toLowerCase().includes("male")
      );

      if (maleVoice) {
        setSelectedVoice(maleVoice);
        setVoiceGender("male");
        return;
      }

      setSelectedVoice(voices[0]);
      setVoiceGender("female");
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const videoSource = voiceGender === "male" ? maleVideo : femaleVideo;

  const speakText = (text) => {
    return new Promise((resolve) => {
      if (!window.speechSynthesis || !selectedVoice) {
        resolve();
        return;
      }

      window.speechSynthesis.cancel();
      const humanText = text.replace(/,/g, ", ... ").replace(/\./g, ". ... ");

      const utterance = new SpeechSynthesisUtterance(humanText);
      utterance.voice = selectedVoice;
      utterance.rate = 0.92;
      utterance.pitch = 1.05;
      utterance.volume = 1;

      utterance.onstart = () => {
        setIsAIPlaying(true);
        stopMic();
        videoRef.current?.play();
      };

      utterance.onend = () => {
        videoRef.current?.pause();
        videoRef.current.currentTime = 0;
        setIsAIPlaying(false);

        if (isMicOn) {
          startMic();
        }
        setTimeout(() => {
          setSubtitle("");
          resolve();
        }, 300);
      };

      setSubtitle(text);
      window.speechSynthesis.speak(utterance);
    });
  };

  useEffect(() => {
    if (!selectedVoice) return;
    const runIntro = async () => {
      if (isIntroPhase) {
        await speakText(`Hi ${userName}, it's great to meet you today. I hope you're feeling confident and ready.`);
        await speakText("I'll ask you a few questions. Just answer naturally, and take your time. Let's begin.");
        setIsIntroPhase(false);
      } else if (currentQuestion) {
        await new Promise(r => setTimeout(r, 800));
        if (currentIndex === questions.length - 1) {
          await speakText("Alright, this one might be a bit more challenging.");
        }
        await speakText(currentQuestion.question);
        if (isMicOn) {
          startMic();
        }
      }
    };
    runIntro();
  }, [selectedVoice, isIntroPhase, currentIndex]);

  async function submitAnswer() {
    if (isSubmitting) return;
    stopMic();
    setIsSubmitting(true);

    try {
      // V2: Append Monaco Code to the Answer implicitly so the AI grades it!
      const payloadAnswer = showEditor 
        ? `# Candidate Code Implementation:\n\`\`\`javascript\n${codeValue}\n\`\`\`\n\n# Candidate Verbal Explanation:\n${answer || "(No verbal explanation provided)"}` 
        : answer;

      const result = await api.post("/api/interview/submit-answer", {
        interviewId,
        questionIndex: currentIndex,
        answer: payloadAnswer,
        timeTaken: currentQuestion.timeLimit - timeLeft,
      });

      setFeedback(result.data.feedback);
      speakText(result.data.feedback);
      setIsSubmitting(false);
    } catch (error) {
      console.log(error);
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    if (isIntroPhase) return;
    if (!currentQuestion) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (!autoSubmittedRef.current && !isSubmittingRef.current && !feedbackRef.current) {
            autoSubmittedRef.current = true;
            submitAnswer();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isIntroPhase, currentIndex]);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) return;

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      setAnswer((prev) => prev + " " + transcript);
    };

    recognitionRef.current = recognition;
  }, []);

  const toggleMic = () => {
    if (isMicOn) {
      stopMic();
    } else {
      startMic();
    }
    setIsMicOn(!isMicOn);
  };

  const handleNext = async () => {
    setAnswer("");
    setFeedback("");
    setCodeValue("// Discuss and implement your solution here\n\nfunction solution() {\n  \n}");
    autoSubmittedRef.current = false;

    if (currentIndex + 1 >= questions.length) {
      finishInterview();
      return;
    }

    await speakText("Alright, let's move to the next question.");

    const nextIndex = currentIndex + 1;
    setTimeLeft(questions[nextIndex]?.timeLimit || 60);
    setCurrentIndex(nextIndex);
    setTimeout(() => {
      if (isMicOn) startMic();
    }, 500);
  };

  const finishInterview = async () => {
    stopMic();
    setIsMicOn(false);
    try {
      const result = await api.post("/api/interview/finish", { interviewId });
      console.log(result.data);
      onFinish(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current.abort();
      }
      window.speechSynthesis.cancel();
    };
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="h-screen bg-[#0E0E10] text-slate-200 font-sans p-4 lg:px-6 lg:py-4 flex flex-col relative overflow-hidden selection:bg-[#6366F1]/30">
      
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
            <p className="text-[11px] text-[#6366F1] font-bold tracking-[0.2em] uppercase mt-0.5">Live Mock Session</p>
          </div>
        </div>

        <div className="flex items-center gap-5">

          {/* Code Editor Toggle */}
          <button 
             onClick={() => setShowEditor(!showEditor)}
             className={`hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold shadow-lg transition-all ${
               showEditor 
                 ? "bg-[#6366F1] text-white shadow-[0_0_20px_rgba(99,102,241,0.5)] border border-[#4F46E5]" 
                 : "bg-[#151518]/90 backdrop-blur-md border border-[#6366F1]/40 text-[#6366F1] hover:bg-[#6366F1]/10"
             }`}
           >
             <FiCode className="text-lg" /> {showEditor ? "Close IDE" : "Open Code Editor"}
          </button>

          {/* Status Indicator */}
          <div className="hidden md:flex px-5 py-2.5 rounded-full bg-black/40 border border-white/5 backdrop-blur-xl items-center gap-3 hover:bg-black/60 transition-colors cursor-default">
            <div className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
            </div>
            <span className="text-sm font-semibold text-slate-300 tracking-wide">Live Question</span>
            <div className="w-px h-4 bg-white/10 mx-1"></div>
            <span className="text-sm font-mono text-[#10B981] w-12 text-center drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]">{formatTime(timeLeft)}</span>
          </div>

          <div className="w-10 h-10 rounded-full bg-[#202024] border-2 border-[#10B981] flex items-center justify-center text-[#10B981] font-bold shadow-[0_0_10px_rgba(16,185,129,0.3)]">
            {userName ? userName.charAt(0).toUpperCase() : <FiUser />}
          </div>
        </div>
      </header>

      {/* Main Content: Bento Grid */}
      <main className="relative z-10 flex-1 grid grid-cols-1 md:grid-cols-12 md:grid-rows-12 gap-4 min-h-0 overflow-hidden pb-2">
        
        {/* === GRID ITEM 0: CODE EDITOR (V2 FEATURE) === */}
        <AnimatePresence>
          {showEditor && (
             <motion.div 
               initial={{ opacity: 0, x: -50, scale: 0.95 }}
               animate={{ opacity: 1, x: 0, scale: 1 }}
               exit={{ opacity: 0, x: -50, scale: 0.95, width: 0 }}
               transition={{ type: "spring", stiffness: 100, damping: 20 }}
               className="col-span-1 md:col-span-5 row-span-1 md:row-span-12 rounded-[2rem] border border-[#6366F1]/30 bg-[#0A0A0C] shadow-[0_0_50px_rgba(99,102,241,0.1)] flex flex-col relative overflow-hidden"
             >
                <div className="h-12 bg-black/60 border-b border-white/5 flex items-center justify-between px-5">
                   <div className="flex items-center gap-3">
                     <div className="flex gap-1.5 opacity-80">
                       <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-400 cursor-pointer transition-colors" onClick={() => setShowEditor(false)}></div>
                       <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                       <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                     </div>
                     <div className="text-xs font-mono text-slate-400 tracking-wider">solution.js</div>
                   </div>
                   <div className="text-[10px] uppercase font-bold tracking-widest text-[#6366F1] flex items-center gap-2">
                     <span className="relative flex h-2 w-2">
                       <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6366F1] opacity-75"></span>
                       <span className="relative inline-flex rounded-full h-2 w-2 bg-[#6366F1]"></span>
                     </span>
                     Synched to AI
                   </div>
                </div>
                <div className="flex-1 w-full relative pt-4 bg-[#0A0A0C]">
                   <Editor
                     height="100%"
                     defaultLanguage="javascript"
                     theme="vs-dark"
                     value={codeValue}
                     onChange={(val) => setCodeValue(val)}
                     options={{
                       minimap: { enabled: false },
                       fontSize: 14,
                       padding: { top: 8 },
                       fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
                       scrollBeyondLastLine: false,
                       lineHeight: 24,
                     }}
                   />
                </div>
             </motion.div>
          )}
        </AnimatePresence>

        {/* === GRID ITEM 1: TEXT AND QUESTION AREA === */}
        {/* Dynamic Classnames mapping dynamically adjusts whether it is 8 cols wide (no IDE) or 4 cols wide (IDE open) */}
        <div className={`col-span-1 border border-white/10 bg-[#151518]/80 backdrop-blur-2xl p-5 shadow-2xl flex flex-col relative overflow-hidden group transition-all duration-500 ${showEditor ? "md:col-span-4 md:row-span-12 rounded-[2rem]" : "md:col-span-8 md:row-span-12 rounded-3xl p-6"}`}>
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#6366F1]/10 border border-[#6366F1]/20 text-[#6366F1]">
              <FiMessageSquare className="text-sm" />
              <span className="text-[10px] font-bold uppercase tracking-widest">
                {isIntroPhase ? "Wait" : `Question ${currentIndex + 1} of ${questions?.length || 0}`}
              </span>
            </div>
            {!showEditor && (
              <div className="text-[10px] font-semibold text-slate-400 bg-white/5 px-3 py-1.5 rounded-full border border-white/5 uppercase tracking-wider">
                Target Time: {formatTime(currentQuestion?.timeLimit || 60)}
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 relative z-10 flex flex-col min-h-0">
            
            <h2 className={`font-medium leading-snug text-slate-100 tracking-tight ${showEditor ? "text-lg mb-2" : "text-xl md:text-2xl mb-2"}`}>
              {isIntroPhase ? "Please wait for the AI Interviewer to finish introducing the session..." : currentQuestion?.question}
            </h2>

            {/* Answer Box */}
            <div className="flex-1 mt-2 relative pb-2 flex flex-col min-h-0">
              <textarea
                placeholder="Start speaking when ready, your verbal answer will appear here..."
                onChange={(e) => setAnswer(e.target.value)}
                value={answer}
                disabled={isAIPlaying || isIntroPhase}
                className="w-full flex-1 min-h-[80px] bg-[#0A0A0B] p-4 rounded-xl resize-none outline-none border border-white/5 focus:border-[#6366F1]/50 focus:ring-1 focus:ring-[#6366F1]/50 transition-all text-slate-300 placeholder:text-slate-600 disabled:opacity-50 text-sm leading-relaxed"
              />
            </div>

            {/* AI Feedback View */}
            {feedback && (
               <motion.div 
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 className='mt-2 bg-[#10B981]/10 border border-[#10B981]/30 p-4 rounded-xl shadow-sm backdrop-blur-md mb-4'>
                 <div className="flex items-center gap-2 mb-2 text-[#10B981]">
                    <FiActivity />
                    <span className="text-[10px] font-bold uppercase tracking-wide">AI Evaluation</span>
                 </div>
                 <p className='text-slate-200 font-medium leading-relaxed text-sm'>{feedback}</p>
                 <button
                  onClick={handleNext}
                  className='mt-4 w-full bg-gradient-to-r from-[#10B981] to-emerald-500 text-black py-2.5 rounded-lg shadow-md hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all font-bold flex items-center justify-center gap-2 text-sm'>
                  Next Question <BsArrowRight size={16}/>
                 </button>
               </motion.div>
            )}

            {!feedback && (
              <div className='flex items-center gap-3 mt-auto pt-2'>
                <motion.button
                  onClick={toggleMic}
                  disabled={isSubmitting || isAIPlaying}
                  whileTap={{ scale: 0.9 }}
                  className={`w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-xl shadow-lg transition duration-300 ${isMicOn ? 'bg-black border border-[#6366F1]/30 hover:bg-white/10 text-[#6366F1]' : 'bg-red-500/20 text-red-500 border border-red-500/30'}`}>
                  {isMicOn ? <FiMic size={20} /> : <FiMicOff size={20}/>}
                </motion.button>
    
                <motion.button
                  onClick={submitAnswer}
                  disabled={isSubmitting || isIntroPhase || isAIPlaying}
                  whileTap={{ scale: 0.95 }}
                  className='flex-1 bg-gradient-to-r from-[#6366F1] to-[#4F46E5] text-white py-3.5 rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.2)] hover:shadow-[0_0_25px_rgba(99,102,241,0.4)] transition-all font-bold text-sm tracking-wide disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden'>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                  {isSubmitting ? "Submitting to AI..." : "Commit Answer"}
                </motion.button>
              </div>
            )}
          </div>
        </div>

        {/* === GRID ITEM 2: AI INTERVIEWER PIP === */}
        <div className={`col-span-1 overflow-hidden relative border border-white/10 bg-[#1A1A1B] shadow-2xl group flex flex-col justify-end transition-all duration-500 ${showEditor ? "md:col-span-3 md:row-span-7 rounded-[2rem]" : "md:col-span-4 md:row-span-7 rounded-3xl"}`}>
          <video
              src={videoSource}
              key={videoSource}
              ref={videoRef}
              muted
              playsInline
              preload="auto"
              className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
          
          {isAIPlaying && (
            <div className="absolute top-4 left-4 backdrop-blur-md bg-black/50 border border-[#6366F1]/50 px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
              <BsSoundwave className="text-[#6366F1] animate-pulse" />
              <span className="text-[9px] font-bold text-white uppercase tracking-wider text-[#6366F1]">Computing Output</span>
            </div>
          )}

          <div className="relative z-10 p-4 w-full">
            <p className="text-xs font-bold text-white mb-2 drop-shadow-md tracking-wide">AI Technical Lead</p>
            {isAIPlaying && (
              <div className="w-full bg-slate-800/80 h-1 rounded-full overflow-hidden backdrop-blur-sm shadow-[0_0_10px_rgba(99,102,241,0.3)]">
                  <div className="h-full bg-gradient-to-r from-[#6366F1] to-[#818CF8]" style={{width: '70%', animation: 'pulse-width 2s infinite ease-in-out'}}></div>
              </div>
            )}
          </div>
        </div>

        {/* === GRID ITEM 3: SUBTITLES === */}
        <div className={`col-span-1 border border-white/10 bg-[#151518]/80 backdrop-blur-xl p-5 shadow-2xl flex flex-col relative overflow-hidden transition-all duration-500 ${showEditor ? "md:col-span-3 md:row-span-5 rounded-[2rem]" : "md:col-span-4 md:row-span-5 rounded-3xl"}`}>
             <div className="flex items-center gap-2.5 mb-3">
               <div className="p-1.5 rounded-lg bg-[#10B981]/20 text-[#10B981]">
                 <FiInfo className="text-sm" />
               </div>
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live Transcript</span>
             </div>
             
             <div className="flex-1 flex flex-col justify-start bg-black/40 rounded-xl border border-white/5 p-4 overflow-y-auto custom-scrollbar relative min-h-0">
                <p className="text-xs text-slate-300 italic leading-relaxed font-medium">
                  {subtitle || (isAIPlaying ? "Generating response..." : "Actively listening to candidate...")}
                  {isAIPlaying && <span className="inline-block relative top-0.5 ml-2 w-1.5 h-3.5 bg-[#10B981] animate-pulse"></span>}
                </p>
             </div>
        </div>

      </main>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.2); }
        
        @keyframes pulse-width {
          0% { width: 40%; }
          50% { width: 80%; }
          100% { width: 40%; }
        }
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
}

export default Step2Interview;
