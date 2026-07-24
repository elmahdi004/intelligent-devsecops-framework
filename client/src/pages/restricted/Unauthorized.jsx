import { Button } from '@/components/ui/button'
import { OctagonMinus } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

function Unauthorized() {

  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col justify-center items-center bg-red-100 shadow-lg rounded-lg p-8 max-w-md text-center border border-red-600">
        <OctagonMinus size={50} className='text-red-600'/>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Restricted</h1>
        <p className="text-gray-600 mb-6">
          This area is restricted to administrators only.
          You do not have the necessary permissions to view this page.
        </p>
        <Button variant="outline" className=" border border-red-600 bg-red-400 hover:bg-red-300" onClick={() => navigate("/shop/home")}>Go to Home</Button>
      </div>
    </div>
  )
}

export default Unauthorized