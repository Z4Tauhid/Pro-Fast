
import { FaBoxOpen, FaEnvelope, FaUserShield } from "react-icons/fa";
import useAuth from "../../Hooks/useAuth";

const RiderDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-2xl md:text-3xl font-bold mb-6">
        Rider Dashboard
      </h2>

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <div className="card bg-white shadow-xl rounded-2xl p-6 hover:scale-[1.02] transition">
          <FaBoxOpen className="text-3xl text-lime-500 mb-3" />
          <h4 className="font-semibold text-lg">My Deliveries</h4>
          <p className="text-sm text-gray-500 mt-2">
            Manage assigned and completed deliveries.
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
          <h4 className="font-semibold text-lg">Rider Status</h4>
          <p className="text-sm text-gray-500 mt-2">
            Active Rider Account
          </p>
        </div>
      </div>
    </div>
  );
};

export default RiderDashboard;
