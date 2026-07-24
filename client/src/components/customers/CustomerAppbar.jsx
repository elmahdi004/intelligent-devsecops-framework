import React, { useEffect, useState } from 'react'
import { NavLink, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger,SheetHeader,SheetTitle, SheetDescription } from '../ui/sheet';
import { Button } from '../ui/button';
import { LogOut, Menu, Search, ShoppingCart, UserCog } from 'lucide-react';
import {CustomerHomeMenuItems} from "../../config/config.js"
import { useDispatch, useSelector } from 'react-redux';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { resetAuthentication } from '@/store/auth-slice';
import Cart_Wrapper from './Cart_Wrapper';
import { handleFetchCartItems } from '@/store/customer-slice/cart';
import { Badge } from '../ui/badge';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';

function MenuBar({ setCustomerDrawer }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useSelector((state) => state.auth); // Access the user object from Redux store

  function handleFilteredNavigation(item, route) {
    sessionStorage.removeItem("filter");

    if (item === "Home") {
      navigate(route);
      return;
    } else if (item === "Collection") {
      navigate(route);
      return;
    }

    const filter = {
      Category: [item]
    };
    sessionStorage.setItem("filter", JSON.stringify(filter));

    location.pathname.includes('catalog') && filter !== null
      ? setSearchParams(new URLSearchParams(`?Category=${item}`))
      : navigate(route);
  }

  return (
    <nav className='flex flex-col gap-4 mb-3 lg:mb-0 lg:items-center lg:flex-row lg:gap-6'>
      {CustomerHomeMenuItems.map((item) => (
        <Label
          onClick={() => { handleFilteredNavigation(item.label, item.route); setCustomerDrawer(false); }}
          className="font-semibold cursor-pointer text-base lg:text-[17px] text-gray-700 hover:text-red-500 transition-colors duration-200 py-2 lg:py-0"
          key={item.id}
        >
          {item.label}
        </Label>
      ))}
      {/* Conditionally render the "ADMIN" button */}
      {user && user.role === "ADMIN" && (
        <Label>
          <a target="_blank" href="/admin/dashboard" className="rounded-full px-4 py-1.5 inline-block border-2 border-red-500 text-red-500 font-semibold hover:bg-red-500 hover:text-white transition-all duration-200">ADMIN</a>
        </Label>
      )}
    </nav>
  );
}

