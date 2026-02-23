import React from "react";
import { useForm } from "react-hook-form";
import { useLoaderData } from "react-router";
import Swal from "sweetalert2";
import useAxiosSecure from "../Hooks/useAxiosSecure";

import agent from "../../assets/agent-pending.png";
import useAuth from "../Hooks/useAuth";

const BeARider = () => {
  const serviceCenters = useLoaderData();
  const { user } = useAuth();
  console.log(user)
   const axiosSecure = useAxiosSecure()

  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      name: user?.displayName || "",
      email: user?.email || "",
      photoURL: user?.photoURL || "",
      region: "",
      district: "",
      age: "",
      residenceCard: "",
      bikeRegistration: "",
      additionalInfo: "",
      workStatus: "none"
    },
  });

  const selectedRegion = watch("region");

  // Unique regions
  const regions = [...new Set(serviceCenters.map(item => item.region))];

  // Districts by region
  const getDistrictsByRegion = (region) => {
    return serviceCenters
      .filter(item => item.region === region)
      .map(item => item.district);
  };

   const handleBeARider = (data) => {
  const riderData = {
    ...data,
    applied_at: new Date().toISOString(),
    status: "pending",
  };

  console.log("Rider Application:", riderData);

  axiosSecure.post("/riders", riderData)
    .then((res) => {
      if (res.data.insertedId) {
        Swal.fire({
          icon: "success",
          title: "Application Submitted",
          text: "We will contact you soon!",
        });
      }
    })
    .catch((error) => {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: "Something went wrong. Please try again.",
      });
    });
};


  return (
    <section className="w-11/12 mx-auto bg-white rounded-2xl shadow-xl py-8 px-6 md:px-10 mb-10">
      {/* Header */}
      <h2 className="text-xl font-semibold text-[#063b3b] mb-1">
        Be a Rider
      </h2>
      <p className="text-sm text-gray-500 mb-8">
        Join our delivery team and start earning
      </p>

      {/* Content */}
      <div className="flex flex-col lg:flex-row items-center gap-10">
        
        {/* Form */}
        <form
          onSubmit={handleSubmit(handleBeARider)}
          className="space-y-5 flex-1 w-full"
        >
          {/* Full Name */}
          <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
            <label className="text-sm text-gray-600">Full Name</label>
            <input
              type="text"
              readOnly
              className="input bg-gray-100 cursor-not-allowed md:col-span-3 w-full"
              {...register("name")}
            />
          </div>

          {/* Email */}
          <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
            <label className="text-sm text-gray-600">Email</label>
            <input
              type="email"
              readOnly
              className="input bg-gray-100 cursor-not-allowed md:col-span-3 w-full"
              {...register("email")}
            />
          </div>

          {/* Age */}
          <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
            <label className="text-sm text-gray-600">Age</label>
            <input
              type="number"
              placeholder="Your age should be 18+"
              min={18}
              onKeyDown={(e) => {
                if (e.key === "-" || e.key === "e") {
                  e.preventDefault();
                }
              }}
              className="input md:col-span-3 w-full"
              {...register("age", {
                required: "Age is required",
                min: {
                  value: 18,
                  message: "Age must be at least 18",
                },
              })}
            />
          </div>

          {/* Residence Card */}
          <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
            <label className="text-sm text-gray-600">
              Residence Card No
            </label>
            <input
              type="text"
              placeholder="Enter residence card number"
              className="input md:col-span-3 w-full"
              {...register("residenceCard", { required: true })}
            />
          </div>

          {/* Bike Registration */}
          <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
            <label className="text-sm text-gray-600">
              Bike Registration No
            </label>
            <input
              type="text"
              placeholder="Enter bike registration number"
              className="input md:col-span-3 w-full"
              {...register("bikeRegistration", { required: true })}
            />
          </div>

          {/* Region */}
          <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
            <label className="text-sm text-gray-600">Region</label>
            <select
              className="select md:col-span-3 w-full"
              {...register("region", { required: true })}
            >
              <option value="" disabled>
                Select your region
              </option>
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>

          {/* District */}
          <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
            <label className="text-sm text-gray-600">District</label>
            <select
              className="select md:col-span-3 w-full"
              {...register("district", { required: true })}
              disabled={!selectedRegion}
            >
              <option value="" disabled>
                Select your district
              </option>
              {selectedRegion &&
                getDistrictsByRegion(selectedRegion).map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
            </select>
          </div>

          {/* Additional Information */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <label className="text-sm text-gray-600">
              Additional Info
            </label>
            <textarea
              rows="3"
              placeholder="Any additional information..."
              className="textarea md:col-span-3 w-full"
              {...register("additionalInfo")}
            />
          </div>

          {/* Submit */}
          <div className="pt-4 flex justify-center md:justify-start">
            <button
              type="submit"
              className="px-6 bg-lime-400 hover:bg-lime-500 transition
                         text-[#063b3b] font-semibold py-2 rounded-md"
            >
              Submit Application
            </button>
          </div>
        </form>

        {/* Image */}
        <div className="flex-1 flex justify-center">
          <img
            src={agent}
            alt="Delivery Agent"
            className="w-full max-w-xs sm:max-w-sm lg:max-w-md"
          />
        </div>
      </div>
    </section>
  );
};

export default BeARider;
