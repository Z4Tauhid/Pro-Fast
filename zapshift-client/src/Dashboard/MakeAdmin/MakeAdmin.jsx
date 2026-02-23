import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Shield, UserMinus } from "lucide-react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const MakeAdmin = () => {
  const [search, setSearch] = useState("");
  const axiosSecure = useAxiosSecure();

  const { data: users = [], refetch, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users");
      return res.data;
    },
  });

  const handleRoleChange = (user) => {
    const isAdmin = user.role === "admin";

    Swal.fire({
      title: isAdmin ? "Remove Admin?" : "Make Admin?",
      text: isAdmin
        ? `Remove admin access from ${user.email}?`
        : `Give admin access to ${user.email}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#84cc16",
      cancelButtonColor: "#d33",
      confirmButtonText: isAdmin ? "Yes, remove!" : "Yes, make admin!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (isAdmin) {
          await axiosSecure.patch(`/users/remove-admin/${user._id}`);
        } else {
          await axiosSecure.patch(`/users/admin/${user._id}`);
        }

        refetch();

        Swal.fire({
          title: "Success!",
          text: isAdmin
            ? `${user.email} is no longer admin.`
            : `${user.email} is now an admin.`,
          icon: "success",
        });
      }
    });
  };

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) return <p className="text-center">Loading...</p>;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <h2 className="text-2xl font-bold mb-4 text-[#063b3b]">
        Make Admin
      </h2>

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search by email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead className="bg-gray-100">
            <tr>
              <th>#</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user, index) => {
              const isAdmin = user.role === "admin";

              return (
                <tr key={user._id} className="hover">
                  <td>{index + 1}</td>
                  <td className="font-medium">{user.email}</td>

                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        isAdmin
                          ? "bg-lime-200 text-lime-700"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>

                  <td>
                    <button
                      onClick={() => handleRoleChange(user)}
                      className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm text-white ${
                        isAdmin
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-lime-500 hover:bg-lime-600"
                      }`}
                    >
                      {isAdmin ? <UserMinus size={16} /> : <Shield size={16} />}
                      {isAdmin ? "Remove Admin" : "Make Admin"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <p className="text-center py-6 text-gray-500">
            No users found.
          </p>
        )}
      </div>
    </div>
  );
};

export default MakeAdmin;
