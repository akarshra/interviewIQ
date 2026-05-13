import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Auth from './pages/Auth'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setUserData } from './redux/userSlice'
import InterviewPage from './pages/InterviewPage'
import InterviewHistory from './pages/InterviewHistory'
import Pricing from './pages/Pricing'
import InterviewReport from './pages/InterviewReport'
import InterviewDesign from './pages/InterviewDesign'
import Success from './pages/Success'
import Analytics from './pages/Analytics'
import { api } from './utils/apiClient'

function App() {

  const dispatch = useDispatch()
  useEffect(()=>{
    const getUser = async () => {
      try {
        const result = await api.get("/api/user/current-user")
        dispatch(setUserData(result.data))
      } catch {
        dispatch(setUserData(null))
      }
    }
    getUser()

  },[dispatch])
  return (
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/auth' element={<Auth/>}/>
      <Route path='/interview' element={<InterviewPage/>}/>
      <Route path='/history' element={<InterviewHistory/>}/>
      <Route path='/pricing' element={<Pricing/>}/>
      <Route path='/report/:id' element={<InterviewReport/>}/>
      <Route path='/design' element={<InterviewDesign/>}/>
      <Route path='/success' element={<Success/>}/>
      <Route path='/analytics' element={<Analytics/>}/>



    </Routes>
  )
}

export default App
