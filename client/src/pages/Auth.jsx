import React, { useState } from 'react'
import { BsRobot } from "react-icons/bs";
import { IoSparkles } from "react-icons/io5";
import { motion, AnimatePresence } from "motion/react"
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../utils/firebase';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';
import { api } from '../utils/apiClient';
import { useNavigate } from 'react-router-dom';

function Auth({isModel = false}) {
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleGoogleAuth = async () => {
        try {
            const response = await signInWithPopup(auth,provider)
            let User = response.user
            let name = User.displayName
            let email = User.email
            const result = await api.post("/api/auth/google", { name, email })
            dispatch(setUserData(result.data))
            if(!isModel) navigate("/")
        } catch (error) {
            console.log(error)
            dispatch(setUserData(null))
        }
    }

    const handleEmailAuth = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
            const payload = isLogin 
                ? { email: formData.email, password: formData.password }
                : formData;

            const result = await api.post(endpoint, payload);
            dispatch(setUserData(result.data));
            if(!isModel) navigate("/")
        } catch (error) {
            console.error(error);
            setError(error.response?.data?.message || "An error occurred during authentication.");
        } finally {
            setLoading(false);
        }
    }

  return (
    <div className={`
      w-full 
      ${isModel ? "py-2 flex justify-center" : "min-h-screen bg-[#f3f3f3] flex items-center justify-center px-6 py-20"}
    `}>
        <motion.div 
        initial={{opacity:0 , y:-40}} 
        animate={{opacity:1 , y:0}} 
        transition={{duration:0.6}}
        className={`
        w-full overflow-hidden
        ${isModel ? "max-w-sm p-6 rounded-2xl" : "max-w-lg p-10 md:p-12 rounded-[32px]"}
        bg-white shadow-2xl border border-gray-200
      `}>
            <div className={`flex items-center justify-center gap-3 ${isModel ? "mb-4" : "mb-6"}`}>
                <div className='bg-black text-white p-2 rounded-lg'>
                    <BsRobot size={isModel ? 16 : 18}/>
                </div>
                <h2 className='font-semibold text-lg'>InterviewIQ.AI</h2>
            </div>

            <h1 className={`${isModel ? "text-xl" : "text-2xl md:text-3xl"} font-semibold text-center leading-snug mb-2`}>
                {isLogin ? "Welcome back to" : "Join"} <br/>
                <span className={`bg-green-100 mt-2 text-green-600 px-3 py-1 rounded-full inline-flex items-center gap-2 ${isModel ? "text-sm" : ""}`}>
                    <IoSparkles size={16}/>
                    AI Smart Interview
                </span>
            </h1>

            <p className={`text-gray-500 text-center leading-relaxed mb-6 ${isModel ? "text-xs" : "text-sm md:text-base"}`}>
                {isLogin 
                    ? "Sign in to continue your mock interviews and track progress."
                    : "Sign up to start AI-powered mock interviews and unlock insights."}
            </p>

            {error && (
                <div className={`mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-center border border-red-100 ${isModel ? "text-xs" : "text-sm"}`}>
                    {error}
                </div>
            )}

            <form onSubmit={handleEmailAuth} className={`space-y-4 ${isModel ? "mb-4" : "mb-6"}`}>
                <AnimatePresence>
                    {!isLogin && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                        >
                            <label className={`block font-medium text-gray-700 mb-1 ${isModel ? "text-xs" : "text-sm"}`}>Full Name</label>
                            <input 
                                type="text" 
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="John Doe"
                                className={`w-full ${isModel ? "px-3 py-2 text-sm" : "px-4 py-3"} rounded-xl border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all`}
                                required={!isLogin}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                <div>
                    <label className={`block font-medium text-gray-700 mb-1 ${isModel ? "text-xs" : "text-sm"}`}>Email Address</label>
                    <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className={`w-full ${isModel ? "px-3 py-2 text-sm" : "px-4 py-3"} rounded-xl border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all`}
                        required
                    />
                </div>

                <div>
                    <label className={`block font-medium text-gray-700 mb-1 ${isModel ? "text-xs" : "text-sm"}`}>Password</label>
                    <input 
                        type="password" 
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className={`w-full ${isModel ? "px-3 py-2 text-sm" : "px-4 py-3"} rounded-xl border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all`}
                        required
                    />
                </div>

                <motion.button 
                    type="submit"
                    disabled={loading}
                    whileHover={{opacity:0.9 , scale:1.02}}
                    whileTap={{opacity:1 , scale:0.98}}
                    className={`w-full bg-black text-white rounded-xl shadow-md font-medium mt-2 disabled:opacity-70 flex justify-center items-center ${isModel ? "py-2.5 text-sm h-[40px]" : "py-3 h-[52px]"}`}
                >
                    {loading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        isLogin ? 'Sign In' : 'Create Account'
                    )}
                </motion.button>
            </form>

            <div className={`relative flex items-center ${isModel ? "mb-4 py-1" : "mb-6 py-2"}`}>
                <div className="flex-grow border-t border-gray-200"></div>
                <span className={`flex-shrink-0 mx-4 text-gray-400 ${isModel ? "text-xs" : "text-sm"}`}>Or continue with</span>
                <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <motion.button 
            type="button"
            onClick={handleGoogleAuth}
            whileHover={{backgroundColor: '#f9fafb'}}
            whileTap={{scale:0.98}}
            className={`w-full flex items-center justify-center gap-3 border border-gray-300 text-gray-700 rounded-xl shadow-sm hover:shadow transition-all bg-white font-medium ${isModel ? "py-2.5 text-sm h-[40px]" : "py-3 h-[52px]"}`}>
                <FcGoogle size={isModel ? 18 : 22}/>
                Google
            </motion.button>

            <div className="mt-8 text-center text-sm text-gray-600">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button 
                    type="button" 
                    onClick={() => {
                        setIsLogin(!isLogin);
                        setError(null);
                    }} 
                    className="text-black font-semibold hover:underline"
                >
                    {isLogin ? 'Sign up' : 'Log in'}
                </button>
            </div>
        </motion.div>
    </div>
  )
}

export default Auth
