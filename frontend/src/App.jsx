import { BrowserRouter, Routes, Route } from "react-router-dom";

import FarmerLayout from "./layouts/FarmerLayout";
import Register from "./pages/auth/Register";
import Login from "./Pages/auth/Login.jsx";
import VerifyOtp from "./Pages/auth/VerifyOtp.jsx";
import MachineApproval from "./Admin/MachineAppoval.jsx";
import NotFound from "./pages/NotFound";

// ✅ Admin Dashboard
import AdminDashboard from "./Admin/AdminDashboard.jsx";

// Farmer Pages
import FarmerHome from "./pages/FarmerHome";
import Listing from "./pages/FarmerListing/Listing.jsx";
import RateExperience from "./pages/RateExperience.jsx";
import ReviewSuccessPage from "./pages/RentReview.jsx";
import MachineDetails from "./pages/FarmerListing/MachineDetails.jsx";
import BookingHistory from "./pages/bookngHistory/BookingHistory.jsx";
import BookingConfirmation from "./pages/bookingConform/BookingConfirmation.jsx";
import AddMachine from "./pages/addMachine/AddMachine.jsx";
import Invoice from "./Pages/bookngHistory/Invoice.jsx";
import ApprovalList from "./Admin/ApprovalList.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* AUTH */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />

        {/* ADMIN TEST ROUTES */}
        <Route path="/machine-approval" element={<MachineApproval />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="farmer-dashboard" element={<ApprovalList />} />

        {/* FARMER ROUTES */}
        <Route path="/" element={<FarmerLayout />}>
          <Route index element={<FarmerHome />} />
          <Route path="machine-listing" element={<Listing />} />
          <Route path="machine-details/:id" element={<MachineDetails />} />
          <Route path="rate-experience" element={<RateExperience />} />
          <Route path="rent-review" element={<ReviewSuccessPage />} />
          <Route path="booking-history" element={<BookingHistory />} />
          <Route path="booking-conform" element={<BookingConfirmation />} />
          <Route path="add-machine" element={<AddMachine />} />
          <Route path="invoice" element={<Invoice />} />
        </Route>

        {/* NOT FOUND */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
