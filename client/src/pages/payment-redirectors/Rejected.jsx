import { Button } from '@/components/ui/button';
import React from 'react'
import { useNavigate } from 'react-router-dom';

function Rejected() {
  
  const navigate = useNavigate();

  return (
    <div className='flex justify-center items-center h-[calc(100vh-105px)]'>
      <div className='flex flex-col gap-3 w-[90%] sm:w-[40%] justify-center items-center text-center shadow-2xl rounded py-5 px-2 border border-gray-200'>
        <img
        src="/rejected.png"
        width="100px"
        />
         <span className="text-3xl font-bold text-red-700 mb-2">Payment Failed</span>
        <span className="text-xl text-red-600">We couldn't process your payment</span>
        <span className="text-sm md:text-lg text-gray-700">
        Unfortunately, your order has not been placed
        </span>
        <Button onClick={() => navigate("/shop/home")}>Home</Button>
      </div>
    </div>
  )
}

export default Rejected