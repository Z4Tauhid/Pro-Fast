import {
  FaUsers,
  FaTruck,
  FaMoneyBillWave,
  FaUserShield,
} from "react-icons/fa";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#84cc16", "#22c55e", "#4ade80", "#a3e635"];

const AdminDashboard = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: stats = {} } = useQuery({
    queryKey: ["adminStats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/stats");
      return res.data;
    },
  });

  const { data: revenue = [] } = useQuery({
    queryKey: ["adminRevenue"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/revenue-chart");
      return res.data;
    },
  });

  const { data: parcelStatus = [] } = useQuery({
    queryKey: ["adminParcelStatus"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/parcel-status-chart");
      return res.data;
    },
  });

  return (
    <div className="p-4 md:p-6 space-y-10">
      <h2 className="text-3xl font-bold">Admin Dashboard</h2>

      {/* PROFILE */}
      <div className="bg-gradient-to-r from-lime-200 to-lime-400 rounded-2xl p-6 shadow-lg flex flex-col md:flex-row items-center gap-6">
        <img
          src={user?.photoURL || "https://i.ibb.co/2YtqZJx/user.png"}
          alt="user"
          className="w-28 h-28 rounded-full border-4 border-white shadow"
        />

        <div>
          <h3 className="text-2xl font-bold">{user?.displayName}</h3>
          <p className="opacity-80">{user?.email}</p>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Income" value={`$${stats.totalIncome}`} icon={<FaMoneyBillWave />} />
        <StatCard title="Users" value={stats.totalUsers} icon={<FaUsers />} />
        <StatCard title="Riders" value={stats.totalRiders} icon={<FaTruck />} />
        <StatCard title="Delivered" value={stats.deliveredParcels} icon={<FaUserShield />} />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* PIE */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h4 className="font-semibold mb-4">Parcel Status</h4>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={parcelStatus}
                dataKey="total"
                nameKey="_id"
                cx="50%"
                cy="50%"
                outerRadius={110}
                label
              >
                {parcelStatus.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* LINE */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h4 className="font-semibold mb-4">Revenue Growth</h4>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#84cc16"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* TOP RIDER */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h4 className="font-semibold mb-2">Top Rider</h4>

        {stats.topRider ? (
          <p className="text-lg">
            🏆 {stats.topRider._id} — {stats.topRider.delivered} Deliveries
          </p>
        ) : (
          <p>No data yet</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

// -------------------

const StatCard = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-2xl shadow hover:scale-[1.03] transition">
    <div className="text-lime-500 text-3xl mb-3">{icon}</div>
    <p className="text-sm text-gray-500">{title}</p>
    <h3 className="text-2xl font-bold">{value}</h3>
  </div>
);
