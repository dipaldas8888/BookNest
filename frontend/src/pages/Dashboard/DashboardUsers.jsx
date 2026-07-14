import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import endpoints from "../../api/endpoints";
import { Trash2, Shield, User, Loader2, AlertCircle, Check, ChevronLeft, ChevronRight } from "lucide-react";

const ITEMS_PER_PAGE = 5;

const DashboardUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await API.get(endpoints.users.all);
      setUsers(res.data.users || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      setSuccessMessage("");
      const res = await API.put(endpoints.users.updateRole(userId), { role: newRole });
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );
      setSuccessMessage(res.data.message || "User role updated successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update role");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      setSuccessMessage("");
      const res = await API.delete(endpoints.users.delete(userId));
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      setSuccessMessage(res.data.message || "User deleted successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user");
    }
  };

  // Pagination Logic
  const totalItems = users.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);
  const paginatedUsers = users.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 animate-fadeIn">
        <Loader2 className="w-10 h-10 animate-spin text-[#0284c7]" />
        <span className="text-gray-500 font-semibold text-sm">Fetching users...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slideUp">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">User Management</h1>
        <p className="text-gray-500 text-xs mt-1">
          Manage your store users, assign administrative rights, and delete user accounts.
        </p>
      </div>

      {successMessage && (
        <div className="p-4 text-xs font-bold text-green-700 bg-green-50 rounded-xl border border-green-100 flex items-center gap-2">
          <Check className="w-4.5 h-4.5" />
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="p-4 text-xs text-red-700 bg-red-50 rounded-xl border border-red-100 flex items-center gap-2">
          <AlertCircle className="w-4.5 h-4.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-150">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-450 font-bold uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold text-gray-500">User Profile</th>
                <th className="px-6 py-4 font-semibold text-gray-500">Email Address</th>
                <th className="px-6 py-4 font-semibold text-gray-500">Access Role</th>
                <th className="px-6 py-4 font-semibold text-gray-500">Joined Date</th>
                <th className="px-6 py-4 font-semibold text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginatedUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50/20 transition duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                        user.role === "admin" 
                          ? "bg-sky-50 text-[#0284c7] border border-sky-100" 
                          : "bg-gray-100 text-gray-700 border border-gray-200"
                      }`}>
                        {user.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-sm">{user.name}</div>
                        <div className="text-[10px] text-gray-400">ID: {user._id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500 font-semibold">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {user.role === "admin" ? (
                        <Shield className="w-4 h-4 text-[#0284c7]" />
                      ) : (
                        <User className="w-4 h-4 text-gray-400" />
                      )}
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                        className={`text-[10px] font-black uppercase rounded-full px-3 py-1 border focus:outline-none focus:ring-2 focus:ring-sky-500/20 cursor-pointer ${
                          user.role === "admin"
                            ? "bg-sky-50 text-[#0284c7] border-sky-200"
                            : "bg-gray-50 text-gray-600 border-gray-200"
                        }`}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500 font-medium">
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="text-red-500 hover:text-red-700 transition duration-150 p-2 rounded-xl hover:bg-red-50 cursor-pointer"
                      title="Delete User"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {paginatedUsers.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-gray-400 font-bold">
                    No registered users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="bg-white px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <div className="text-xs text-gray-500 font-semibold">
              Showing <span className="font-black text-gray-900">{startIndex + 1}</span> to{" "}
              <span className="font-black text-gray-900">{endIndex}</span> of{" "}
              <span className="font-black text-gray-900">{totalItems}</span> users
            </div>
            <div className="flex items-center gap-1.5">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4 text-gray-650" />
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded-xl font-bold transition text-xs border ${
                    currentPage === i + 1
                      ? "bg-[#0284c7] border-[#0284c7] text-white"
                      : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                  } cursor-pointer`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronRight className="w-4 h-4 text-gray-650" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardUsers;
