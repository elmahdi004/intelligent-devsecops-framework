import React from 'react'
import { useNavigate } from 'react-router-dom'

function PrivacyPolicy() {

  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-center items-center">
    
    <div onClick={() => navigate("/shop/home")} className="cursor-pointer flex flex-col items-start ">
        <span className='font-stick-no-bills text-4xl font-bold'>FLINT
        <span className='text-red-400 text-5xl'>.</span>
        </span>
    </div>

    <div className="mt-10 max-w-4xl mx-auto px-3">
      <h1 className="text-3xl font-bold text-slate-800">Privacy Policy</h1>
      <p className="text-gray-600 mb-4">
      We are dedicated to safeguarding your personal information because we respect your right to privacy. This Privacy Policy describes how we gather, utilise, and protect your data.
      </p>
      <h2 className="text-xl font-semibold">1. Information</h2>
      <p className="text-gray-600 mb-4">
      When you use our services, we may acquire personal data such as your name, email address etc...
      </p>
      <h2 className="text-xl font-semibold">2. Security</h2>
      <p className="text-gray-600 mb-4 ">
        Being a personal project, user's are advised not to share any sensitive information although effort is taken to keep things secure.
      </p>
    </div>
  </div>
  )
}

export default PrivacyPolicy