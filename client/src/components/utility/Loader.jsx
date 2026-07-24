import { LoaderCircle } from 'lucide-react'
import React from 'react'


function Loader({message = "Loading, please wait"}) {
  return (
    <div className='flex justify-center items-center w-screen h-[calc(100vh-100px)]'>
      <div className="flex flex-col items-center justify-center space-y-3">
      <div className="flex flex-col items-start ">
          <span className='font-stick-no-bills text-4xl font-bold'>FLINT
            <span className='text-red-400 text-5xl'>.</span>
          </span>
      </div>
      <LoaderCircle className='text-red-400 w-10 h-10 animate-spin' />
      <p className='text-slate-700'>{message}</p>
      </div>
    </div>
  )
}

export default Loader