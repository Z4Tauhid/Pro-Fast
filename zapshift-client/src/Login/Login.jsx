import React, { use, useState } from 'react';
import {useForm} from "react-hook-form"
import { FcGoogle } from "react-icons/fc";
import { AuthContext } from '../Provider/AuthProvider';
import { NavLink, useLocation, useNavigate } from 'react-router';
import useAuth from '../Hooks/useAuth';
import Swal from 'sweetalert2';
import useAxios from '../Hooks/useAxios';

const Login = () => {
   
    const {register, handleSubmit, formState: {errors}} = useForm()

    const {googleSignIn,signIn} = useAuth()
    const location = useLocation()

    const [error, setError] = useState("")
    const axiosInstance = useAxios()

    const from = location.state?.from || '/'
    const navigate = useNavigate()

    

    const onSubmit =(data) =>{
        console.log(data)
        setError("")
        signIn(data.email, data.password).then((res) => {
          console.log(res)
          navigate(from)
        })
          .catch((error)=>{
          console.log(error)
          setError("Wrong email or password")
        })
    }

    

    const handleGoogleLogin = () => {
      googleSignIn().then(async (result) => {
        console.log(result)

        const userInfo = {
                email: result.user.email,
                role: 'user',
                created_at : new Date().toISOString(),
                last_log_in : new Date().toISOString()
          }

       const res = await axiosInstance.post('/users', userInfo)
       console.log(res.data)

        navigate(from)
      }).catch(error => {
        Swal.fire({
  icon: "error",
  title: "Oops...",
  text: "Something went wrong!",
  footer: '<a href="#">Why do I have this issue?</a>'
});
      })
    }
   
    return (
        <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">
            Welcome Back
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Login with Profast
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-sm text-gray-600">Email</label>
              <input
                type="email" {...register("email", { required: true })}
                placeholder="Email"
                className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-lime-400"
              />
              {errors?.email && (
            <p className="text-xs text-red-500 mt-1">
              Email is required
            </p>
          )}
            </div>

            <div>
              <label className="text-sm text-gray-600">Password</label>
              <input
                type="password" {...register("password", { required: true, minLength: 6 })}
                placeholder="Password"
                className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-lime-400"
              />
              {errors?.password && (
            <p className="text-xs text-red-500 mt-1">
              Password required & it must be at least 6 characters
            </p>
          )}
          <p className='text-xs text-red-500 mt-1'>{error}</p>
            </div>

            <div className="text-right">
              <button
                type="button"
                className="text-sm text-lime-500 hover:underline"
              >
                Forget Password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-lime-400 text-gray-900 py-2 rounded-md font-medium hover:bg-lime-500 transition"
            >
              Login
            </button>
          </form>

          <p className="text-sm text-center text-gray-500 mt-4">
            Don’t have any account?{" "}
            <NavLink to={"/register"}>
              <span className="text-lime-500 cursor-pointer hover:underline">
              Register
            </span>
            </NavLink>
          </p>

          <div className="flex items-center my-4">
            <div className="flex-1 h-px bg-gray-300" />
            <span className="px-3 text-sm text-gray-400">Or</span>
            <div className="flex-1 h-px bg-gray-300" />
          </div>

          <button onClick={handleGoogleLogin} className="w-full border py-2 rounded-md flex items-center justify-center gap-2 hover:bg-gray-50 transition">
            <FcGoogle />
            <span className="text-sm font-medium">
              Login with Google
            </span>
          </button>
        </section>
    );
};

export default Login;