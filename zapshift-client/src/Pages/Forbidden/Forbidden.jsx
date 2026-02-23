import { Link } from "react-router";
import { ShieldX } from "lucide-react";

const Forbidden = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <ShieldX size={80} className="text-red-500 mb-4" />

      <h1 className="text-4xl font-bold text-gray-800 mb-2">
        Access Forbidden
      </h1>

      <p className="text-gray-600 mb-6 text-center max-w-md">
        You don’t have permission to access this page.  
        Please contact the administrator if you believe this is a mistake.
      </p>

      <Link
        to="/"
        className="px-6 py-2 bg-lime-500 hover:bg-lime-600 text-white rounded-lg"
      >
        Go Home
      </Link>
    </div>
  );
};

export default Forbidden;
