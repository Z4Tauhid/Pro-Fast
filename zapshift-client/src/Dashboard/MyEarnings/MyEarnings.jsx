import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { FaWallet, FaCalendarDay, FaCalendarAlt, FaTruck } from "react-icons/fa";
import Swal from "sweetalert2";

const MyEarnings = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  // Fetch completed deliveries
  const { data: deliveries = [], isLoading, refetch } = useQuery({
    queryKey: ["completed-earnings", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/rider/completed?email=${user?.email}`);
      return res.data;
    },
  });

  // Calculate earnings
  const stats = useMemo(() => {
    const today = new Date().toDateString();

    let total = 0;
    let todayTotal = 0;
    let monthTotal = 0;
    let available = 0;

    deliveries.forEach((p) => {
      const earn = p.cost * 0.35;
      total += earn;

      if (!p.paidToRider) {
        available += earn;
      }

      const date = new Date(p.creation_date);
      const isToday = date.toDateString() === today;
      const isThisMonth =
        date.getMonth() === new Date().getMonth() &&
        date.getFullYear() === new Date().getFullYear();

      if (isToday) todayTotal += earn;
      if (isThisMonth) monthTotal += earn;
    });

    return {
      total,
      todayTotal,
      monthTotal,
      available,
      count: deliveries.length,
    };
  }, [deliveries]);

  const handleCashout = () => {
    if (stats.available <= 0) {
      return Swal.fire("No Balance", "No earnings available", "info");
    }

    Swal.fire({
      title: "Cashout?",
      text: `You will cashout €${stats.available.toFixed(2)}`,
      icon: "question",
      showCancelButton: true,
    }).then(async (res) => {
      if (res.isConfirmed) {
        await axiosSecure.patch("/rider/cashout");
        Swal.fire("Success", "Cashout completed", "success");
        refetch();
      }
    });
  };

  if (isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>;
  }

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-2xl font-bold mb-6">My Earnings</h2>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card
          title="Total Earnings"
          value={`€${stats.total.toFixed(2)}`}
          icon={<FaWallet />}
        />
        <Card
          title="Today"
          value={`€${stats.todayTotal.toFixed(2)}`}
          icon={<FaCalendarDay />}
        />
        <Card
          title="This Month"
          value={`€${stats.monthTotal.toFixed(2)}`}
          icon={<FaCalendarAlt />}
        />
        <Card
          title="Deliveries"
          value={stats.count}
          icon={<FaTruck />}
        />
      </div>

      {/* GRAPH */}
      <div className="bg-white mt-8 p-6 rounded-2xl shadow">
        <h3 className="font-semibold mb-4">Balance Overview</h3>

        <div className="space-y-4">
          <Bar label="Available" value={stats.available} max={stats.total || 1} />
          <Bar
            label="Cashed Out"
            value={stats.total - stats.available}
            max={stats.total || 1}
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
          <p className="font-semibold">
            Available Balance: €{stats.available.toFixed(2)}
          </p>

          <button
            onClick={handleCashout}
            className="btn bg-lime-400 hover:bg-lime-500"
          >
            Cashout
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyEarnings;

// ---------------- COMPONENTS ----------------

const Card = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-2xl shadow hover:scale-[1.02] transition">
    <div className="flex items-center gap-3 text-lime-500 text-2xl mb-2">
      {icon}
    </div>
    <h4 className="text-sm text-gray-500">{title}</h4>
    <p className="text-2xl font-bold mt-1">{value}</p>
  </div>
);

const Bar = ({ label, value, max }) => {
  const percent = Math.min((value / max) * 100, 100);

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span>{label}</span>
        <span>€{value.toFixed(2)}</span>
      </div>

      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-lime-400 transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};
