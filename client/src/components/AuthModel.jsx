import React from 'react'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { FaTimes } from "react-icons/fa";
import Auth from '../pages/Auth';

function AuthModel({onClose}) {
    const {userData} = useSelector((state)=>state.user)

    useEffect(()=>{
        if(userData){
            onClose()
        }

    },[userData , onClose])

  return (
    <div className='fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4'>
        <div className='relative w-full max-w-sm flex flex-col items-center justify-center'>
            <button onClick={onClose} className='absolute top-2 right-2 p-1 text-gray-400 hover:text-black hover:bg-black/5 rounded-full z-50 transition-colors'>
             <FaTimes size={18}/>
            </button>
            <Auth isModel={true}/>
        </div>

      
    </div>
  )
}

export default AuthModel

