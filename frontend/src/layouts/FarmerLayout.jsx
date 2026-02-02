import { Outlet } from "react-router-dom";
import FarmerNavbar from "../components/farmer/FarmerNavbar";
import FarmerFooter from "../components/farmer/FarmerFooter";

const FarmerLayout = () => {
  return (
    <>
      <FarmerNavbar />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <FarmerFooter />
    </>
  );
};

export default FarmerLayout;
