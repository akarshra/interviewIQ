import React, { useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import { useSelector } from 'react-redux';
import { motion as Motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from "motion/react";
import { BsCheckCircleFill, BsPlayFill, BsGraphUpArrow, BsMic, BsBarChart, BsRobot, BsLightningChargeFill } from "react-icons/bs";
import { FiArrowRight, FiCode, FiCpu, FiMessageSquare, FiShield } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';
import AuthModel from '../components/AuthModel';
import Footer from '../components/Footer';

// Reusable animated gradient text
const GradientText = ({ children, className }) => (
  <span className={`text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 animate-gradient bg-300% ${className}`}>
    {children}
  </span>
);

function Home() {
  const { userData } = useSelector((state) => state.user);
  const [showAuth, setShowAuth] = useState(false);
  const navigate = useNavigate();
  
  // Parallax and scroll animation hooks
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"]
  });

  const heroImageScale = useTransform(scrollYProgress, [0, 0.4], [0.85, 1]);
  const heroImageRotateX = useTransform(scrollYProgress, [0, 0.4], [15, 0]);
  const heroImageY = useTransform(scrollYProgress, [0, 0.4], [50, 0]);
  const heroOpacity = useTransform(scrollYProgress, [0.3, 0.5], [1, 0.4]);

  const companies = ["Google", "Meta", "Amazon", "Netflix", "Apple", "Microsoft", "Stripe", "Vercel", "OpenAI"];

  // 3D Interactive Mouse Tracking tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    mouseX.set((clientX / innerWidth) * 2 - 1);
    mouseY.set((clientY / innerHeight) * 2 - 1);
  };

  const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const floatRotateX = useTransform(smoothMouseY, [-1, 1], [25, -25]);
  const floatRotateY = useTransform(smoothMouseX, [-1, 1], [-25, 25]);
  const floatTranslateX = useTransform(smoothMouseX, [-1, 1], [-50, 50]);
  const floatTranslateY = useTransform(smoothMouseY, [-1, 1], [-50, 50]);
  const invTranslateX = useTransform(smoothMouseX, [-1, 1], [50, -50]);
  const invTranslateY = useTransform(smoothMouseY, [-1, 1], [50, -50]);

  // Framer Motion Variants
  const staggerContainer = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
  };

  return (
    <div onMouseMove={handleMouseMove} className='min-h-screen bg-[#070709] text-white font-sans flex flex-col relative selection:bg-indigo-500/30 selection:text-white overflow-x-hidden'>
      
      {/* Dynamic Ambient Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" style={{ willChange: 'transform' }}>
        <Motion.div 
          animate={{ x: [0, 100, 0], y: [0, 50, 0] }} 
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[120px]" 
          style={{ willChange: "transform" }}
        />
        <Motion.div 
          animate={{ x: [0, -100, 0], y: [0, -50, 0] }} 
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-cyan-600/10 blur-[120px]" 
          style={{ willChange: "transform" }}
        />
        <Motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }} 
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[40%] left-[40%] w-[800px] h-[400px] rounded-full bg-purple-600/5 blur-[150px]" 
          style={{ willChange: "transform", opacity: 0.1 }}
        />
      </div>

      {/* Subtle Noise Texture Overlay (Replaced SVG filter for performance) */}
      <div className="fixed inset-0 opacity-[0.02] pointer-events-none z-0 mix-blend-screen" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/stardust.png")' }}></div>

      <div className="relative z-10 flex-col flex min-h-screen">
        <Navbar />

        {/* --- SECTION 1: HERO "THE REVEAL" --- */}
        <section className='pt-32 pb-20 px-6 relative flex flex-col items-center justify-center min-h-[95vh] border-b border-white/5 perspective-1000'>
          
          {/* Floating Parallax Geometry Objects */}
          <Motion.div 
            style={{ x: floatTranslateX, y: floatTranslateY, rotateX: floatRotateX, rotateY: floatRotateY, rotateZ: useTransform(smoothMouseX, [-1,1], [-10, 10]) }}
            className="absolute top-[15%] left-[5%] md:left-[10%] w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/10 border border-white/10 backdrop-blur-3xl shadow-[0_0_50px_rgba(99,102,241,0.2)] flex items-center justify-center z-0"
          >
             <div className="w-1/2 h-1/2 rounded bg-indigo-400/20 animate-pulse"></div>
          </Motion.div>

          <Motion.div 
            style={{ x: invTranslateX, y: invTranslateY, rotateX: floatRotateX, rotateY: floatRotateY, rotateZ: useTransform(smoothMouseX, [-1,1], [15, -15]) }}
            className="absolute bottom-[25%] right-[5%] md:right-[10%] w-20 h-20 md:w-28 md:h-28 rounded-full bg-gradient-to-tr from-cyan-500/20 to-emerald-500/10 border border-white/10 backdrop-blur-3xl shadow-[0_0_50px_rgba(34,211,238,0.2)] flex items-center justify-center z-0"
          >
             <div className="w-1/2 h-1/2 rounded-full border-2 border-cyan-400/30 border-t-cyan-400 animate-spin"></div>
          </Motion.div>

          {/* Central Hero Body */}
          <Motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            style={{ rotateX: useTransform(smoothMouseY, [-1,1], [5, -5]), rotateY: useTransform(smoothMouseX, [-1,1], [-5, 5]) }}
            className="flex flex-col items-center text-center max-w-5xl mx-auto z-10"
          >
            {/* Pill Badge */}
            <Motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-semibold tracking-wide text-slate-300 mb-8 hover:bg-white/10 hover:border-indigo-500/30 transition-all cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.02)] backdrop-blur-md">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              InterviewIQ Engine v2.0 Live
            </Motion.div>

            {/* Massive Headline */}
            <Motion.h1 variants={fadeInUp} className="text-6xl md:text-8xl lg:text-[7rem] font-extrabold tracking-tighter leading-[1.05] mb-8 text-white drop-shadow-2xl">
              Crack the interview <br className="hidden md:block"/>
              <GradientText>without the pressure.</GradientText>
            </Motion.h1>

            {/* Subtext */}
            <Motion.p variants={fadeInUp} className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
              Experience ultra-realistic behavioral and technical mock interviews powered by AI. Get forensic, frame-by-frame analytics of your performance to land your dream job faster.
            </Motion.p>

            {/* CTAs */}
            <Motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
              <button
                onClick={() => {
                  if (!userData) { setShowAuth(true); return; }
                  navigate("/interview");
                }}
                className='group relative h-14 px-8 bg-white text-black font-bold rounded-full hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden flex-shrink-0'
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-white via-slate-200 to-white animate-shimmer bg-[length:200%_100%]"></div>
                <span className="relative z-10 flex items-center gap-2">Start Practicing Free <FiArrowRight className="group-hover:translate-x-1 transition-transform" /></span>
              </button>
              
              <button
                onClick={() => {
                  if (!userData) { setShowAuth(true); return; }
                  navigate("/history");
                }}
                className='h-14 px-8 bg-black/40 text-white border border-white/10 backdrop-blur-md font-semibold rounded-full hover:bg-white/10 hover:border-white/20 transition-all duration-300 flex items-center justify-center gap-2 flex-shrink-0'
              >
                <BsPlayFill className="text-xl text-indigo-400" /> Watch Demo
              </button>
            </Motion.div>
          </Motion.div>

          {/* Massive 3D Dashboard Mockup Reveal */}
          <div ref={targetRef} className="w-full max-w-6xl mx-auto mt-24 perspective-1000 z-10 hidden md:block">
            <Motion.div 
              style={{ 
                scale: heroImageScale, 
                rotateX: heroImageRotateX,
                y: heroImageY,
                opacity: heroOpacity
              }}
              className="w-full aspect-[16/9] bg-[#0A0A0E]/90 backdrop-blur-xl border border-white/10 rounded-[2rem] overflow-hidden relative shadow-[0_40px_100px_-20px_rgba(99,102,241,0.3)] group"
            >
              {/* Dynamic Glow inside mockup */}
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-transparent to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

              {/* Mockup Top Bar */}
              <div className="h-12 border-b border-white/5 bg-black/50 backdrop-blur-md flex items-center px-6 gap-2 relative z-20">
                <div className="flex gap-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-slate-700 hover:bg-red-500 transition-colors cursor-pointer"></div>
                  <div className="w-3.5 h-3.5 rounded-full bg-slate-700 hover:bg-yellow-500 transition-colors cursor-pointer"></div>
                  <div className="w-3.5 h-3.5 rounded-full bg-slate-700 hover:bg-green-500 transition-colors cursor-pointer"></div>
                </div>
                <div className="mx-auto w-64 h-6 rounded-md bg-white/5 border border-white/5 flex items-center justify-center text-[10px] text-slate-500 font-mono tracking-widest hidden sm:flex">
                  dashboard.interviewiq.ai
                </div>
              </div>
              
              {/* Mockup Body Content */}
              <div className="p-8 grid grid-cols-12 h-[calc(100%-3rem)] gap-6 relative z-10">
                 {/* Main Video Area */}
                 <div className="col-span-8 bg-black/40 border border-white/5 rounded-2xl h-full relative overflow-hidden backdrop-blur-sm shadow-inner group/video">
                    <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop" alt="Candidate" className="w-full h-full object-cover opacity-50 group-hover/video:scale-105 transition-transform duration-1000" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20"></div>
                    
                    {/* Fake HUD elements */}
                    <div className="absolute top-4 left-4 inline-flex items-center gap-2 bg-red-500/20 backdrop-blur-md border border-red-500/30 text-red-400 text-xs px-3 py-1.5 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div> Recording
                    </div>
                    
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-full text-sm text-white/90 font-medium whitespace-nowrap shadow-2xl">
                      "So, tell me about a time you had to scale a database under pressure..."
                    </div>

                    <div className="absolute bottom-6 right-6 flex gap-1 h-12 items-end">
                      {[4, 16, 8, 24, 12, 18, 6].map((h, i) => (
                        <div key={i} className="w-1.5 bg-indigo-500 rounded-t-full shadow-[0_0_10px_rgba(99,102,241,0.8)]" style={{ height: `${h}px`, animation: `pulseY 1.${i}s infinite alternate` }}></div>
                      ))}
                    </div>
                 </div>

                 {/* Side Panels */}
                 <div className="col-span-4 flex flex-col gap-6 h-full">
                    <div className="h-1/3 bg-black/40 border border-white/5 rounded-2xl p-6 flex flex-col gap-3 relative overflow-hidden group/card shadow-inner backdrop-blur-md">
                      <div className="absolute -right-4 -top-4 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl group-hover/card:bg-cyan-500/20 transition-colors"></div>
                      <div className="flex items-center gap-2 text-cyan-400 mb-2 font-semibold">
                        <BsLightningChargeFill /> Real-time Analysis
                      </div>
                      <div className="w-3/4 h-2 bg-white/10 rounded-full overflow-hidden">
                        <Motion.div initial={{ width: "0%" }} whileInView={{ width: "85%" }} className="h-full bg-cyan-400/80 shadow-[0_0_10px_rgba(34,211,238,0.8)]"></Motion.div>
                      </div>
                      <div className="w-full h-2 bg-white/10 rounded-full mt-2 overflow-hidden">
                        <Motion.div initial={{ width: "0%" }} whileInView={{ width: "60%" }} className="h-full bg-purple-400/80 shadow-[0_0_10px_rgba(192,132,252,0.8)]"></Motion.div>
                      </div>
                      <div className="w-1/2 h-2 bg-white/10 rounded-full mt-2 overflow-hidden">
                        <Motion.div initial={{ width: "0%" }} whileInView={{ width: "95%" }} className="h-full bg-indigo-400/80 shadow-[0_0_10px_rgba(99,102,241,0.8)]"></Motion.div>
                      </div>
                    </div>

                    <div className="flex-1 bg-gradient-to-br from-indigo-900/20 to-black/60 border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden group/card shadow-inner backdrop-blur-md">
                       <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wMikiLz48L3N2Zz4=')] opacity-50"></div>
                       <div className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-2 z-10">Overall Score</div>
                       <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 z-10 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">98<span className="text-2xl">%</span></div>
                    </div>
                 </div>
              </div>
            </Motion.div>
          </div>
        </section>

        {/* --- SECTION 2: LOGO CLOUD --- */}
        <section className="py-16 bg-black/30 border-b border-white/5 relative z-10 overflow-hidden text-center">
           <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#070709] to-transparent z-10"></div>
           <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#070709] to-transparent z-10"></div>
           
           <div className="text-sm font-semibold tracking-[0.2em] text-slate-600 uppercase mb-8">Candidates have successfully cleared</div>
           <div className="flex whitespace-nowrap w-full">
              <Motion.div 
                animate={{ x: [0, -1500] }}
                transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
                className="flex gap-20 items-center px-10"
              >
                {[...companies, ...companies, ...companies].map((company, index) => (
                  <span key={index} className="text-2xl md:text-3xl font-black text-white/10 hover:text-white/40 hover:scale-110 transition-all duration-300 cursor-default">
                    {company}
                  </span>
                ))}
              </Motion.div>
           </div>
        </section>

        {/* --- SECTION 3: ALTERNATING FEATURES --- */}
        <section className="py-40 px-6 max-w-7xl mx-auto flex flex-col gap-40 relative z-10">
           
           {/* Feature 1 */}
           <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-24">
              <Motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, type: "spring" }}
                className="w-full md:w-1/2"
              >
                 <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/10 flex items-center justify-center text-3xl mb-8 border border-indigo-500/20 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                   <FiCode className="text-indigo-400" />
                 </div>
                 <h2 className="text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight">Ultra-Realistic <br/> <GradientText>Technical Grilling.</GradientText></h2>
                 <p className="text-xl text-slate-400 leading-relaxed mb-8 font-medium">
                   Our AI doesn't just read questions. It understands your code, interrupts if you go down the wrong path, and asks follow-ups based strictly on the architecture you initially propose.
                 </p>
                 <ul className="space-y-5">
                    {["System Design architecture validation.", "Live coding syntax & bug detection.", "Behavioral STAR method enforcement."].map((item, i) => (
                      <li key={i} className="flex items-center gap-4 text-slate-300 font-semibold text-lg">
                        <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                          <BsCheckCircleFill className="text-indigo-400 text-sm" />
                        </div>
                        {item}
                      </li>
                    ))}
                 </ul>
              </Motion.div>

              <Motion.div 
                initial={{ opacity: 0, scale: 0.9, rotateY: 10 }}
                whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, type: "spring" }}
                className="w-full md:w-1/2 perspective-1000"
              >
                 <div className="aspect-square rounded-[2rem] bg-gradient-to-br from-[#12121A] to-black border border-white/5 shadow-2xl relative overflow-hidden flex items-center justify-center p-8 group transition-transform duration-500 hover:rotate-2">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] group-hover:bg-indigo-500/20 transition-colors duration-700"></div>
                    
                    {/* Floating Abstract Element */}
                    <Motion.div 
                      animate={{ y: [-10, 10, -10] }}
                      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                      className="w-full bg-[#15151A]/80 backdrop-blur-2xl rounded-2xl border border-white/10 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative z-10"
                    >
                      <div className="flex gap-5 items-start border-b border-white/5 pb-6 mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 flex items-center justify-center shadow-inner border border-indigo-500/20">
                          <FiCpu className="text-indigo-400 text-2xl" />
                        </div>
                        <div>
                          <div className="text-sm font-bold tracking-wide text-white/90">AI Engineering Manager</div>
                          <div className="text-sm text-slate-400 leading-relaxed mt-2 italic shadow-sm">"That scaling strategy works for reads, but how would you handle the sudden surge in concurrent writes to the main cluster during a viral event?"</div>
                        </div>
                      </div>
                      <div className="flex justify-end pt-2">
                        <div className="bg-emerald-500/10 text-emerald-400 px-4 py-1.5 rounded-lg text-xs font-bold border border-emerald-500/20 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div> Generating followup...
                        </div>
                      </div>
                    </Motion.div>
                 </div>
              </Motion.div>
           </div>

           {/* Feature 2 */}
           <div className="flex flex-col md:flex-row-reverse items-center gap-12 lg:gap-24">
              <Motion.div 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, type: "spring" }}
                className="w-full md:w-1/2"
              >
                 <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-teal-500/10 flex items-center justify-center text-3xl mb-8 border border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                   <BsGraphUpArrow className="text-cyan-400" />
                 </div>
                 <h2 className="text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight">Forensic <br/> <GradientText className="from-cyan-400 via-teal-400 to-emerald-400">Data Analytics.</GradientText></h2>
                 <p className="text-xl text-slate-400 leading-relaxed mb-8 font-medium">
                   Stop guessing why you failed the loop. Instantly download highly detailed PDFs outlining exact weaknesses, architectural slip-ups, and targeted improvement strategies directly mapped to your transcript.
                 </p>
                 <button onClick={() => navigate('/history')} className="text-white hover:text-cyan-400 font-bold flex items-center gap-2 transition-colors text-lg group">
                   View sample PDF report <FiArrowRight className="group-hover:translate-x-2 transition-transform" />
                 </button>
              </Motion.div>

              <Motion.div 
                initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
                whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, type: "spring" }}
                className="w-full md:w-1/2 perspective-1000"
              >
                 <div className="aspect-square rounded-[2rem] bg-gradient-to-bl from-[#12121A] to-black border border-white/5 shadow-2xl relative overflow-hidden flex items-center justify-center p-8 group transition-transform duration-500 hover:-rotate-2">
                     <div className="absolute inset-0 opacity-10 bg-gradient-to-bl from-cyan-500 to-blue-500 group-hover:opacity-20 transition-opacity duration-1000 blur-3xl rounded-full"></div>
                     
                     <div className="w-full h-full relative z-10 flex flex-col gap-6 justify-center">
                        <div className="flex gap-3 w-full h-40 items-end px-4">
                           {[40, 60, 45, 80, 55, 100, 75].map((h, i) => (
                              <Motion.div 
                                key={i} 
                                initial={{ height: 0 }}
                                whileInView={{ height: `${h}%` }}
                                viewport={{ once: true }}
                                transition={{ duration: 1, delay: i * 0.1, type: "spring" }}
                                className={`flex-1 rounded-t-lg shadow-[0_0_15px_rgba(6,182,212,0.3)] ${h === 100 ? "bg-gradient-to-t from-cyan-600/20 to-cyan-400" : "bg-gradient-to-t from-white/5 to-white/20"}`}
                              ></Motion.div>
                           ))}
                        </div>
                        <Motion.div 
                          whileHover={{ scale: 1.05 }}
                          className="bg-[#15151A]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex justify-between items-center shadow-2xl mx-4 cursor-pointer"
                        >
                           <div>
                             <div className="text-xs text-slate-500 uppercase tracking-widest font-black mb-1">Clarity & Pacing</div>
                             <div className="text-2xl font-bold text-white">Top 5% Tier</div>
                           </div>
                           <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                             <BsGraphUpArrow className="text-cyan-400 text-xl" />
                           </div>
                        </Motion.div>
                     </div>
                 </div>
              </Motion.div>
           </div>
        </section>

        {/* --- SECTION 4: HOW IT WORKS --- */}
        <section className="py-32 bg-[#0A0A0E] border-y border-white/5 relative overflow-hidden z-10">
           <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[100px] pointer-events-none"></div>

           <div className="max-w-5xl mx-auto px-6 relative z-10">
              <div className="text-center mb-24">
                 <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 text-white drop-shadow-lg">How <GradientText>InterviewIQ</GradientText> Works</h2>
                 <p className="text-xl text-slate-400 font-medium">Three simple steps to interview mastery.</p>
              </div>

              <div className="relative border-l-2 border-indigo-500/20 ml-6 md:ml-12 pl-10 md:pl-20 space-y-24 py-10">
                 {[
                   { title: "Configure Your Scenario", desc: "Upload your resume, paste the target job description, and select the interview mode (Behavioral or Technical Constraints).", icon: <FiMessageSquare /> },
                   { title: "Enter the Simulator", desc: "Turn on your camera and microphone. The AI engine will initiate a dynamic, context-aware 45-minute strict interview loop.", icon: <BsMic /> },
                   { title: "Review The Tape", desc: "Get a forensic breakdown of your performance. Identify filler words, weak architectures, and bad pacing with our PDF exports.", icon: <BsBarChart /> }
                 ].map((step, index) => (
                    <Motion.div 
                      key={index}
                      initial={{ opacity: 0, x: -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.8, type: "spring", delay: 0.1 }}
                      className="relative group"
                    >
                       {/* Animated Dot on the line */}
                       <div className="absolute -left-[2.85rem] md:-left-[5.35rem] w-4 h-4 rounded-full bg-[#0A0A0E] border-[4px] border-indigo-500 z-20 group-hover:scale-150 group-hover:bg-indigo-400 transition-all duration-300"></div>

                       <div className="absolute -left-[5rem] md:-left-[8.5rem] w-16 h-16 rounded-2xl bg-[#12121A] border border-white/10 flex items-center justify-center text-white z-10 shadow-[0_0_30px_rgba(255,255,255,0.05)] group-hover:bg-indigo-500/10 group-hover:border-indigo-500/30 group-hover:text-indigo-400 transition-all duration-300">
                          <span className="text-2xl">{step.icon}</span>
                       </div>
                       
                       <div className="bg-[#101015]/50 backdrop-blur-md rounded-3xl p-8 border border-white/5 hover:bg-[#15151A]/80 hover:border-white/10 transition-all duration-300 shadow-xl">
                         <h3 className="text-3xl font-bold text-white mb-4">{step.title}</h3>
                         <p className="text-lg text-slate-400 leading-relaxed font-medium">{step.desc}</p>
                       </div>
                    </Motion.div>
                 ))}
              </div>
           </div>
        </section>

        {/* --- SECTION 5: FINAL HUGE CTA --- */}
        <section className="py-40 px-6 relative z-10 overflow-hidden">
           {/* Crazy Background Glows for CTA */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-indigo-500/20 to-fuchsia-500/20 blur-[150px] rounded-full pointer-events-none z-0"></div>

           <Motion.div 
             initial={{ opacity: 0, scale: 0.95, y: 40 }}
             whileInView={{ opacity: 1, scale: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8, type: "spring" }}
             className="max-w-5xl mx-auto rounded-[3rem] bg-black/40 backdrop-blur-2xl border border-white/10 p-16 md:p-24 text-center relative overflow-hidden shadow-[0_0_100px_rgba(99,102,241,0.15)] z-10"
           >
              <div className="absolute -right-20 -top-20 text-[400px] text-white/[0.015] pointer-events-none transform -rotate-12">
                <BsRobot />
              </div>

              <div className="relative z-10">
                <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter drop-shadow-xl">Stop bombing <br/> your <GradientText>loops.</GradientText></h2>
                <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-3xl mx-auto font-medium leading-relaxed">Build confidence and pass the hiring bar with the most highly acclaimed AI engineering manager on the market.</p>
                
                <button
                    onClick={() => {
                      if (!userData) { setShowAuth(true); return; }
                      navigate("/interview");
                    }}
                    className='group relative h-20 px-12 bg-white text-black font-extrabold rounded-full text-xl hover:scale-105 transition-all duration-300 shadow-[0_0_60px_rgba(255,255,255,0.3)] overflow-hidden inline-flex items-center justify-center'
                  >
                   <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-white via-slate-300 to-white animate-shimmer bg-[length:200%_100%] group-hover:opacity-0 transition-opacity"></div>
                   <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 animate-gradient bg-300% opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                   <span className="relative z-10 flex items-center gap-3 group-hover:text-white transition-colors duration-500">
                     Start Your First Session <FiArrowRight className="text-2xl transition-transform group-hover:translate-x-2" />
                   </span>
                </button>
              </div>
           </Motion.div>
        </section>

        {showAuth && <AuthModel onClose={() => setShowAuth(false)} />}
        <Footer />
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .perspective-1000 { perspective: 1000px; }
        @keyframes pulseY {
          0% { transform: scaleY(1); opacity: 0.8; }
          100% { transform: scaleY(1.5); opacity: 1; }
        }
        @keyframes shimmer {
          from { background-position: 200% 0; }
          to { background-position: -200% 0; }
        }
        .animate-shimmer {
          animation: shimmer 4s infinite linear;
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          animation: gradient 6s ease infinite;
        }
        .bg-300\\% {
          background-size: 300% 300%;
        }
      `}} />
    </div>
  );
}

export default Home;
