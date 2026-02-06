import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex">
      {/* Admin Sidebar Here */}
      <div className="w-64 bg-gray-900 text-white min-h-screen p-4">
        Admin Panel
      </div>

      {/* Page Content */}
      <div className="flex-1 p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
