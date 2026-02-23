import React from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const ActiveRider = () => {
  const axiosSecure = useAxiosSecure();

  const { data: riders = [], isLoading, refetch } = useQuery({
    queryKey: ["active-riders"],
    queryFn: async () => {
      const res = await axiosSecure.get("/active");
      return res.data;
    },
  });

  const handleDeActivate = (id) => {
    Swal.fire({
      title: "Deactivate Rider?",
      text: "This rider will become inactive.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Deactivate",
      confirmButtonColor: "#ef4444",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.patch(`/riders/${id}`, { status: "deActive" }).then((res) => {
          if (res.data.modifiedCount > 0) {
            refetch();
            Swal.fire("Deactivated!", "Rider is now inactive.", "success");
          }
        });
      }
    });
  };

  // ✅ Loading Skeleton
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow-lg p-5 border animate-pulse"
          >
            <div className="flex justify-center -mt-10 mb-3">
              <div className="w-20 h-20 rounded-full bg-gray-300" />
            </div>
            <div className="space-y-3 mt-6">
              <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto" />
              <div className="h-3 bg-gray-200 rounded w-1/3 mx-auto" />
            </div>
            <div className="space-y-2 mt-5">
              <div className="h-3 bg-gray-200 rounded w-full" />
              <div className="h-3 bg-gray-200 rounded w-5/6" />
              <div className="h-3 bg-gray-200 rounded w-4/6" />
              <div className="h-3 bg-gray-200 rounded w-3/6" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ✅ Empty State
  if (!riders.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <img
          src="https://cdn-icons-png.flaticon.com/512/4076/4076503.png"
          alt="empty"
          className="w-28 mb-4 opacity-70"
        />
        <h2 className="text-xl font-semibold text-gray-700">No Active Riders</h2>
        <p className="text-sm text-gray-500 mt-1">
          There are currently no active riders.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {riders.map((rider) => (
        <div
          key={rider._id}
          className="bg-white rounded-2xl shadow-lg p-5 border hover:shadow-xl transition relative"
        >
          <div className="flex justify-center -mt-10 mb-3">
            <img
              src={rider.photoURL}
              alt={rider.name}
              className="w-20 h-20 rounded-full border-4 border-white shadow-md object-cover"
            />
          </div>

          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">{rider.name}</h3>
            <span className="inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
              {rider.status}
            </span>
          </div>

          <div className="space-y-2 text-sm text-gray-600">
            <p><span className="font-medium">Email:</span> {rider.email}</p>
            <p><span className="font-medium">Age:</span> {rider.age}</p>
            <p><span className="font-medium">Region:</span> {rider.region}</p>
            <p><span className="font-medium">District:</span> {rider.district}</p>
            <p><span className="font-medium">Bike Reg No:</span> {rider.bikeRegistration}</p>
          </div>

          <div className="mt-5">
            <button
              onClick={() => handleDeActivate(rider._id)}
              className="w-full px-4 py-2 text-sm font-semibold rounded-lg bg-red-400 text-white hover:bg-red-500 transition"
            >
              Deactivate Rider
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActiveRider;
