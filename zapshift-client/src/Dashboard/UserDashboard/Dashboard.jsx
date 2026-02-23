

import UserDashboard from "./UserDashBoard";

import AdminDashboard from "./AdminDashboard";
import useAuth from "../../Hooks/useAuth";
import useCheckRole from "../../Hooks/useCheckRole";
import RiderDashboard from "./RiderDashBoard";

const Dashboard = () => {
  const { user, loading } = useAuth();
  const { role, roleLoading } = useCheckRole();

  // ⏳ Loading State
  if (loading || roleLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // 🔐 Not logged in fallback
  if (!user) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl font-semibold">Please login first</h2>
      </div>
    );
  }

  // ✅ Role Based Render
  if (role === "admin") {
    return <AdminDashboard />;
  }

  if (role === "rider") {
    return <RiderDashboard />;
  }

  // default = user
  return <UserDashboard />;
};

export default Dashboard;
