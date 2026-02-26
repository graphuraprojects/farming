import { Outlet } from "react-router-dom";
import { color } from "../theme";

const AdminLayout = () => {
  return (
    <div className="flex">
      {/* Admin Sidebar Here */}
      <div
        className="w-64 text-white min-h-screen p-4"
        style={{ background: `linear-gradient(180deg, ${color.deepForest} 0%, ${color.forest} 100%)` }}
      >
        Admin Panel
      </div>

      {/* Page Content */}
      <div className="flex-1 p-6" style={{ background: color.bg }}>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
