import React, { useState } from 'react'
import { motion as Motion, AnimatePresence } from "motion/react"
import {
    FaUserTie,
    FaBriefcase,
    FaFileUpload,
    FaMicrophoneAlt,
    FaChartLine,
    FaCheckCircle,
    FaFileAlt,
    FaExclamationTriangle
} from "react-icons/fa";
import { BsRobot, BsLightningChargeFill, BsStars } from 'react-icons/bs'
import { useDispatch, useSelector } from 'react-redux';
import { setUserData } from '../redux/userSlice';
import { api } from '../utils/apiClient';

function Step1SetUp({ onStart }) {
    const { userData } = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const [role, setRole] = useState("");
    const [experience, setExperience] = useState("");
    const [mode, setMode] = useState("Technical");
    const [difficulty, setDifficulty] = useState("Intermediate");
    const [practiceMode, setPracticeMode] = useState(false);
    const preferredLanguage = "javascript";
    const [template, setTemplate] = useState("General");
    // New Feature V2: Personality Customization
    const [personality, setPersonality] = useState("Professional and Balanced");
    // New Feature V2: JD Gap Analysis
    const [jobDescription, setJobDescription] = useState("");
    const [gapAnalysis, setGapAnalysis] = useState(null);
    const [analyzingGap, setAnalyzingGap] = useState(false);

    const [resumeFile, setResumeFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [projects, setProjects] = useState([]);
    const [skills, setSkills] = useState([]);
    const [resumeText, setResumeText] = useState("");
    const [analysisDone, setAnalysisDone] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);

    const handleUploadResume = async () => {
        if (!resumeFile || analyzing) return;
        setAnalyzing(true)

        const formdata = new FormData()
        formdata.append("resume", resumeFile)

        try {
            const result = await api.post("/api/interview/resume", formdata, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
            setRole(result.data.role || "");
            setExperience(result.data.experience || "");
            setProjects(result.data.projects || []);
            setSkills(result.data.skills || []);
            setResumeText(result.data.resumeText || "");
            // Auto trigger gap analysis if JD is already pasted
            setAnalysisDone(true);
            setAnalyzing(false);
        } catch (error) {
            console.error(error)
            alert("Failed to analyze resume. Please try again or type manually.");
            setAnalyzing(false);
        }
    }

    const handleGapAnalysis = async () => {
        if (!resumeText || !jobDescription || analyzingGap) return;
        setAnalyzingGap(true);
        try {
            const result = await api.post("/api/interview/gap-analysis", { resumeText, jobDescription });
            setGapAnalysis(result.data);
        } catch (error) {
            console.error(error);
            alert("Failed to run Gap Analysis. Ensure your Job Description isn't excessively long.");
        } finally {
            setAnalyzingGap(false);
        }
    };

    const handleStart = async () => {
        setLoading(true)
        try {
            const result = await api.post("/api/interview/generate-questions", {
                role,
                experience,
                mode,
                difficulty,
                practiceMode,
                preferredLanguage,
                template,
                jobDescription,
                resumeText,
                projects,
                skills,
                personality
            })
            if (userData && typeof result.data.creditsLeft === 'number') {
                dispatch(setUserData({ ...userData, credits: result.data.creditsLeft }))
            }
            setLoading(false)
            onStart(result.data)
        } catch (error) {
            console.error(error)
            setLoading(false)
        }
    }

    return (
        <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className='min-h-screen flex items-center justify-center p-6 relative overflow-hidden selection:bg-indigo-500/30'
        >
            {/* Ambient Glowing Orbs */}
            <div className="fixed top-0 right-[10%] w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none"></div>
            <div className="fixed bottom-0 left-[-10%] w-[600px] h-[600px] rounded-full bg-cyan-600/10 blur-[150px] pointer-events-none"></div>

            <div className='w-full max-w-7xl z-10 grid lg:grid-cols-12 gap-8 lg:gap-12 items-start py-8'>

                {/* LEFT HERO SECTION */}
                <Motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.7, type: "spring" }}
                    className='flex flex-col justify-center lg:col-span-5 sticky top-12'
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold tracking-wide text-indigo-400 mb-6 w-fit shadow-inner">
                        <BsRobot /> AI Interview Engine
                    </div>

                    <h2 className="text-4xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight leading-tight">
                        Configure <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">Context.</span>
                    </h2>

                    <p className="text-slate-400 text-lg font-medium leading-relaxed mb-10 max-w-md">
                        Upload your resume and paste a target job description to dynamically tailor the AI's technical evaluation to your exact background.
                    </p>

                    <div className='space-y-4'>
                        {[
                            { icon: <FaUserTie />, text: "Context-Aware Grilling" },
                            { icon: <BsStars />, text: "V2: JD Gap Analysis" },
                            { icon: <FaChartLine />, text: "Forensic Post-Analysis" },
                        ].map((item, index) => (
                            <Motion.div key={index}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 + index * 0.15 }}
                                className='flex items-center space-x-4 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md max-w-sm hover:bg-white/10 transition-colors'
                            >
                                <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center shadow-inner">
                                    {item.icon}
                                </div>
                                <span className='text-slate-200 font-semibold tracking-wide'>{item.text}</span>
                            </Motion.div>
                        ))}
                    </div>
                </Motion.div>

                {/* RIGHT CONTROL PANEL */}
                <Motion.div
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.7, type: "spring", delay: 0.1 }}
                    className="p-8 bg-[#15151A]/80 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-white/10 relative lg:col-span-7"
                >
                    <div className="flex items-center justify-between mb-8">
                        <h2 className='text-3xl font-bold text-white tracking-tight'>
                            Session Setup
                        </h2>
                        <div className="w-12 h-1 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full"></div>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
                        {/* Role Input */}
                        <div className='relative group'>
                            <div className="absolute top-4 left-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                                <FaUserTie />
                            </div>
                            <input 
                                type='text' 
                                placeholder='Target Role (e.g. Frontend)'
                                className='w-full pl-12 pr-4 py-4 bg-black/40 border border-white/10 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-white placeholder-slate-500 outline-none transition-all shadow-inner font-medium'
                                onChange={(e) => setRole(e.target.value)} 
                                value={role} 
                            />
                        </div>

                        {/* Experience Input */}
                        <div className='relative group'>
                            <div className="absolute top-4 left-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                                <FaBriefcase />
                            </div>
                            <input 
                                type='text' 
                                placeholder='Experience (e.g. 2 years)'
                                className='w-full pl-12 pr-4 py-4 bg-black/40 border border-white/10 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-white placeholder-slate-500 outline-none transition-all shadow-inner font-medium'
                                onChange={(e) => setExperience(e.target.value)} 
                                value={experience} 
                            />
                        </div>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        {/* Mode Select */}
                        <div className="relative group">
                            <select 
                                value={mode}
                                onChange={(e) => setMode(e.target.value)}
                                className='w-full py-4 px-4 bg-black/40 border border-white/10 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-white outline-none transition-all shadow-inner font-medium appearance-none cursor-pointer'
                            >
                                <option value="Technical" className="bg-[#15151A]">Technical Deep-Dive</option>
                                <option value="Behavioral" className="bg-[#15151A]">Behavioral & HR</option>
                            </select>
                            <div className="absolute top-1/2 right-6 -translate-y-1/2 pointer-events-none text-slate-500">
                                ▼
                            </div>
                        </div>

                        {/* Difficulty Select */}
                        <div className="relative group">
                            <select 
                                value={difficulty}
                                onChange={(e) => setDifficulty(e.target.value)}
                                className='w-full py-4 px-4 bg-black/40 border border-white/10 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-white outline-none transition-all shadow-inner font-medium appearance-none cursor-pointer'
                            >
                                <option value="Beginner" className="bg-[#15151A]">Beginner</option>
                                <option value="Intermediate" className="bg-[#15151A]">Intermediate</option>
                                <option value="Expert" className="bg-[#15151A]">Expert</option>
                            </select>
                            <div className="absolute top-1/2 right-6 -translate-y-1/2 pointer-events-none text-slate-500">
                                ▼
                            </div>
                        </div>



                        {/* Interview Template Select */}
                        <div className="relative group md:col-span-2">
                            <select 
                                value={template}
                                onChange={(e) => setTemplate(e.target.value)}
                                className='w-full py-4 px-4 bg-black/40 border border-white/10 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-white outline-none transition-all shadow-inner font-medium appearance-none cursor-pointer'
                            >
                                <option value="General" className="bg-[#15151A]">General</option>
                                <option value="Frontend" className="bg-[#15151A]">Frontend / React</option>
                                <option value="Backend" className="bg-[#15151A]">Backend / Node</option>
                                <option value="Data Science" className="bg-[#15151A]">Data Science / ML</option>
                                <option value="Systems" className="bg-[#15151A]">Systems / Algorithms</option>
                            </select>
                            <div className="absolute top-1/2 right-6 -translate-y-1/2 pointer-events-none text-slate-500">
                                ▼
                            </div>
                        </div>
                    </div>

                    <div className='flex flex-col gap-4'>
                        <div className='relative group'>
                            <select 
                                value={personality}
                                onChange={(e) => setPersonality(e.target.value)}
                                className='w-full py-4 px-4 bg-black/40 border border-white/10 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-white outline-none transition-all shadow-inner font-medium appearance-none cursor-pointer'
                            >
                                <option value="Professional and Balanced" className="bg-[#15151A]">Balanced (Standard)</option>
                                <option value="Friendly and Encouraging" className="bg-[#15151A]">Encouraging & Helpful</option>
                                <option value="Aggressive and Detailed" className="bg-[#15151A]">Aggressive & Critical</option>
                                <option value="Socratic and Pedantic" className="bg-[#15151A]">Socratic (Asking why constantly)</option>
                            </select>
                            <div className="absolute top-1/2 right-6 -translate-y-1/2 pointer-events-none text-slate-500">
                                ▼
                            </div>
                        </div>

                        <button
                          onClick={() => setPracticeMode(!practiceMode)}
                          type="button"
                          className={`w-full rounded-2xl py-4 text-left border transition-all ${practiceMode ? 'border-emerald-400 bg-emerald-500/10 text-emerald-200' : 'border-white/10 bg-black/40 text-slate-200 hover:border-indigo-500/50 hover:bg-indigo-500/10'}`}
                        >
                          <div className='flex items-center justify-between'>
                            <div>
                              <p className='font-semibold'>Practice Mode</p>
                              <p className='text-xs text-slate-400'>No credits consumed, ideal for rehearsal and code-focused questions.</p>
                            </div>
                            <span className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-[10px] font-bold uppercase ${practiceMode ? 'bg-emerald-400 text-black' : 'bg-slate-700 text-slate-300'}`}>
                              {practiceMode ? 'Enabled' : 'Off'}
                            </span>
                          </div>
                        </button>
                    </div>

                        {/* Job Description (V2 Feature) */}
                        <div className='relative group'>
                            <div className="absolute top-4 left-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                                <FaFileAlt />
                            </div>
                            <textarea 
                                placeholder='Paste Target Job Description (Optional - Unlocks AI Gap Analysis)'
                                className='w-full pl-12 pr-4 py-4 bg-black/40 border border-white/10 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-white placeholder-slate-500 outline-none transition-all shadow-inner font-medium min-h-[100px] resize-y custom-scrollbar'
                                onChange={(e) => setJobDescription(e.target.value)} 
                                value={jobDescription} 
                            />
                        </div>

                        <AnimatePresence mode="popLayout">
                            {!analysisDone ? (
                                <Motion.div
                                    key="upload"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0, scale: 0.95 }}
                                    className='relative overflow-hidden'
                                >
                                    <div
                                        onClick={() => document.getElementById("resumeUpload").click()}
                                        className='relative border-2 border-dashed border-indigo-500/30 rounded-2xl p-8 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-500/5 transition-all group overflow-hidden'
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        
                                        <FaFileUpload className='text-4xl mx-auto text-indigo-500 mb-4 group-hover:scale-110 transition-transform' />
                                        
                                        <input 
                                            type="file"
                                            accept="application/pdf"
                                            id="resumeUpload"
                                            className='hidden'
                                            onChange={(e) => setResumeFile(e.target.files[0])} 
                                        />

                                        <p className='text-slate-300 font-semibold mb-1'>
                                            {resumeFile ? resumeFile.name : "Smart Injection (Optional)"}
                                        </p>
                                        {!resumeFile && <p className="text-xs text-slate-500">Upload your PDF resume to auto-fill context</p>}
                                    </div>

                                    {resumeFile && (
                                        <Motion.button
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleUploadResume();
                                            }}
                                            disabled={analyzing}
                                            className='mt-4 w-full bg-slate-800 text-white px-5 py-3.5 rounded-xl hover:bg-slate-700 transition-colors font-bold disabled:opacity-50 flex items-center justify-center gap-2 border border-white/10 shadow-lg'
                                        >
                                            {analyzing ? (
                                                <>
                                                 <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                                 Parsing Document...
                                                </>
                                            ) : (
                                                <>
                                                    <BsLightningChargeFill className="text-yellow-400" /> Analyze Resume Context
                                                </>
                                            )}
                                        </Motion.button>
                                    )}
                                </Motion.div>
                            ) : (
                                <Motion.div
                                    key="analysis"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className='bg-black/20 border border-emerald-500/20 rounded-2xl p-6 shadow-inner space-y-4'
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                                                <FaCheckCircle />
                                            </div>
                                            <h3 className='text-lg font-bold text-white'>
                                                Context Injected
                                            </h3>
                                        </div>
                                        
                                        {jobDescription && !gapAnalysis && (
                                            <button 
                                                onClick={handleGapAnalysis}
                                                disabled={analyzingGap}
                                                className="flex items-center gap-2 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 px-4 py-2 rounded-lg text-xs font-bold border border-indigo-500/30 transition-colors disabled:opacity-50"
                                            >
                                                {analyzingGap ? "Scanning..." : <><BsStars /> GAP ANALYSIS</>}
                                            </button>
                                        )}
                                    </div>

                                    {/* GAP ANALYSIS RESULTS BLOCK */}
                                    {gapAnalysis && (
                                        <Motion.div 
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            className="mt-4 p-5 bg-[#1A1A1E] border border-white/10 rounded-xl mb-4 relative overflow-hidden"
                                        >
                                            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-rose-500"></div>
                                            <div className="flex justify-between items-center mb-4">
                                                <h4 className="text-sm font-bold text-slate-200">AI Compatibility Scanner</h4>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-slate-400 font-semibold">Match:</span>
                                                    <span className={`text-sm font-bold px-2.5 py-1 rounded bg-black/50 ${gapAnalysis.matchPercentage > 75 ? "text-emerald-400" : gapAnalysis.matchPercentage > 50 ? "text-yellow-400" : "text-red-400"}`}>{gapAnalysis.matchPercentage}%</span>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <p className='text-[10px] uppercase font-bold text-emerald-400 mb-1.5'>Strengths</p>
                                                    <ul className="text-xs text-slate-300 space-y-1 pl-3 list-disc">
                                                        {gapAnalysis.strengths?.map((s, i) => <li key={i}>{s}</li>)}
                                                    </ul>
                                                </div>
                                                <div>
                                                    <p className='text-[10px] uppercase font-bold text-rose-400 mb-1.5 flex items-center gap-1'><FaExclamationTriangle /> Red Flags / Missing</p>
                                                    <ul className="text-xs text-slate-300 space-y-1 pl-3 list-disc">
                                                        {gapAnalysis.redFlags?.map((r, i) => <li key={i}>{r}</li>)}
                                                    </ul>
                                                </div>
                                            </div>
                                        </Motion.div>
                                    )}

                                    {skills.length > 0 && (
                                        <div className="pt-2 border-t border-white/5">
                                            <p className='text-xs uppercase tracking-widest font-bold text-slate-500 mb-2 mt-2'>
                                                Detected Frameworks
                                            </p>
                                            <div className='flex flex-wrap gap-2'>
                                                {skills.map((s, i) => (
                                                    <span key={i} className='bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-xs font-bold'>
                                                        {s}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </Motion.div>
                            )}
                        </AnimatePresence>

                        {/* Start Action Button */}
                        <Motion.button
                            onClick={handleStart}
                            disabled={!role || !experience || loading}
                            whileHover={!(!role || !experience || loading) ? { scale: 1.02 } : {}}
                            whileTap={!(!role || !experience || loading) ? { scale: 0.98 } : {}}
                            className='w-full mt-4 disabled:bg-slate-800 disabled:text-slate-500 disabled:border-slate-700 bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-4 flex items-center justify-center rounded-2xl text-lg font-extrabold transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:shadow-none border border-emerald-400/50 hover:brightness-110 group overflow-hidden relative'
                        >
                            {/* Inner Shimmer overlay */}
                            {(!(!role || !experience || loading)) && (
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none"></div>
                            )}

                            {loading ? (
                                <span className="flex items-center gap-3">
                                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                    Initializing Engine...
                                </span>
                            ) : practiceMode ? "Start Practice Session" : "Commence Interview"}
                        </Motion.button>
                </Motion.div>
            </div>
            
            <style dangerouslySetInnerHTML={{__html: `
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.3); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(99, 102, 241, 0.5); }
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
            `}} />
        </Motion.div>
    )
}

export default Step1SetUp
