import React from 'react'
import CustomerAppbar from './CustomerAppbar'
import { Outlet } from 'react-router-dom'
import Customer_Footer from './Customer_Footer';


function Customer_Layout() {
  return (
    <div className='flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-50'>
        <CustomerAppbar />
        <main className='flex flex-col w-full flex-grow'>
            <Outlet />
        </main>
        <Customer_Footer />
    </div>
  )
}

export default Customer_Layout;