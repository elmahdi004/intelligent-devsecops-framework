import React, { useState } from 'react'
import {Outlet} from 'react-router-dom'
import Appbar from './Appbar'
import Drawer from './Drawer'

function Admin_Layout() {

const [openDrawer,setDrawerOpening] = useState(false);

  return (
    <div className='flex min-h-screen w-full bg-gradient-to-br from-gray-50 via-white to-gray-50'>
        <Drawer openDrawer={openDrawer} setDrawerOpening={setDrawerOpening} />
        <div className='flex flex-1 flex-col'>
            <Appbar setDrawerOpening={setDrawerOpening}/>
            <main className='flex flex-1 flex-col p-4 md:p-6 lg:p-8'> 
                <Outlet />
            </main>
        </div>
    </div>
  )
}

export default Admin_Layout;