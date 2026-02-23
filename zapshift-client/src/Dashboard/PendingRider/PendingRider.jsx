import React from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const PendingRider = () => {
  const axiosSecure = useAxiosSecure();

  const { data: riders = [], refetch, isLoading } = useQuery({
    queryKey: ["pending-riders"],
    queryFn: async () => {
      const res = await axiosSecure.get("/pending");
      return res.data;
    },
  });

  const handleActivate = (id, email) => {
    Swal.fire({
      title: "Activate Rider?",
      text: "This rider will become active.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Activate",
      confirmButtonColor: "#84cc16",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.patch(`/riders/${id}`, { status: "active", email }).then((res) => {
          if (res.data.modifiedCount > 0) {
            refetch();
            Swal.fire("Activated!", "Rider is now active.", "success");
          }
        });
      }
    });
  };

  const handleCancel = (id) => {
    Swal.fire({
      title: "Reject Rider?",
      text: "This rider activation will be cancelled.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Reject",
      confirmButtonColor: "#ef4444",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.patch(`/riders/${id}`, { status: "rejected" }).then((res) => {
          if (res.data.modifiedCount > 0) {
            refetch();
            Swal.fire("Rejected!", "Rider has been rejected.", "success");
          }
        });
      }
    });
  };

  if (isLoading) {
    return <p className="text-center">Loading pending riders...</p>;
  }

  return (
    <div>
      {riders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/4076/4076503.png"
            alt="empty"
            className="w-28 mb-4 opacity-70"
          />
          <h2 className="text-xl font-semibold text-gray-700">No Pending Riders</h2>
          <p className="text-sm text-gray-500 mt-1">There are currently no riders awaiting approval.</p>
        </div>
      ) : (
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
                <span className="inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                  {rider.status}
                </span>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  <span className="font-medium">Email:</span> {rider.email}
                </p>
                <p>
                  <span className="font-medium">Age:</span> {rider.age}
                </p>
                <p>
                  <span className="font-medium">Region:</span> {rider.region}
                </p>
                <p>
                  <span className="font-medium">District:</span> {rider.district}
                </p>
                <p>
                  <span className="font-medium">Bike Reg No:</span> {rider.bikeRegistration}
                </p>
              </div>

              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => handleActivate(rider._id, rider.email)}
                  className="w-full px-4 py-2 text-sm font-semibold rounded-lg bg-lime-400 text-[#063b3b] hover:bg-lime-500 transition"
                >
                  Activate
                </button>

                <button
                  onClick={() => handleCancel(rider._id)}
                  className="w-full px-4 py-2 text-sm font-semibold rounded-lg bg-red-400 text-white hover:bg-red-500 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingRider;
