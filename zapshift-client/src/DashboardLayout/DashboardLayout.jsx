import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router";
import {
  Menu,
  X,
  Home,
  Package,
  User,
  Settings,
  CreditCard,
  Truck,
  UserCheck,
  Bike,
  UserRoundPen,
  ListChecks,
  CalendarCheck2,
  CircleDollarSign,
  ArrowLeft,
  LogOut,
} from "lucide-react";
import useCheckRole from "../Hooks/useCheckRole";
import useAuth from "../Hooks/useAuth";

const DashboardLayout = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logOut } = useAuth();

  const { role, roleLoading } = useCheckRole();

  if (roleLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  const handleLogout = () => {
    logOut().then(() => {
      navigate("/");
    });
  };

  const navClass = ({ isActive }) =>
    `relative block ${
      isActive
        ? "text-lime-500 after:absolute after:left-4 after:-bottom-1 after:h-[3px] after:w-[70%] after:bg-lime-400 after:rounded"
        : "hover:text-lime-500"
    }`;

  const dasItems = (
    <>
      <NavLink to={"/dashboard"} end className={navClass}>
        <SidebarItem icon={<Home className="text-lime-500" size={22} />} label="Dashboard" />
      </NavLink>

      <NavLink to={"/dashboard/myParcel"} className={navClass}>
        <SidebarItem icon={<Package className="text-lime-500" size={22} />} label="My Parcels" />
      </NavLink>

      <NavLink to={"/dashboard/paymenthistory"} className={navClass}>
        <SidebarItem icon={<CreditCard className="text-lime-500" size={22} />} label="Payment History" />
      </NavLink>

      <NavLink to={"/dashboard/parcelTracking"} className={navClass}>
        <SidebarItem icon={<Truck className="text-lime-500" size={22} />} label="Track Your Parcel" />
      </NavLink>

      {role === "admin" && (
        <>
          <NavLink to={"/dashboard/pendingRider"} className={navClass}>
            <SidebarItem icon={<UserCheck className="text-red-400" size={22} />} label="Pending Riders" />
          </NavLink>

          <NavLink to={"/dashboard/activeRider"} className={navClass}>
            <SidebarItem icon={<Bike className="text-lime-500" size={22} />} label="Active Riders" />
          </NavLink>

          <NavLink to={"/dashboard/makeAdmin"} className={navClass}>
            <SidebarItem icon={<User className="text-lime-500" size={22} />} label="Admin" />
          </NavLink>

          <NavLink to={"/dashboard/assignRider"} className={navClass}>
            <SidebarItem icon={<UserRoundPen className="text-lime-500" size={22} />} label="Assign Rider" />
          </NavLink>
        </>
      )}

      {role === "rider" && (
        <>
          <NavLink to={"/dashboard/myTasks"} className={navClass}>
            <SidebarItem icon={<CalendarCheck2 className="text-lime-500" size={22} />} label="My Tasks" />
          </NavLink>

          <NavLink to={"/dashboard/completeDelivery"} className={navClass}>
            <SidebarItem icon={<ListChecks className="text-lime-500" size={22} />} label="Completed Delivery" />
          </NavLink>

          <NavLink to={"/dashboard/myEarnings"} className={navClass}>
            <SidebarItem icon={<CircleDollarSign className="text-lime-500" size={22} />} label="My Earnings" />
          </NavLink>
        </>
      )}

      
    </>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navbar */}
      <div className="sticky top-0 z-50 bg-base-100 shadow">
        <div className="navbar px-4">
          <div className="navbar-start flex items-center gap-2">
            <NavLink to={"/"} className="flex items-center gap-1">
              <img className="w-8 sm:w-9" src="../../../assets/logo.png" alt="" />
              <p className="text-xl sm:text-2xl font-extrabold">Profast</p>
            </NavLink>
          </div>

          <div className="navbar-end flex items-center gap-2">
            <button
              onClick={() => navigate(-1)}
              className="btn btn-sm bg-gray-200 hover:bg-gray-300 flex items-center gap-1"
            >
              <ArrowLeft size={16} />
              Back
            </button>

            <NavLink
              to="/"
              className="btn btn-sm bg-lime-400 hover:bg-lime-500 flex items-center gap-1"
            >
              <Home size={16} />
              Home
            </NavLink>

            {user && (
              <button
                onClick={handleLogout}
                className="btn btn-sm bg-red-400 hover:bg-red-500 text-white flex items-center gap-1"
              >
                <LogOut size={16} />
                Logout
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar Desktop */}
        <aside className="hidden md:flex w-64 min-h-[calc(100vh-64px)] bg-gray-100 shadow-2xl rounded-r-2xl">
          <div className="w-full">
            <div className="px-6 py-4 text-lg font-semibold border-b">
              Dashboard Menu
            </div>

            <nav className="p-4 space-y-2">{dasItems}</nav>
          </div>
        </aside>

        {/* Mobile Drawer */}
        {open && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setOpen(false)}
            />

            <aside className="relative w-64 h-full bg-gray-100 shadow-2xl rounded-r-2xl">
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <span className="font-semibold">Dashboard Menu</span>
                <X className="cursor-pointer" onClick={() => setOpen(false)} />
              </div>

              <nav className="p-4 space-y-2">{dasItems}</nav>
            </aside>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="md:hidden mb-4">
            <button
              onClick={() => setOpen(true)}
              className="flex items-center gap-2 text-[#063b3b] font-medium"
            >
              <Menu size={20} />
              Menu
            </button>
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  );
};

const SidebarItem = ({ icon, label }) => {
  return (
    <button className="flex items-center gap-3 w-full px-4 py-2 rounded-lg hover:bg-white/10 transition text-sm">
      {icon}
      {label}
    </button>
  );
};

export default DashboardLayout;
