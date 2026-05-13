import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import { motion as Motion } from 'motion/react';
import { api } from '../utils/apiClient';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';

function Success() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchLatestUser = async () => {
      try {
        const result = await api.get("/api/user/current-user");
        dispatch(setUserData(result.data));
      } catch (error) {
        console.error("Failed to fetch updated user:", error);
      }
    };
    
    // Slight delay to ensure Stripe webhook completes its database update before fetching
    setTimeout(fetchLatestUser, 2000);
  }, [dispatch]);

  return (
    <div className='min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center p-6'>
      <Motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className='bg-white p-10 rounded-3xl shadow-2xl border border-emerald-100 max-w-md w-full text-center'
      >
        <Motion.div
           initial={{ scale: 0 }}
           animate={{ scale: 1 }}
           transition={{ delay: 0.2, type: "spring" }}
           className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <FaCheckCircle className="text-emerald-500 text-4xl" />
        </Motion.div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Payment Successful!</h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Your credits have been securely updated via Stripe. Thank you for your purchase!
        </p>

        <button 
          onClick={() => navigate("/")}
          className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition shadow-[0_4px_14px_0_rgba(16,185,129,0.39)]"
        >
          Return Home
        </button>
      </Motion.div>
    </div>
  );
}

export default Success;
