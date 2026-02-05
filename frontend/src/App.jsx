import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import FarmerLayout from "./layouts/FarmerLayout";
import Register from "./pages/auth/Register";
import Login from "./Pages/auth/Login.jsx"
import VerifyOtp from "./Pages/auth/VerifyOtp.jsx"
import MachineApproval from "./Pages/machineApproval/MachineAppoval.jsx"
import NotFound from "./pages/NotFound";

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
import FarmingDashboard from "./Pages/farmingDashboard/FarmingDashboard.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ✅ Register (NO Navbar / Footer) */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/machine-approval" element={<MachineApproval/>} />

        {/* Redirect root */}
        {/* <Route path="/" element={<Navigate to="/" replace />} /> */}

        {/* Farmer Routes */}
        <Route path="/" element={<FarmerLayout />}>
          <Route index element={<FarmerHome />} />
        </Route>

        <Route path="/machine-listing" element={<FarmerLayout />}>
          <Route index element={<Listing />} />
        </Route>

        <Route path="/machine-details/:id" element={<FarmerLayout />}>
          <Route index element={<MachineDetails />} />
        </Route>

        <Route path="/rate-experience" element={<FarmerLayout />}>
          <Route index element={<RateExperience />} />
        </Route>

        <Route path="/rent-review" element={<FarmerLayout />}>
          <Route index element={<ReviewSuccessPage />} />
        </Route>

        <Route path="/booking-history" element={<FarmerLayout />}>
          <Route index element={<BookingHistory />} />
        </Route>

        <Route path="/booking-conform" element={<FarmerLayout />}>
          <Route index element={<BookingConfirmation />} />
        </Route>
        <Route path="/add-machine" element={<FarmerLayout />}>
          <Route index element={<AddMachine />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
