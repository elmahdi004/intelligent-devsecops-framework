import Form from '@/components/utility/Form';
import { NavLink, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { LoginFormTemplate } from '../../config/config';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from '@/hooks/use-toast';
import { userLogin } from '@/store/auth-slice';
import { syncLocalCart } from '@/store/customer-slice/cart'; // Import the syncLocalCart action

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const loginResult = await dispatch(userLogin(formData)).unwrap();

      if (loginResult?.success) {
        toast({
          title: loginResult.message,
        });

        // Sync local cart items with the backend after successful login
        const token = localStorage.getItem('flint_token');
        const userId = loginResult.user.id;
        await dispatch(syncLocalCart({ token, userId })).unwrap();

        // Redirect based on user role
        if (loginResult.user.role === 'ADMIN') {
          navigate('/admin/dashboard');
        } else {
          // Check if there's a redirect path in local storage (e.g., from checkout)
          const redirectPath = localStorage.getItem('redirectPath');
          if (redirectPath) {
            localStorage.removeItem('redirectPath'); // Clear the redirect path
            navigate(redirectPath); // Redirect to the saved path (e.g., checkout)
          } else {
            navigate('/shop/home'); // Default redirect
          }
        }
      }
    } catch (error) {
      toast({
        title: error.payload?.message || 'Login failed. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className='w-full space-y-8'>
      <div className='text-center space-y-2'>
        <h1 className='text-4xl md:text-5xl font-bold tracking-tight text-gray-900'>
          Welcome Back
        </h1>
        <p className='text-lg text-gray-600'>
          Login to your account and explore{' '}
          <span className='font-stick-no-bills text-2xl font-bold gradient-text'>
            FLINT<span className='text-red-500 text-3xl'>.</span>
          </span>
        </p>
      </div>
      
      <div className='bg-white rounded-2xl shadow-xl border border-gray-200 p-8'>
        <Form
          FormTemplate={LoginFormTemplate}
          FormData={formData}
          setFormData={setFormData}
          onSubmit={onSubmit}
          EventName='Login'
        />
      </div>
      
      <div className='text-center'>
        <p className='text-gray-600'>
          New to Flint?{' '}
          <NavLink to='/auth/signup' className='text-red-500 font-semibold hover:text-red-600 transition-colors'>
            Sign Up
          </NavLink>
        </p>
      </div>
    </div>
  );
}

export default Login;