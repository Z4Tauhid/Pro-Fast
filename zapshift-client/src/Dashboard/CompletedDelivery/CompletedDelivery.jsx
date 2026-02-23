import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useAuth from "../../Hooks/useAuth";

const CompletedDelivery = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: parcels = [], isLoading } = useQuery({
    queryKey: ["completedDeliveries", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/rider/completed?email=${user.email}`);
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // ✅ Empty state
  if (parcels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <img
          src="https://cdn-icons-png.flaticon.com/512/4076/4076503.png"
          alt="empty"
          className="w-28 mb-4 opacity-70"
        />
        <h2 className="text-xl font-semibold text-gray-700">
          No Completed Deliveries
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          You have not completed any deliveries yet.
        </p>
      </div>
    );
  }

  // ✅ Calculate earnings
  const calculateEarning = (cost) => Number(cost) * 0.35;

  const totalEarnings = parcels.reduce(
    (sum, p) => sum + calculateEarning(p.cost),
    0
  );

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-2xl font-bold mb-6">
        Completed Deliveries ({parcels.length})
      </h2>

      {/* TABLE FOR DESKTOP */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Tracking</th>
              <th>Sender</th>
              <th>Receiver</th>
              <th>Cost</th>
              <th>Earning (35%)</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {parcels.map((p, i) => (
              <tr key={p._id}>
                <td>{i + 1}</td>
                <td>{p.tracking_ID}</td>
                <td>{p.senderName}</td>
                <td>{p.receiverName}</td>
                <td>${p.cost}</td>
                <td className="font-semibold text-green-600">
                  ${calculateEarning(p.cost).toFixed(2)}
                </td>
                <td className="text-green-600 font-semibold">
                  {p.delivery_status}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="5" className="text-right font-bold">
                Total Earnings
              </td>
              <td className="font-bold text-green-700">
                ${totalEarnings.toFixed(2)}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* CARDS FOR MOBILE */}
      <div className="lg:hidden grid gap-4">
        {parcels.map((p) => (
          <div
            key={p._id}
            className="border rounded-xl p-4 shadow bg-white"
          >
            <p><b>Tracking:</b> {p.tracking_ID}</p>
            <p><b>Sender:</b> {p.senderName}</p>
            <p><b>Receiver:</b> {p.receiverName}</p>
            <p><b>Cost:</b> ${p.cost}</p>
            <p className="text-lime-500 font-semibold">
              Earning: ${calculateEarning(p.cost).toFixed(2)}
            </p>
            <p className="text-lime-500 font-semibold mt-1">
              Status: {p.delivery_status}
            </p>
          </div>
        ))}

        {/* MOBILE TOTAL */}
        {parcels.length > 0 && (
          <div className="border rounded-xl p-4 bg-green-50">
            <p className="font-bold text-lg">
              Total Earnings: ${totalEarnings.toFixed(2)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompletedDelivery;
