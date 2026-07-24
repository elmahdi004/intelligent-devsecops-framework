import Form from '@/components/utility/Form'
import { NavLink, useNavigate } from 'react-router-dom';
import React, { useState } from 'react'
import {SignupFormTemplate} from '../../config/config'
import { useDispatch } from 'react-redux';
import { userSignup } from '@/store/auth-slice';
import { useToast } from '@/hooks/use-toast';
function Signup() {
  const [formData,setFormData] = useState({
    username : "",
    email : "",
    password : ""
  })
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {toast} = useToast();


  function onSubmit(e){
    e.preventDefault();
    dispatch(userSignup(formData)).then((data) => {
      if(data?.payload?.success){
        toast({
          title : data.payload.message
        });
        navigate('/auth/login');
      }
      else{
        toast({
          title : data.payload.message,
          variant: "destructive"
        });
      }
    });
  }

  return (
    <div className='w-full space-y-8'>
      <div className='text-center space-y-2'>
        <h1 className='text-4xl md:text-5xl font-bold tracking-tight text-gray-900'>
          Join{' '}
          <span className='font-stick-no-bills text-4xl font-bold gradient-text'>
            FLINT<span className='text-red-500 text-5xl'>.</span>
          </span>
        </h1>
        <p className='text-lg text-gray-600'>
          Create your new account and explore our premium collection
        </p>
      </div>
      
      <div className='bg-white rounded-2xl shadow-xl border border-gray-200 p-8'>
        <Form 
          FormTemplate={SignupFormTemplate}
          FormData={formData}
          setFormData={setFormData}
          onSubmit={onSubmit}
          EventName="Sign Up"
        />
      </div>
      
      <div className='text-center'>
        <p className='text-gray-600'>
          Already have an account?{' '}
          <NavLink to="/auth/login" className="text-red-500 font-semibold hover:text-red-600 transition-colors">
            Login
          </NavLink>
        </p>
      </div>
    </div>
  )
}

export default Signup