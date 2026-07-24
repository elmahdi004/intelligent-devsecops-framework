import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'

function AuthValidator({isAuthenticated , user , children}) {
  
    const currentLocation = useLocation();

    if(currentLocation.pathname === "/")
    {
        if(!isAuthenticated)
        {
            return <Navigate to="/auth/login" />
        }

        return <Navigate to="/shop/home" />
    }
    
    if(!isAuthenticated && 
    !(currentLocation.pathname.includes('login') || 
    currentLocation.pathname.includes('signup')) )
    {
        return <Navigate to='/auth/login' />
    }

    if(isAuthenticated && 
    (currentLocation.pathname.includes('login') || 
    currentLocation.pathname.includes('signup')) )
    {
        return user.role === 'ADMIN' ? 
        <Navigate to='/admin/dashboard' /> :
        <Navigate to='/shop/home' />
    }

    if(isAuthenticated && 
       user.role !== 'ADMIN' && 
       currentLocation.pathname.includes('admin'))
    {
        return <Navigate to="/restrict" />
    }

    return (
    <>
        {children}
    </>
  )
}

export default AuthValidator