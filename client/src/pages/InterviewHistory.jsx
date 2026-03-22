import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaHistory, FaRegCalendarAlt } from 'react-icons/fa'
import { BsArrowRight, BsRobot } from 'react-icons/bs'
import { motion } from "motion/react"
import { api } from '../utils/apiClient'

function InterviewHistory() {
    const [interviews, setInterviews] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const getMyInterviews = async () => {
            try {
                const result = await api.get("/api/interview/get-interview")
                setInterviews(result.data)
            } catch (error) {
                console.error("Failed to load interviews", error)
            } finally {
                setLoading(false)
            }
        }
        getMyInterviews()
    }, [])

    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
    }

    return (
        <div className='min-h-screen bg-[#0E0E10] text-white font-sans py-16 px-6 relative overflow-hidden'>
            
            {/* Ambient Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-teal-600/10 blur-[120px] pointer-events-none"></div>

            <div className='w-full max-w-5xl mx-auto z-10 relative'>

                {/* Header */}
                <div className='mb-12 w-full flex flex-col md:flex-row md:items-center gap-6'>
                    <button
                        onClick={() => navigate("/")}
                        className='flex items-center justify-center w-12 h-12 rounded-full bg-white/5 border border-white/10 shadow-lg hover:bg-white/10 hover:border-white/20 transition-all text-slate-300 hover:text-white group shrink-0'
                    >
                        <FaArrowLeft className='group-hover:-translate-x-1 transition-transform' />
                    </button>

                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold tracking-wide text-indigo-300 mb-3">
                            <FaHistory /> Access Archive
                        </div>
                        <h1 className='text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-2'>
                            Interview <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">History.</span>
                        </h1>
                        <p className='text-slate-400 text-lg font-medium'>
                            Review past technical screens, trace your progress, and analyze feedback.
                        </p>
                    </div>
                </div>

                {/* Content Area */}
                {loading ? (
                    <div className="flex flex-col flex-1 items-center justify-center mt-20">
                        <div className="w-10 h-10 border-4 border-white/10 border-t-indigo-500 rounded-full animate-spin"></div>
                        <p className="mt-4 text-slate-400 font-medium">Loading history...</p>
                    </div>
                ) : interviews.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className='bg-[#15151A]/80 backdrop-blur-xl border border-white/10 p-12 rounded-[2rem] shadow-2xl text-center max-w-2xl mx-auto mt-16 flex flex-col items-center'
                    >
                        <div className="w-20 h-20 bg-indigo-500/10 border border-indigo-500/20 rounded-full flex items-center justify-center mb-6 shadow-inner">
                            <BsRobot className="text-indigo-400 text-3xl"/>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-3">No interviews found</h2>
                        <p className='text-slate-400 mb-8 leading-relaxed font-medium'>
                            You haven't completed any mock interviews yet. Start your first session to track architectures, syntax mastery, and speaking pace.
                        </p>
                        <button 
                            onClick={() => navigate('/interview')}
                            className="bg-white text-black px-8 py-3.5 rounded-full font-bold shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-105 transition-transform flex items-center gap-2"
                        >
                            Start an Interview <BsArrowRight />
                        </button>
                    </motion.div>
                ) : (
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className='grid gap-5'
                    >
                        {interviews.map((item, index) => {
                            const isCompleted = item.status === "completed";
                            return (
                                <motion.div 
                                    variants={itemVariants}
                                    key={index}
                                    onClick={() => navigate(`/report/${item._id}`)}
                                    className='bg-white/5 backdrop-blur-md p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:bg-white/10 transition-all duration-300 cursor-pointer border border-white/10 group flex flex-col sm:flex-row sm:items-center justify-between gap-6'
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                                                {item.role}
                                            </h3>
                                            <span className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                                                isCompleted 
                                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                                                : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                            }`}>
                                                {item.status}
                                            </span>
                                        </div>

                                        <p className="text-slate-300 font-medium text-sm flex items-center gap-2">
                                            {item.experience} Level &bull; {item.mode} Mode
                                        </p>

                                        <p className="text-xs text-slate-500 mt-3 font-semibold flex items-center gap-1.5 uppercase tracking-wide">
                                            <FaRegCalendarAlt />
                                            {new Date(item.createdAt).toLocaleDateString(undefined, {
                                                year: 'numeric', month: 'short', day: 'numeric'
                                            })}
                                        </p>
                                    </div>

                                    <div className='flex items-center gap-8 pl-4 sm:border-l border-white/10'>
                                        {/* SCORE */}
                                        <div className="text-right flex flex-col items-end">
                                            <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400">
                                                {item.finalScore || 0}<span className="text-xl text-slate-500">/10</span>
                                            </div>
                                            <p className="text-[11px] text-slate-400 uppercase tracking-widest font-bold mt-1">
                                                Overall Score
                                            </p>
                                        </div>

                                        <div className="hidden sm:flex w-10 h-10 rounded-full bg-white/5 items-center justify-center text-slate-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                                            <BsArrowRight />
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </motion.div>
                )}
            </div>
        </div>
    )
}

export default InterviewHistory
