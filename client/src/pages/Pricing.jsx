import React, { useState } from 'react'
import { FaArrowLeft, FaCheckCircle, FaStar } from 'react-icons/fa'
import { BsLightningChargeFill } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom'
import { motion as Motion } from "motion/react";
import { api } from '../utils/apiClient';

function Pricing() {
  const navigate = useNavigate()
  const [selectedPlan, setSelectedPlan] = useState("pro"); // Default to Pro visually
  const [loadingPlan, setLoadingPlan] = useState(null);

  const plans = [
    {
      id: "free",
      name: "Free",
      price: "₹0",
      credits: 1000,
      description: "Perfect for beginners starting interview preparation.",
      features: [
        "1000 AI Interview Credits",
        "Basic Performance Report",
        "Voice Interview Access",
        "Limited History Tracking",
      ],
      default: true,
    },
    {
      id: "basic",
      name: "Starter Pack",
      price: "₹100",
      credits: 150,
      description: "Great for focused practice and skill improvement.",
      features: [
        "150 AI Interview Credits",
        "Detailed Feedback",
        "Performance Analytics",
        "Full Interview History",
      ],
    },
    {
      id: "pro",
      name: "Pro Pack",
      price: "₹500",
      credits: 650,
      description: "Best value for serious job preparation.",
      features: [
        "650 AI Interview Credits",
        "Advanced AI Feedback",
        "Skill Trend Analysis",
        "Priority AI Processing",
      ],
      badge: "Best Value",
    },
  ];

  const handlePayment = async (plan) => {
    try {
      setLoadingPlan(plan.id)

      const amount =  
      plan.id === "basic" ? 100 :
      plan.id === "pro" ? 500 : 0;

      const result = await api.post("/api/payment/create-checkout-session", {
        planId: plan.id,
        amount: amount,
        credits: plan.credits,
      })
      
      if (result.data.url) {
         window.location.assign(result.data.url);
      }

    } catch (error) {
     console.error("Payment initialization failed:", error)
     setLoadingPlan(null);
    }
  }

  return (
    <div className='min-h-screen bg-[#0E0E10] text-white font-sans py-16 px-6 relative overflow-hidden flex flex-col items-center'>
      
      {/* Background Ambient Glows */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-[100%] bg-gradient-to-b from-[#6366F1]/20 to-transparent blur-[80px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-[-10%] w-[600px] h-[400px] rounded-[100%] bg-gradient-to-t from-[#10B981]/10 to-transparent blur-[100px] pointer-events-none"></div>

      <div className='w-full max-w-6xl z-10 mx-auto mb-14 mt-4'>
        <button 
          onClick={() => navigate("/")} 
          className='mb-8 flex items-center justify-center w-12 h-12 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all shadow-lg backdrop-blur-md text-slate-300 hover:text-white group'
        >
          <FaArrowLeft className='group-hover:-translate-x-1 transition-transform' />
        </button>

        <div className="text-center w-full max-w-3xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-semibold tracking-wide text-indigo-300 mb-6">
            <BsLightningChargeFill className="text-yellow-400" />
            Flexible Infrastructure Sizing
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
            Invest in your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">career.</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto">
            Choose a plan that fits your interview timeline. Secure payments via Stripe. Top up credits seamlessly whenever you need them.
          </p>
        </div>
      </div>

      <div className='grid md:grid-cols-3 gap-8 max-w-6xl mx-auto w-full z-10 relative'>
        {plans.map((plan, index) => {
          const isSelected = selectedPlan === plan.id;

          return (
            <Motion.div 
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1, type: "spring" }}
              whileHover={!plan.default ? { y: -5, scale: 1.02 } : {}}
              onClick={() => !plan.default && setSelectedPlan(plan.id)}
              className={`relative rounded-3xl p-8 transition-all duration-300 border flex flex-col h-full
                ${isSelected && !plan.default
                  ? "border-[#6366F1]/50 bg-gradient-to-b from-[#1A1A2A] to-[#121218] shadow-[0_0_40px_rgba(99,102,241,0.15)]"
                  : "border-white/10 bg-[#151518]/80 shadow-2xl backdrop-blur-xl hover:bg-[#1A1A20]"
                }
                ${plan.default ? "cursor-default opacity-80" : "cursor-pointer"}
              `}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-[0_0_20px_rgba(99,102,241,0.5)] flex items-center gap-1.5 whitespace-nowrap">
                  <FaStar size={10} /> {plan.badge}
                </div>
              )}

              {/* Default Tag */}
              {plan.default && (
                <div className="absolute top-6 right-6 bg-white/5 text-slate-400 text-xs px-3 py-1 rounded-full border border-white/10">
                  Current
                </div>
              )}

              {/* Plan Name */}
              <h3 className="text-2xl font-bold text-white mb-2">
                {plan.name}
              </h3>

              {/* Description */}
              <p className="text-slate-400 text-sm leading-relaxed min-h-[40px]">
                {plan.description}
              </p>

              {/* Price */}
              <div className="mt-6 mb-8 pb-8 border-b border-white/10">
                <div className="flex items-baseline gap-1">
                  <span className={`text-5xl font-extrabold ${isSelected ? "text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400" : "text-white"}`}>
                    {plan.price}
                  </span>
                </div>
                <div className="mt-2 inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-md text-sm font-bold border border-emerald-500/20">
                  {plan.credits} Credits Included
                </div>
              </div>

              {/* Features */}
              <div className="space-y-4 text-left flex-1">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <FaCheckCircle className={`mt-0.5 text-sm shrink-0 ${isSelected ? "text-indigo-400" : "text-emerald-500"}`} />
                    <span className="text-slate-300 text-sm font-medium">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              {!plan.default && (
                <button
                  disabled={loadingPlan === plan.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isSelected) {
                      setSelectedPlan(plan.id)
                    } else {
                      handlePayment(plan)
                    }
                  }} 
                  className={`w-full mt-8 py-3.5 rounded-xl font-bold tracking-wide transition-all duration-300 border flex items-center justify-center
                    ${isSelected
                      ? "bg-indigo-600 border-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:bg-indigo-500"
                      : "bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20"
                    }
                  `}
                >
                  {loadingPlan === plan.id
                    ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                        </svg>
                        Securely Redirecting...
                      </span>
                    )
                    : isSelected
                      ? "Proceed to Checkout"
                      : "Select Plan"
                  }
                </button>
              )}
            </Motion.div>
          )
        })}
      </div>

    </div>
  )
}

export default Pricing
