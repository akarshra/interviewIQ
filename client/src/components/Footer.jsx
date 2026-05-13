import React from 'react'
import { BsRobot, BsTwitter, BsGithub, BsLinkedin } from 'react-icons/bs'

function Footer() {
  return (
    <footer className='border-t border-white/5 bg-[#070709] relative overflow-hidden z-10'>
      {/* Background glow effects */}
      <div className="absolute top-0 right-1/4 w-[300px] h-[300px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className='max-w-7xl mx-auto px-6 pt-20 pb-12 relative z-10'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-12 mb-16'>
          
          {/* Brand Col */}
          <div className='col-span-1 md:col-span-2'>
            <div className='flex items-center gap-3 mb-6'>
                <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.3)]'>
                  <BsRobot className="text-white text-xl" />
                </div>
                <h2 className='text-2xl font-bold tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400'>
                  InterviewIQ
                </h2>
            </div>
            <p className='text-slate-400 text-sm max-w-md leading-relaxed mb-8'>
              AI-powered interview preparation platform designed to dynamically evaluate and improve 
              your communication skills, technical depth, and professional confidence frame-by-frame.
            </p>
            <div className='flex items-center gap-4'>
              <a href="#" className='w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 hover:border-indigo-500/30 transition-all'>
                <BsTwitter />
              </a>
              <a href="#" className='w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 hover:border-indigo-500/30 transition-all'>
                <BsGithub />
              </a>
              <a href="#" className='w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 hover:border-indigo-500/30 transition-all'>
                <BsLinkedin />
              </a>
            </div>
          </div>

          {/* Links Col 1 */}
          <div>
            <h3 className='text-white font-bold mb-6 tracking-wide'>Platform</h3>
            <ul className='space-y-4'>
              <li><a href="#" className='text-sm text-slate-400 hover:text-indigo-400 transition-colors'>Features</a></li>
              <li><a href="#" className='text-sm text-slate-400 hover:text-indigo-400 transition-colors'>Pricing</a></li>
              <li><a href="#" className='text-sm text-slate-400 hover:text-indigo-400 transition-colors'>Analytics Matrix</a></li>
              <li><a href="#" className='text-sm text-slate-400 hover:text-indigo-400 transition-colors'>AI Architectures</a></li>
            </ul>
          </div>

          {/* Links Col 2 */}
          <div>
            <h3 className='text-white font-bold mb-6 tracking-wide'>Legal</h3>
            <ul className='space-y-4'>
              <li><a href="#" className='text-sm text-slate-400 hover:text-indigo-400 transition-colors'>Terms of Service</a></li>
              <li><a href="#" className='text-sm text-slate-400 hover:text-indigo-400 transition-colors'>Privacy Policy</a></li>
              <li><a href="#" className='text-sm text-slate-400 hover:text-indigo-400 transition-colors'>Cookie Settings</a></li>
              <li><a href="#" className='text-sm text-slate-400 hover:text-indigo-400 transition-colors'>Contact</a></li>
            </ul>
          </div>

        </div>

        <div className='border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4'>
          <p className='text-slate-500 text-xs font-medium'>
            © {new Date().getFullYear()} InterviewIQ AI. All rights reserved. Built with Antigravity.
          </p>
          <div className="flex items-center gap-2">
             <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
             </span>
             <span className="text-xs text-slate-500 font-mono tracking-widest uppercase">Systems Operational</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
