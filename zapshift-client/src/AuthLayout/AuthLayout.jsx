import React from 'react';
import Login from '../Login/Login';
import { NavLink, Outlet } from 'react-router';
import authDeliver from "../../assets/authImage.png"

const AuthLayout = () => {
    return (

<section className=''>
           <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">
        
        {/* Left: Login Form */}
        <div className="p-5">
          {/* Logo */}
          <NavLink to={"/"}>
            <div className='flex items-end'>
                <img src="../../../assets/logo.png" alt="" />
                <p className='text-3xl -ml-2 font-extrabold'>Profast</p>
            </div>
          </NavLink>

            {/* Left: Illustration */}

            <div className='w-8/12 mx-auto min-h-[400px] flex items-center justify-center'>
                <Outlet></Outlet>
            </div>

          
        </div>

        {/* Right: Illustration */}
        <div className="hidden md:flex items-center justify-center bg-lime-50">
          <img
            src={authDeliver}
            alt="Delivery Illustration"
            className="max-w-sm w-full"
          />
        </div>
      </div>
    </div>
</section>

        
      
    );
};

export default AuthLayout;