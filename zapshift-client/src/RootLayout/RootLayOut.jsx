import React from 'react';
import Navbar from '../Pages/SharedComponents/Navbar';
import { Outlet } from 'react-router';
import Footer from '../Pages/SharedComponents/Footer';

const RootLayOut = () => {
    return (
        <div className='w-11/12 mx-auto'>
            <Navbar></Navbar>
            <div className='min-h-[calc(100vh-335px)]'>
                <Outlet ></Outlet>
            </div>
            <Footer></Footer>
        </div>
    );
};

export default RootLayOut;
