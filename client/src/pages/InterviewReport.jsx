import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Step3Report from '../components/Step3Report';
import { api } from '../utils/apiClient';
function InterviewReport() {
  const {id} = useParams()
  const [report,setReport] = useState(null);
   
  useEffect(()=>{
    const fetchReport = async () => {
      try {
        const result = await api.get("/api/interview/report/" + id)

        setReport(result.data)
      } catch {
        // Handle error silently
      }
    }

    fetchReport()
  },[id])


    if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">
          Loading Report...
        </p>
      </div>
    );
  }

  return <Step3Report report={report}/>
}

export default InterviewReport
