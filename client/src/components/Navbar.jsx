import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from "motion/react"
import { BsRobot, BsCoin } from "react-icons/bs";
import { HiOutlineLogout } from "react-icons/hi";
import { FaUserAstronaut } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { setUserData } from '../redux/userSlice';
import AuthModel from './AuthModel';
import { api } from '../utils/apiClient';

function Navbar() {
    const {userData} = useSelector((state)=>state.user)
    const [showCreditPopup,setShowCreditPopup] = useState(false)
    const [showUserPopup,setShowUserPopup] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [showAuth, setShowAuth] = useState(false);

    const handleLogout = async () => {
        try {
            await api.get("/api/auth/logout")
            dispatch(setUserData(null))
            setShowCreditPopup(false)
            setShowUserPopup(false)
            navigate("/")

        } catch (error) {
            console.log(error)
        }
    }

  return (
    <div className='w-full flex justify-center px-6 pt-6 fixed top-0 left-0 right-0 z-50 pointer-events-none'>
        {/* Pointer events bound to children to allow clicking through the invisible fixed full-width wrapper */}
        <motion.div 
        initial={{opacity:0 , y:-40}}
        animate={{opacity:1 , y:0}}
        transition={{duration: 0.5, type: "spring", stiffness: 100}}
        className='w-full max-w-6xl bg-[#101015]/80 backdrop-blur-xl rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-white/10 px-6 py-3 flex justify-between items-center relative pointer-events-auto'>
            
            <div onClick={() => navigate("/")} className='flex items-center gap-3 cursor-pointer group'>
                <div className='bg-indigo-500/20 border border-indigo-500/20 text-indigo-400 p-2.5 rounded-xl group-hover:bg-indigo-500/30 transition-colors shadow-inner'>
                    <BsRobot size={20}/>
                </div>
                <h1 className='font-bold hidden md:block text-xl text-white tracking-tight'>Interview<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">IQ.AI</span></h1>
            </div>

            <div className='flex items-center gap-4 relative'>
                {userData ? (
                    <>
                        {/* Credits Pill */}
                        <div className='relative'>
                            <button onClick={()=>{
                                setShowCreditPopup(!showCreditPopup);
                                setShowUserPopup(false)
                            }} className='flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-sm font-bold text-white hover:bg-white/10 hover:border-indigo-500/30 transition-all shadow-inner'>
                                <BsCoin className="text-yellow-400" size={18}/>
                                {userData?.credits || 0}
                            </button>

                            {showCreditPopup && (
                                <div className='absolute right-0 mt-3 w-64 bg-[#15151A]/95 backdrop-blur-xl shadow-2xl border border-white/10 rounded-2xl p-5 z-50 text-white'>
                                    <p className='text-sm text-slate-400 mb-4 font-medium'>Need more credits to continue interviews?</p>
                                    <button onClick={()=>navigate("/pricing")} className='w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-2.5 rounded-xl text-sm font-bold shadow-[0_0_15px_rgba(99,102,241,0.4)] hover:scale-[1.02] transition-transform'>Buy more credits</button>
                                </div>
                            )}
                        </div>

                        {/* Gamification Streak Pill */}
                        <div className='relative group cursor-default'>
                            <div className='flex items-center gap-1.5 bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 px-3.5 py-2 rounded-full text-sm font-bold text-orange-400 hover:bg-orange-500/20 transition-all shadow-inner'>
                                <span className={userData?.currentStreak > 0 ? "animate-pulse" : "grayscale opacity-50"}>🔥</span>
                                <span className={userData?.currentStreak > 0 ? "text-orange-400" : "text-slate-500"}>{userData?.currentStreak || 0}</span>
                            </div>
                            
                            {/* Hover Tooltip */}
                            <div className='absolute top-full right-0 lg:left-1/2 lg:-translate-x-1/2 mt-3 w-48 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-[#1A1A1E] border border-white/10 rounded-xl p-3 shadow-[0_20px_40px_rgba(0,0,0,0.5)] z-50 text-center scale-95 group-hover:scale-100 duration-200'>
                                <p className='text-xs text-white font-bold tracking-wide uppercase mb-1'>Current Streak</p>
                                <p className='text-[10px] text-slate-400 leading-relaxed font-medium'>Complete a mock interview tomorrow to keep the flame alive!</p>
                            </div>
                        </div>

                        {/* User Avatar */}
                        <div className='relative'>
                            <button
                            onClick={()=>{
                                setShowUserPopup(!showUserPopup);
                                setShowCreditPopup(false)
                            }} className='w-10 h-10 bg-gradient-to-br from-indigo-500 to-cyan-500 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-inner hover:scale-105 transition-transform border border-white/10'>
                                {userData?.name.slice(0,1).toUpperCase()}
                            </button>

                            {showUserPopup && (
                                <div className='absolute right-0 mt-3 w-56 bg-[#15151A]/95 backdrop-blur-xl shadow-2xl border border-white/10 rounded-2xl p-4 z-50 text-left'>
                                    <div className="border-b border-white/10 pb-3 mb-3">
                                        <p className='text-sm text-slate-400'>Signed in as</p>
                                        <p className='text-md text-white font-bold truncate'>{userData?.name}</p>
                                    </div>

                                    <div className="space-y-1">
                                        <button onClick={()=>navigate("/history")} className='w-full text-left text-sm py-2 px-3 rounded-lg hover:bg-white/5 text-slate-300 hover:text-white transition-colors font-medium'>Interview History</button>
                                        <button onClick={()=>navigate("/analytics")} className='w-full text-left text-sm py-2 px-3 rounded-lg hover:bg-indigo-500/10 text-slate-300 hover:text-indigo-400 transition-colors font-medium'>Performance Analytics</button>
                                        <button onClick={handleLogout} className='w-full text-left text-sm py-2 px-3 rounded-lg hover:bg-red-500/10 flex items-center gap-2 text-red-400 transition-colors font-medium'>
                                            <HiOutlineLogout size={16}/>
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    /* Explicit Sign In Button when logged out */
                    <button 
                        onClick={() => setShowAuth(true)} 
                        className="bg-white text-black px-6 py-2.5 rounded-full font-extrabold text-sm hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                    >
                        Sign In / Sign Up
                    </button>
                )}
            </div>
        </motion.div>

        {showAuth && <div className="pointer-events-auto"><AuthModel onClose={()=>setShowAuth(false)}/></div>}
      
    </div>
  )
}

export default Navbar
