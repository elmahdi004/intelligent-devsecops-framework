import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { verifyAuth } from './store/auth-slice'
import { LoaderCircle } from 'lucide-react'

/*--- LAYOUTS---*/
import Auth_Layout from './components/auth/Auth_Layout'
import Admin_Layout from './components/admin/Admin_Layout'
import Customer_Layout from './components/customers/Customer_Layout'

/*---PAGES---*/
import Login from './pages/auth/Login.jsx'
import Signup from './pages/auth/Signup.jsx'
import Dashboard from './pages/admin/Dashboard'
import Products from './pages/admin/Products'
import Orders from './pages/admin/Orders'
import PageNotFound from './pages/missing/PageNotFound'
import Home from './pages/customers/Home.jsx'
import Catalog from './pages/customers/Catalog.jsx'
import Payment from './pages/customers/Payment.jsx'
import Account from './pages/customers/Account'
import AuthValidator from './components/utility/AuthValidator'
import Unauthorized from './pages/restricted/Unauthorized'
import ProductDetails from './pages/customers/ProductDetails'
import Payment_Validator from "./pages/payment-redirectors/Payment_Validator"
import Success from "./pages/payment-redirectors/Success"
import Rejected from "./pages/payment-redirectors/Rejected"
import Search from './pages/customers/Search'
import Banners from './pages/admin/Banners'
import TermsAndConditions from './pages/terms-policy/TermsAndConditions'
import PrivacyPolicy from './pages/terms-policy/PrivacyPolicy'

function App() {

  const {isAuthenticated,isLoading,user} = useSelector((state) => state.auth)
  const dispatch = useDispatch();
  const token = localStorage.getItem("flint_token") ? localStorage.getItem("flint_token") : "Invalid";
  const location = useLocation();
  
  useEffect(()=> {
    dispatch(verifyAuth(token));
  },[dispatch,location.pathname]);

  if (isLoading) return (
    <div className='flex justify-center items-center w-screen h-screen bg-gradient-to-br from-gray-50 to-gray-100'>
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="flex flex-col items-center">
          <span className='font-stick-no-bills text-5xl font-bold gradient-text'>FLINT
            <span className='text-red-500 text-6xl'>.</span>
          </span>
        </div>
        <LoaderCircle className='text-red-500 w-12 h-12 animate-spin' />
        <p className='text-slate-600 font-medium'>Please wait, while we prepare your style journey</p>
      </div>
    </div>
  );


  return (
    <div className='flex flex-col bg-gray-50 min-h-screen'>
        <Routes>

          <Route path='/' element={<AuthValidator isAuthenticated={isAuthenticated} user={user}></AuthValidator>} />

          {/* AUTH ROUTES */}
          <Route path='/auth' element={
            <AuthValidator isAuthenticated={isAuthenticated} user={user}>
              <Auth_Layout />
            </AuthValidator>
          }>
            <Route path='login' element={<Login />} />
            <Route path='signup' element={<Signup />} />
          </Route>

          {/* ADMIN ROUTES */}
          <Route path='/admin' element={
            <AuthValidator isAuthenticated={isAuthenticated} user={user}>
              <Admin_Layout />
            </AuthValidator>
          }>
            <Route path='dashboard' element={<Dashboard />} />
            <Route path='products' element={<Products />} />
            <Route path='orders' element={<Orders />} />
            <Route path='banners' element={<Banners />} />
          </Route>

          {/* CUSTOMER ROUTES */}
          <Route path="/shop" element={
            <AuthValidator isAuthenticated={isAuthenticated} user={user}>
              <Customer_Layout />
            </AuthValidator>
          }>
            <Route path='checkout' element={<Payment />} />
            <Route path='account' element={<Account />} />
            <Route path='search' element={<Search />} />
            <Route path='payment' element={<Payment_Validator />} />
            <Route path='payment/success' element={<Success />} />
            <Route path='payment/rejected' element={<Rejected />} />
          </Route>

          <Route path="/shop" element={<Customer_Layout />}>
          <Route path='home' element={<Home />} />
          <Route path='catalog' element={<Catalog />} />
          <Route path='product/:id' element={<ProductDetails />} />
          </Route>

          {/* UNAUTHORIZED */}
          <Route path="/restrict" element={<Unauthorized />} >
          </Route>

          {/* T&C */}
          <Route path="/terms-conditions" element={<TermsAndConditions />} >
          </Route>

          {/* PRIVACY POLICY */}
          <Route path="/privacy-policy" element={<PrivacyPolicy />} >
          </Route>

          {/* 404 - PAGE NOT FOUND */}
          <Route path="*" element={<PageNotFound />} >
          </Route>

        </Routes>
    </div>
  )
}

export default App
