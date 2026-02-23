import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import useAuth from "../../Hooks/useAuth"
import { NavLink, useNavigate } from 'react-router';
import Swal from "sweetalert2";
import axios from "axios";
import useAxios from "../../Hooks/useAxios";


const Register = () => {

  const { createUser, user , logOut, updateUserProfile} = useAuth()
  console.log(user)
  const[profilepic, setProfilePic] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate()
  const axiosInstance = useAxios()

 const onSubmit = async (data) => {
  if (data.password !== data.confirmPassword) {
    Swal.fire({
      icon: "error",
      title: "Passwords do not match",
    });
    return;
  }

  try {
    const result = await createUser(data.email, data.password);
    console.log("User created:", result.user);


    //Store user info in the database with user Role

    const userInfo = {
      email: data.email,
      role: 'user',
      created_at : new Date().toISOString(),
      last_log_in : new Date().toISOString()

    }

    const userRes = await axiosInstance.post('/users', userInfo)
    console.log(userRes.data)

    // DO NOT logout or navigate before this finishes
    

    await updateUserProfile({
      displayName: data.name,
      photoURL: profilepic,
    });

    console.log("Profile updated successfully");

    Swal.fire({
      title: "Registration Successful! Please Login",
      icon: "success",
    });

    await logOut(); // ✅ now safe
    navigate("/login");

  } catch (error) {
    console.error(error);
    Swal.fire({
      icon: "error",
      title: error.message,
    });
  }
};


  const handleImageUpload =async(e) =>{

    const image = e.target.files[0]
    console.log(image)
    const formData = new FormData()
    formData.append('image', image)

    // We will not use our useAxiosSecure Custom Hook. Because we want send it in imagebb


    const imageUploadURL = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_upload_Key}`
    const res = await axios.post(imageUploadURL, formData)
    setProfilePic(res.data.data.url)



  }

  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-800 mb-1">
        Create Account
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Register with Profast
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div>
          <label className="text-sm text-gray-600">Full Name</label>
          <input
            type="text"
            placeholder="Your name"
            {...register("name", { required: true })}
            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-lime-400"
          />
          {errors.name && (
            <p className="text-xs text-red-500 mt-1">
              Name is required
            </p>
          )}
        </div>
        {/* Image */}
        <div>
          <label className="text-sm text-gray-600">Upload Your Image</label>
          <input onChange={handleImageUpload}
            type="file"
            placeholder="Upload Your Image"
           
            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-lime-400"
          />
          {errors.name && (
            <p className="text-xs text-red-500 mt-1">
              Name is required
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="text-sm text-gray-600">Email</label>
          <input
            type="email"
            placeholder="Email"
            {...register("email", { required: true })}
            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-lime-400"
          />
          {errors?.email && (
            <p className="text-xs text-red-500 mt-1">
              Email is required
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="text-sm text-gray-600">Password</label>

          <input
            type="password"
            placeholder="Password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message:
                  "Password must be at least 6 characters and include a number and a special character",
              },
              pattern: {
                value: /^(?=.*[0-9])(?=.*[!@#$%^&*])/,
                message:
                  "Password must be at least 6 characters and include a number and a special character",
              },
            })}
            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-lime-400" />

          {errors?.password && (
            <p className="text-xs text-red-500 mt-1">
              {errors.password.message}
            </p>
          )}
        </div>


        {/* Confirm Password */}
        <div>
          <label className="text-sm text-gray-600">Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm password"
            {...register("confirmPassword", { required: true })}
            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-lime-400"
          />
          {errors?.confirmPassword && (
            <p className="text-xs text-red-500 mt-1">
              Please confirm your password
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-lime-400 text-gray-900 py-2 rounded-md font-medium hover:bg-lime-500 transition"
        >
          Register
        </button>
      </form>

      <p className="text-sm text-center text-gray-500 mt-4">
        Already have an account?{" "}
        <NavLink to={"/login"}>
          <span className="text-lime-500 cursor-pointer hover:underline">
            Login
          </span>
        </NavLink>

      </p>

      <div className="flex items-center my-4">
        <div className="flex-1 h-px bg-gray-300" />
        <span className="px-3 text-sm text-gray-400">Or</span>
        <div className="flex-1 h-px bg-gray-300" />
      </div>

      <button className="w-full border py-2 rounded-md flex items-center justify-center gap-2 hover:bg-gray-50 transition">
        <FcGoogle />
        <span className="text-sm font-medium">
          Register with Google
        </span>
      </button>
    </section>
  );
};

export default Register;
