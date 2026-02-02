import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import FarmerLayout from "./layouts/FarmerLayout";
import Register from "./pages/auth/Register";
import NotFound from "./pages/NotFound";

// Farmer Pages
import FarmerHome from "./pages/FarmerHome";
import Listing from "./pages/FarmerListing/Listing.jsx";
import RateExperience from "./pages/RateExperience.jsx";
import ReviewSuccessPage from "./pages/RentReview.jsx";
import MachineDetails from "./pages/FarmerListing/MachineDetails.jsx";
import BookingHistory from "./pages/bookngHistory/BookingHistory.jsx";
import BookingConfirmation from "./pages/bookingConform/BookingConfirmation.jsx";
import Invoice from "./pages/bookngHistory/Invoice.jsx";
import AddMachine from "./pages/addMachine/AddMachine.jsx";
import Login from "./pages/auth/Login.jsx";
import VerifyOtp from "./pages/auth/verifyOtp.jsx";
import MachineApproval from "./Pages/machineApproval/MachineAppoval.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Register (No Layout) */}
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
        <Route path="/invoice" element={<FarmerLayout />}>
          <Route index element={<Invoice />} />
        </Route>
        <Route path="/add-machine" element={<FarmerLayout />}>
          <Route index element={<AddMachine />} />
        </Route>

        {/* ⭐ 404 Catch All (Must Be Last) */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
