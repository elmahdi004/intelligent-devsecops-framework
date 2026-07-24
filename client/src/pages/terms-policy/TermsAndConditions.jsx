import React from 'react'
import { useNavigate } from 'react-router-dom'

function TermsAndConditions() {

  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-center items-center">
    
    <div onClick={() => navigate("/shop/home")} className="cursor-pointer flex flex-col items-start ">
        <span className='font-stick-no-bills text-4xl font-bold'>FLINT
        <span className='text-red-400 text-5xl'>.</span>
        </span>
    </div>

    <div className="mt-10 max-w-4xl mx-auto px-3">
      <h1 className="text-3xl font-bold text-slate-800">Terms and Conditions</h1>
      <p className="text-gray-600 mb-4">
      We welcome you to our platform. By using our services, you agree to the following terms and conditions.
      </p>
      <h2 className="text-xl font-semibold">1. Usage Guidelines</h2>
      <p className="text-gray-600 mb-4">
      Users are required to abide by all relevant laws and abstain from any actions that might harm our platform or other users.
      </p>
      <h2 className="text-xl font-semibold">2. Account Responsibility</h2>
      <p className="text-gray-600 mb-4 ">
      You are in charge of keeping your account information private and accountable for everything that is done using it.
      </p>
      <h2 className="text-xl font-semibold">3. Liability Restrictions</h2>
      <p className="text-gray-600 mb-4">
      Any indirect, incidental, or consequential damages resulting from your use of our services are not our responsibility.
      </p>
    </div>
  </div>
  )
}

export default TermsAndConditions