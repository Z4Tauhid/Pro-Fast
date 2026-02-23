import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";

const RiderTasks = () => {
  const { user } = useAuth();
  const secureAxios = useAxiosSecure();

  const {
    data: tasks = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["riderTasks", user?.email],
    queryFn: async () => {
      const res = await secureAxios.get(`/rider/parcels?email=${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );

  if (error)
    return <p className="text-red-500 text-center">Failed to load tasks</p>;

  const handlePickDelivery = async (id) => {
    try {
      await secureAxios.patch(`/rider/pick/${id}`);
      Swal.fire("Picked!", "Parcel picked successfully", "success");
      refetch();
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Pick failed", "error");
    }
  };

  const handleDelivered = async (id) => {
    try {
      await secureAxios.patch(`/rider/delivered/${id}`);
      Swal.fire("Delivered!", "Parcel delivered successfully", "success");
      refetch();
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Delivery failed", "error");
    }
  };

  // ✅ Empty State
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <img
          src="https://cdn-icons-png.flaticon.com/512/4076/4076503.png"
          alt="empty"
          className="w-28 mb-4 opacity-70"
        />
        <h2 className="text-xl font-semibold text-gray-700">No Assigned Parcels</h2>
        <p className="text-sm text-gray-500 mt-1">
          You have not been assigned any parcels yet.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tasks.map((parcel) => {
        const status = parcel.delivery_status;

        return (
          <div
            key={parcel._id}
            className="bg-white rounded-2xl shadow-lg p-5 flex flex-col justify-between"
          >
            <div>
              <h2 className="font-bold text-lg mb-2">{parcel.parcelName}</h2>
              <p><b>Sender:</b> {parcel.senderName}</p>
              <p><b>Receiver:</b> {parcel.receiverName}</p>
              <p><b>Weight:</b> {parcel.parcelWeight} kg</p>
              <p><b>Type:</b> {parcel.parcelType}</p>
              <p>
                <b>Status:</b>{" "}
                <span className="font-semibold text-blue-600">{status}</span>
              </p>
            </div>

            <div className="flex gap-2 mt-4 flex-wrap">
              <button
                disabled={status !== "In transit"}
                className="btn btn-sm btn-outline btn-success disabled:opacity-40"
                onClick={() => handlePickDelivery(parcel._id)}
              >
                Pick Delivery
              </button>

              <button
                disabled={status !== "Picked"}
                className="btn btn-sm btn-outline btn-success disabled:opacity-40"
                onClick={() => handleDelivered(parcel._id)}
              >
                Delivered
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RiderTasks;
