import { AlignJustify, LogOut, Bell, Search, Settings } from 'lucide-react'
import React from 'react'
import { Button } from '../ui/button'
import { useDispatch, useSelector } from 'react-redux'
import { resetAuthentication } from '@/store/auth-slice';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

function Appbar({setDrawerOpening}) {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  function handleLogout()
  {
    dispatch(resetAuthentication());
    navigate("/auth/login");
  }

  return (
    <header className='sticky z-50 top-0 flex justify-between items-center px-4 md:px-6 lg:px-8 py-4 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm'>
      
      {/* Mobile Menu Button */}
      <Button 
        variant="ghost" 
        onClick={() => setDrawerOpening(true)} 
        className='lg:hidden p-2 hover:bg-gray-100 rounded-lg'
      >
        <AlignJustify className="w-5 h-5" />
        <span className='sr-only'>Toggle menu</span>
      </Button>

      {/* Mobile Logo */}
      <div className="flex lg:hidden items-center">
        <span className='font-stick-no-bills text-3xl font-bold gradient-text'>FLINT
          <span className='text-red-500 text-4xl'>.</span>
        </span>
        <span className="text-xs text-gray-500 ml-2 font-semibold">ADMIN</span>
      </div>

      {/* Right Side Actions */}
      <div className='flex items-center gap-3 ml-auto'>
        {/* Search Button (Optional) */}
        <Button variant="ghost" size="icon" className="hidden md:flex hover:bg-gray-100 rounded-lg">
          <Search className='w-5 h-5 text-gray-600' />
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative hover:bg-gray-100 rounded-lg">
          <Bell className='w-5 h-5 text-gray-600' />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </Button>

        {/* Settings */}
        <Button variant="ghost" size="icon" className="hidden md:flex hover:bg-gray-100 rounded-lg">
          <Settings className='w-5 h-5 text-gray-600' />
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-3 hover:bg-gray-100 rounded-lg px-3">
              <Avatar className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500">
                <AvatarFallback className="bg-gradient-to-br from-red-500 to-orange-500 text-white font-semibold text-sm">
                  {user?.username?.[0]?.toUpperCase() || 'A'}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-semibold text-gray-900">{user?.username || 'Admin'}</span>
                <span className="text-xs text-gray-500">Administrator</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-white shadow-xl border border-gray-200">
            <DropdownMenuLabel>
              <div className='flex flex-col gap-1'>
                <span className="font-semibold text-gray-900">{user?.username || 'Admin'}</span>
                <span className='text-sm font-normal text-gray-500'>{user?.email || 'admin@flint.com'}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer hover:bg-gray-50">
              <Settings className='mr-2 h-4 w-4 text-gray-600' />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => navigate("/shop/home")} 
              className="cursor-pointer hover:bg-gray-50"
            >
              <span>Visit Store</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleLogout()}
              className="cursor-pointer hover:bg-red-50 text-red-600"
            >
              <LogOut className='mr-2 h-4 w-4' />
              <span className="font-medium">Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
    </header>
  )
}

export default Appbar