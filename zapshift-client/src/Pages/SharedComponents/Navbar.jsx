import React from 'react';
import { NavLink } from 'react-router';
import useAuth from '../../Hooks/useAuth';

const Navbar = () => {
  const { user, logOut } = useAuth();

  const navItems = (
    <>
      {[
        { to: "/", label: "Home" },
        { to: "/coverage", label: "Coverage" },
        { to: "/sendParcel", label: "Send Parcel" },
        user && { to: "/dashboard", label: "Dashboard" },
        { to: "/beARider", label: "Be A Rider" },
      ]
        .filter(Boolean)
        .map((item, i) => (
          <li key={i}>
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                `relative px-2 py-1 transition-all ${
                  isActive
                    ? "after:absolute after:left-0 after:-bottom-1 after:h-[3px] after:w-full after:bg-lime-400 after:rounded"
                    : "hover:text-lime-500"
                }`
              }
            >
              {item.label}
            </NavLink>
          </li>
        ))}
    </>
  );

  const handleLogout = () => {
    logOut().then(() => {});
  };

  return (
    <div className="sticky top-0 z-50 w-full bg-base-100 ">
      <div className="navbar mb-2 px-2 sm:px-4 md:px-6">
        {/* START */}
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow"
            >
              {navItems}
            </ul>
          </div>

          <div className="flex items-center gap-2">
            <img
              className="w-8 sm:w-9 md:w-10"
              src="/logo.png"
              alt="logo"
            />
            <p className="text-xl sm:text-2xl md:text-3xl font-extrabold">
              Profast
            </p>
          </div>
        </div>

        {/* CENTER */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">{navItems}</ul>
        </div>

        {/* END */}
        <div className="navbar-end flex items-center gap-3">
          {user ? (
            <>
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                  <div className="w-9 sm:w-10 rounded-full ring ring-lime-400 ring-offset-base-100 ring-offset-2">
                    <img
                      src={user?.photoURL || "https://i.ibb.co/2Fsd1YQ/user.png"}
                      alt="user"
                    />
                  </div>
                </label>

                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-40"
                >
                  <li className="lg:hidden">
                    <button onClick={handleLogout}>Logout</button>
                  </li>
                </ul>
              </div>

              <div className="hidden lg:block">
                <button onClick={handleLogout} className="btn bg-lime-400">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <NavLink to="/login" className="btn bg-lime-400">
              Login
            </NavLink>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
