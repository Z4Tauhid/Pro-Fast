import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";

const AssignRider = () => {
  const axiosSecure = useAxiosSecure();
  const [open, setOpen] = useState(false);
  const [selectedParcel, setSelectedParcel] = useState(null);

  // Load parcels
  const {
    data: parcels = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["assign-parcels"],
    queryFn: async () => {
      const res = await axiosSecure.get("/assign-parcels");
      return res.data;
    },
  });

  // Load riders when modal open
  const { data: riders = [] } = useQuery({
    queryKey: ["available-riders"],
    enabled: open,
    queryFn: async () => {
      const res = await axiosSecure.get("/available-riders");
      return res.data;
    },
  });

  const handleAssign = async (rider) => {
    try {
      await axiosSecure.patch(`/assign-rider/${selectedParcel._id}`, {
        riderId: rider._id,
        riderEmail: rider.email,
        riderName: rider.name,
      });

      Swal.fire("Assigned!", "Rider assigned successfully", "success");
      setOpen(false);
      setSelectedParcel(null);
      refetch();
    } catch (error) {
      Swal.fire("Error", error.response?.data?.message || "Failed to assign", "error");
    }
  };

  if (isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>;
  }

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-2xl font-bold mb-6">
        Assign Rider ({parcels.length})
      </h2>

      {/* TABLE (LG+) */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Tracking</th>
              <th>Sender</th>
              <th>Receiver</th>
              <th>Status</th>
              <th>Assign</th>
            </tr>
          </thead>
          <tbody>
            {parcels.map((p, i) => (
              <tr key={p._id}>
                <td>{i + 1}</td>
                <td>{p.tracking_ID}</td>
                <td>{p.senderName}</td>
                <td>{p.receiverName}</td>
                <td>
                  <span
                    className={`font-semibold ${
                      p.delivery_status === "In transit"
                        ? "text-blue-600"
                        : "text-gray-600"
                    }`}
                  >
                    {p.delivery_status}
                  </span>
                </td>
                <td>
                  {p.assignedRider ? (
                    <span className="text-sm font-semibold text-green-600">
                      Assigned to {p.assignedRider.riderName}
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedParcel(p);
                        setOpen(true);
                      }}
                      className="btn btn-sm bg-lime-400"
                    >
                      Assign Rider
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CARDS (SM / MD) */}
      <div className="lg:hidden grid gap-4">
        {parcels.map((p) => (
          <div key={p._id} className="p-4 border rounded-lg shadow-sm">
            <p>
              <b>Tracking:</b> {p.tracking_ID}
            </p>
            <p>
              <b>Sender:</b> {p.senderName}
            </p>
            <p>
              <b>Receiver:</b> {p.receiverName}
            </p>
            <p>
              <b>Status:</b>{" "}
              <span className="font-semibold">{p.delivery_status}</span>
            </p>

            {p.assignedRider ? (
              <p className="text-green-600 font-semibold mt-2">
                Assigned to {p.assignedRider.riderName}
              </p>
            ) : (
              <button
                onClick={() => {
                  setSelectedParcel(p);
                  setOpen(true);
                }}
                className="btn btn-sm bg-lime-400 w-full mt-3"
              >
                Assign Rider
              </button>
            )}
          </div>
        ))}
      </div>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-5 w-full max-w-lg">
            <h3 className="text-lg font-bold mb-4">Select Rider</h3>

            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {riders.map((r) => (
                <div
                  key={r._id}
                  className="flex items-center gap-3 border p-2 rounded"
                >
                  <img
                    src={r.photoURL}
                    className="w-10 h-10 rounded-full"
                    alt=""
                  />
                  <div className="flex-1">
                    <p className="font-semibold">{r.name}</p>
                    <p className="text-xs">{r.region}</p>
                  </div>
                  <button
                    onClick={() => handleAssign(r)}
                    className="btn btn-xs bg-lime-400"
                  >
                    Assign
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                setOpen(false);
                setSelectedParcel(null);
              }}
              className="btn btn-sm btn-outline w-full mt-4"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignRider;
