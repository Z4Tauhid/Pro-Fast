import axios from 'axios';
import React from 'react';



const axiosOnly = axios.create({
    baseURL: `https://zapshift-back.vercel.app`,
})

const useAxios = () => {
    return axiosOnly
};

export default useAxios;