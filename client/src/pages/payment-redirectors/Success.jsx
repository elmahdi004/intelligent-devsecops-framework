import { Button } from '@/components/ui/button'
import React from 'react'
import { useNavigate } from 'react-router-dom'

function Success() {

  const navigate = useNavigate();

  return (
    <div className='flex justify-center items-center h-[calc(100vh-105px)]'>
      <div className='flex flex-col gap-3 w-[90%] sm:w-[40%] justify-center items-center text-center shadow-2xl rounded py-5 px-2 border border-gray-200'>
        <img
        src="/success.png"
        width="100px"
        />
         <span className="text-3xl font-bold text-green-700 mb-2">Thank You for Your Purchase!</span>
        <span className="text-xl text-green-600">Your payment was successful</span>
        <span className="text-sm md:text-lg text-gray-700">
            Your order has been confirmed and is now being processed
        </span>
        <Button onClick={() => navigate("/shop/account")}>My Orders</Button>
      </div>
    </div>
  )
}

export default Success