function Cart_Account_Bar({ drawerMode, setCustomerDrawer }) {
  const { user } = useSelector((state) => state.auth);
  const { cartProducts } = useSelector((state) => state.shoppingCart);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem("flint_token") ? localStorage.getItem("flint_token") : "Invalid";

  useEffect(() => {
    if (user) {
      dispatch(handleFetchCartItems({ token, userId: user?.id }));
    }
  }, [dispatch, user, token]);

  if (!user) {
    // Show login and signup options for unauthenticated users
    return (
      <div>
        {drawerMode ? (
          <div className='absolute w-[80%] flex flex-col gap-3 bottom-2'>
            <div className='flex h-6 gap-2 justify-evenly items-center'>
              <div
                className='flex gap-1 items-center cursor-pointer'
                onClick={() => {
                  navigate("/shop/search");
                  setCustomerDrawer(false);
                }}
              >
                <Search className='w-5 h-5' />
                <span className="font-medium text-[18px]">Search</span>
              </div>
              <Separator orientation="vertical" className="bg-gray-400" />
              <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
                <div
                  onClick={() => setOpenCartSheet(true)}
                  className='flex gap-1 cursor-pointer items-center'
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span className="font-medium text-[18px]">Cart</span>
                </div>
                <Cart_Wrapper cartProducts={cartProducts} setOpenCartSheet={setOpenCartSheet} />
              </Sheet>
            </div>
            <Separator className="bg-gray-400" />
            <div className='flex h-9 gap-1 justify-evenly items-center'>
              <div
                className='flex gap-1 items-center cursor-pointer'
                onClick={() => {
                  setCustomerDrawer(false);
                  navigate("/auth/login");
                }}
              >
                <UserCog className='w-5 h-5' />
                <span className="font-medium text-[18px]">Login</span>
              </div>
              <Separator orientation="vertical" className="bg-gray-500" />
              <div
                className='flex gap-1 items-center cursor-pointer'
                onClick={() => {
                  setCustomerDrawer(false);
                  navigate("/auth/signup");
                }}
              >
                <UserCog className='w-5 h-5' />
                <span className="font-medium text-[18px]">Sign Up</span>
              </div>
            </div>
          </div>
        ) : (
          <div className='flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-3'>
            <Button
              onClick={() => navigate("/shop/search")}
              variant="ghost"
              size="icon"
              className="w-10 h-10 rounded-full hover:bg-gray-100"
            >
              <Search className='w-5 h-5 text-gray-700' />
            </Button>

            <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
              <Button
                onClick={() => setOpenCartSheet(true)}
                variant="ghost"
                size='icon'
                className="relative w-10 h-10 rounded-full hover:bg-gray-100"
              >
                <ShoppingCart className='w-5 h-5 text-gray-700' />
                {cartProducts.length !== 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs font-bold rounded-full">
                    {cartProducts.length}
                  </Badge>
                )}
              </Button>
              <Cart_Wrapper cartProducts={cartProducts} setOpenCartSheet={setOpenCartSheet} />
            </Sheet>

            <Button
              onClick={() => navigate("/auth/login")}
              variant="outline"
              className="font-semibold text-sm px-6 py-2 border-2 hover:bg-gray-50 transition-colors"
            >
              Login
            </Button>
            <Button
              onClick={() => navigate("/auth/signup")}
              className="font-semibold text-sm px-6 py-2 bg-red-500 hover:bg-red-600 text-white transition-colors"
            >
              Sign Up
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      {drawerMode ? (
        <div className='absolute w-[80%] flex flex-col gap-3 bottom-2'>
          <div className='flex h-6 gap-2 justify-evenly items-center'>
            <div
              className='flex gap-1 items-center cursor-pointer'
              onClick={() => {
                navigate("/shop/search");
                setCustomerDrawer(false);
              }}
            >
              <Search className='w-5 h-5' />
              <span className="font-medium text-[18px]">Search</span>
            </div>
            <Separator orientation="vertical" className="bg-gray-400" />
            <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
              <div
                onClick={() => setOpenCartSheet(true)}
                className='flex gap-1 cursor-pointer items-center'
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="font-medium text-[18px]">Cart</span>
              </div>
              <Cart_Wrapper cartProducts={cartProducts} setOpenCartSheet={setOpenCartSheet} />
            </Sheet>
            <Separator orientation="vertical" className="bg-gray-400" />
            <div
              className='flex gap-1 items-center cursor-pointer'
              onClick={() => {
                navigate("/shop/account");
                setCustomerDrawer(false);
              }}
            >
              <UserCog className='w-5 h-5' />
              <span className="font-medium text-[18px]">Account</span>
            </div>
          </div>
          <Separator className="bg-gray-400" />
          <div className='flex h-9 gap-1 justify-evenly items-center'>
            <div className='flex items-center gap-2'>
              <Avatar className="bg-black">
                <AvatarFallback className="bg-black text-white">
                  {user.username[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <h2 className='text-lg font-semibold'>{user.username}</h2>
            </div>
            <Separator orientation="vertical" className="bg-gray-500" />
            <div
              className='flex gap-1 items-center cursor-pointer'
              onClick={() => {
                setCustomerDrawer(false);
                dispatch(resetAuthentication());
                navigate("/auth/login");
              }}
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium text-[18px]">Logout</span>
            </div>
          </div>
        </div>
      ) : (
        <div className='flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-3'>
          <Button
            onClick={() => navigate("/shop/search")}
            variant="ghost"
            size="icon"
            className="w-10 h-10 rounded-full hover:bg-gray-100"
          >
            <Search className='w-5 h-5 text-gray-700' />
          </Button>

          <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
            <Button
              onClick={() => setOpenCartSheet(true)}
              variant="ghost"
              size='icon'
              className="relative w-10 h-10 rounded-full hover:bg-gray-100"
            >
              <ShoppingCart className='w-5 h-5 text-gray-700' />
              {cartProducts.length !== 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs font-bold rounded-full">
                  {cartProducts.length}
                </Badge>
              )}
            </Button>
            <Cart_Wrapper cartProducts={cartProducts} setOpenCartSheet={setOpenCartSheet} />
          </Sheet>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="bg-gradient-to-br from-red-500 to-orange-500 cursor-pointer hover:ring-2 ring-red-500 transition-all">
                <AvatarFallback className="bg-gradient-to-br from-red-500 to-orange-500 text-white font-semibold">
                  {user.username[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" className="w-64 bg-white shadow-xl border border-gray-200">
              <DropdownMenuLabel className="pb-2">
                <div className='flex flex-col gap-1'>
                  <span className="font-semibold text-gray-900">
                    {user?.username}{" "}
                    {user && user.role === "ADMIN" && (
                      <span className='px-2 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-800 border border-yellow-300 font-bold'>
                        ADMIN
                      </span>
                    )}
                  </span>
                  <span className='text-sm font-normal text-gray-500'>{user?.email}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => navigate("/shop/account")}
                className="flex items-center tracking-wide cursor-pointer hover:bg-gray-50 py-2"
              >
                <UserCog className='mr-2 h-5 w-5 text-gray-600' />
                <span className="font-medium">Account</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  dispatch(resetAuthentication());
                  navigate("/auth/login");
                }}
                className="flex items-center tracking-wide cursor-pointer hover:bg-red-50 text-red-600 py-2"
              >
                <LogOut className='mr-2 h-5 w-5' />
                <span className="font-medium">Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}

function CustomerAppbar() {

  const navigate = useNavigate();
  const [customerDrawer,setCustomerDrawer] = useState(false);

  return (
    <header className='sticky top-0 left-0 w-full z-50 border-b bg-white/95 backdrop-blur-md shadow-md'>
        <div className='container mx-auto flex h-20 items-center justify-between px-4 md:px-6 lg:px-8'>
          <NavLink to='/shop/home' className='flex items-center hover:opacity-80 transition-opacity'>
            <span className='font-stick-no-bills text-4xl md:text-5xl font-bold gradient-text'>FLINT<span className='text-red-500 text-5xl md:text-6xl'>.</span></span>
          </NavLink>
          <Sheet className="relative" open={customerDrawer} onOpenChange={() => setCustomerDrawer(!customerDrawer)}>
            <SheetTrigger asChild>
              <Button variant='ghost' onClick={() => setCustomerDrawer(true)} size='icon' className='lg:hidden border-none hover:bg-gray-100'>
                <Menu className='w-6 h-6' />
                <span className='sr-only'>Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full max-w-sm bg-white"> 
              <SheetHeader className='pb-6'>
                <SheetTitle>
                  <span className='font-stick-no-bills text-4xl font-bold gradient-text'>FLINT<span className='text-red-500 text-5xl'>.</span></span>
                </SheetTitle>
                <SheetDescription className='text-gray-500'>Your style destination</SheetDescription>
              </SheetHeader>
              <div className='flex flex-col gap-6'>
                <MenuBar setCustomerDrawer={setCustomerDrawer}/>
                <Cart_Account_Bar drawerMode={true} setCustomerDrawer={setCustomerDrawer}/>
              </div>
            </SheetContent>
          </Sheet>
          <div className='hidden lg:flex lg:items-center lg:gap-8'>
            <MenuBar setCustomerDrawer={setCustomerDrawer}/>
          </div>
          <div className='hidden lg:flex lg:items-center lg:gap-4'>
            <Cart_Account_Bar drawerMode={false}/>
          </div>
        </div>
    </header>
  )
}

export default CustomerAppbar;