import React, { Fragment } from 'react'
import { LayoutDashboard , ShoppingBasket , HandCoins, GalleryHorizontalEnd, SquareArrowOutUpRight, Sparkles } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '../ui/sheet';

const AdminDrawerTemplate = [
  {
    name : "Dashboard",
    route : '/admin/dashboard',
    icon : LayoutDashboard
  },
  {
    name : "Products",
    route : '/admin/products',
    icon : ShoppingBasket
  },
  {
    name : "Orders",
    route : '/admin/orders',
    icon : HandCoins
  },
  {
    name : "Banners",
    route : '/admin/banners',
    icon : GalleryHorizontalEnd
  }
];

function Drawer({openDrawer,setDrawerOpening}) {

  const navigate = useNavigate();

  return (
    <Fragment>
      {/* Mobile Drawer */}
      <Sheet open={openDrawer} onOpenChange={() => setDrawerOpening(false)} className="relative">
        <SheetContent side='left' className='w-72 bg-gradient-to-b from-gray-900 to-gray-800 text-white p-0'>
            <div className='flex flex-col h-full'>
                <SheetHeader className='border-b border-gray-700 px-6 py-6 bg-gradient-to-r from-red-500/10 to-orange-500/10'>
                  <SheetTitle className='text-left'>
                    <div className="flex flex-col items-start">
                      <span className='font-stick-no-bills text-4xl font-bold gradient-text'>FLINT
                        <span className='text-red-500 text-5xl'>.</span>
                      </span>
                      <div className="flex items-center gap-2 mt-2">
                        <Sparkles className="w-4 h-4 text-yellow-400" />
                        <span className="text-xs text-gray-300 font-semibold uppercase tracking-wider">Admin Panel</span>
                      </div>
                    </div>
                  </SheetTitle>
                  <SheetDescription className="text-left text-gray-400 mt-2">Manage your store efficiently</SheetDescription>
                </SheetHeader>
                <div className='flex flex-col px-4 py-6 gap-2 flex-1'>
                  {
                    AdminDrawerTemplate.map((it) => {
                      const IconComponent = it.icon;
                      return (
                        <div 
                          key={it.name} 
                          onClick={() => {
                            navigate(it.route)
                            setDrawerOpening(false);
                          }} 
                          className='group flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 hover:translate-x-1 transition-all duration-200 cursor-pointer'
                        >
                          <IconComponent className="w-5 h-5 text-gray-400 group-hover:text-red-400 transition-colors" />
                          <h1 className="text-sm font-semibold text-gray-300 group-hover:text-white transition-colors">{it.name}</h1>
                        </div>
                      )
                    })
                  }
                </div>
                <a 
                  href="/shop/home" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className='mx-4 mb-4 border-t border-gray-700 pt-4'
                >
                  <div className='flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-all duration-200 group'>
                    <SquareArrowOutUpRight className="w-5 h-5 text-gray-400 group-hover:text-red-400 transition-colors" />
                    <span className="text-sm font-semibold text-gray-300 group-hover:text-white transition-colors">Visit Shop</span>
                  </div>
                </a>
            </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden z-40 h-screen sticky left-0 top-0 w-64 flex-col border-r border-gray-200 bg-white shadow-xl lg:flex">

        {/* Logo Section */}
        <div className="flex justify-center border-b border-gray-200 px-6 py-6 bg-gradient-to-br from-red-50 to-orange-50">
          <div 
            onClick={() => navigate("/admin/dashboard")} 
            className="flex flex-col items-start cursor-pointer group"
          >
            <span className='font-stick-no-bills text-4xl font-bold gradient-text group-hover:scale-105 transition-transform'>
              FLINT
              <span className='text-red-500 text-5xl'>.</span>
            </span>
            <div className="flex items-center gap-2 mt-1">
              <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
              <span className="text-xs text-gray-600 font-bold uppercase tracking-wider">Admin Panel</span>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex flex-col px-4 py-6 gap-2 flex-1">
          {AdminDrawerTemplate.map((it) => {
            const IconComponent = it.icon;
            return (
              <NavLink
                key={it.name}
                to={it.route}
                className={({isActive}) => 
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive 
                      ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg shadow-red-500/30' 
                      : 'text-gray-700 hover:bg-gray-100 hover:text-red-600'
                  }`
                }
              >
                <IconComponent className="w-5 h-5" />
                <h1 className="text-sm font-semibold">{it.name}</h1>
              </NavLink>
            )
          })}
        </div>

        {/* Visit Shop Link */}
        <a 
          href="/shop/home" 
          target="_blank" 
          rel="noopener noreferrer"
          className='mx-4 mb-4 border-t border-gray-200 pt-4'
        >
          <div className='flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-red-500 hover:to-orange-500 hover:text-white transition-all duration-200 group'>
            <SquareArrowOutUpRight className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
            <span className="text-sm font-semibold text-gray-700 group-hover:text-white transition-colors">Visit Shop</span>
          </div>
        </a>

      </aside>

    </Fragment>
  )
}

export default Drawer