
import { FaBoxOpen, FaEnvelope, FaUserShield } from "react-icons/fa";
import useAuth from "../../Hooks/useAuth";

const UserDashBoard = () => {
  const { user } = useAuth();

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-2xl md:text-3xl font-bold mb-6">
        User Dashboard
      </h2>

      {/* PROFILE HEADER */}
      <div className="bg-gradient-to-r from-lime-200 to-lime-400 rounded-2xl p-6 shadow-lg flex flex-col md:flex-row items-center gap-6">
        <img
          src={user?.photoURL || "https://i.ibb.co/2YtqZJx/user.png"}
          alt="user"
          className="w-28 h-28 rounded-full border-4 border-white shadow"
        />

        <div className="text-center md:text-left">
          <h3 className="text-2xl font-bold">{user?.displayName}</h3>
          <p className="flex items-center justify-center md:justify-start gap-2 mt-1">
            <FaEnvelope /> {user?.email}
          </p>
        </div>
      </div>

      {/* INFO CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        
        {/* PARCEL STATS */}
        <div className="card bg-white shadow-xl rounded-2xl p-6 hover:scale-[1.02] transition">
          <FaBoxOpen className="text-3xl text-lime-500 mb-3" />
          <h4 className="font-semibold text-lg">My Parcels</h4>
          <p className="text-sm text-gray-500 mt-2">
            Track and manage all your parcel shipments easily.
          </p>
        </div>

        <div className="card bg-white shadow-xl rounded-2xl p-6 hover:scale-[1.02] transition">
          <FaEnvelope className="text-3xl text-lime-500 mb-3" />
          <h4 className="font-semibold text-lg">Email</h4>
          <p className="text-sm text-gray-500 mt-2">
            {user?.email}
          </p>
        </div>

        <div className="card bg-white shadow-xl rounded-2xl p-6 hover:scale-[1.02] transition">
          <FaUserShield className="text-3xl text-lime-500 mb-3" />
          <h4 className="font-semibold text-lg">Account Status</h4>
          <p className="text-sm text-gray-500 mt-2">
            Active User Account
          </p>
        </div>
      </div>

      {/* EXTRA VISUAL SECTION */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow p-6">
          <h4 className="font-semibold mb-3">Welcome 🎉</h4>
          <p className="text-gray-500 text-sm leading-relaxed">
            From here you can track your parcels, manage deliveries, and
            control your account. Your dashboard gives you a quick snapshot
            of everything important.
          </p>
        </div>

        <div className="bg-gradient-to-r from-lime-300 to-lime-500 rounded-2xl shadow p-6 text-white">
          <h4 className="font-semibold mb-3">Quick Tips 🚀</h4>
          <ul className="text-sm space-y-2">
            <li>✔ Track parcels in real time</li>
            <li>✔ Secure payments</li>
            <li>✔ Rider assignment updates</li>
            <li>✔ Delivery history</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserDashBoard;
