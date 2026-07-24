import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Home, SearchX } from 'lucide-react'

function PageNotFound() {

  const navigate = useNavigate();

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="absolute top-6 left-6">
        <div onClick={() => navigate("/shop/home")} className="cursor-pointer">
          <span className='font-stick-no-bills text-4xl font-bold gradient-text'>FLINT
            <span className='text-red-500 text-5xl'>.</span>
          </span>
        </div>
      </div>
      <Button 
        variant="outline" 
        className="absolute top-6 right-6 border-2 hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors" 
        onClick={() => navigate("/shop/home")}
      >
        <Home className="w-4 h-4 mr-2" />
        Go to Home
      </Button>
      
      <div className="max-w-2xl text-center px-4">
        <div className="mb-8 flex justify-center">
          <div className="w-32 h-32 rounded-full bg-red-100 flex items-center justify-center">
            <SearchX className="w-16 h-16 text-red-500" />
          </div>
        </div>
        <div className='flex flex-col sm:flex-row items-center justify-center gap-4 mb-6'>
          <span className='text-6xl md:text-7xl font-bold text-gray-900'>404</span>
          <Separator orientation="vertical" className="hidden sm:block h-12 bg-gray-300" />
          <div className="flex flex-col">
            <span className='text-2xl md:text-3xl font-bold text-gray-900'>Page Not Found</span>
            <span className='text-base md:text-lg text-gray-600 mt-1'>This page could not be found</span>
          </div>
        </div>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => navigate("/shop/home")}
            className="bg-red-500 hover:bg-red-600 text-white px-8 py-6 text-lg font-semibold"
          >
            <Home className="w-5 h-5 mr-2" />
            Go to Home
          </Button>
          <Button 
            onClick={() => navigate("/shop/catalog")}
            variant="outline"
            className="border-2 px-8 py-6 text-lg font-semibold hover:bg-gray-100"
          >
            Browse Products
          </Button>
        </div>
      </div>
    </div>
  )
}

export default PageNotFound