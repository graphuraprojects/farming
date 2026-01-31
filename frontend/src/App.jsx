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

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Register (No Layout) */}
        <Route path="/register" element={<Register />} />

        {/* Redirect root */}
        <Route path="/" element={<Navigate to="/farmer" replace />} />

        {/* Farmer Routes */}
        <Route path="/farmer" element={<FarmerLayout />}>
          <Route index element={<FarmerHome />} />
        </Route>

        <Route path="/farmer/machine-listing" element={<FarmerLayout />}>
          <Route index element={<Listing />} />
        </Route>

        <Route path="/farmer/machine-details/:id" element={<FarmerLayout />}>
          <Route index element={<MachineDetails />} />
        </Route>

        <Route path="/farmer/rate-experience" element={<FarmerLayout />}>
          <Route index element={<RateExperience />} />
        </Route>

        <Route path="/farmer/rent-review" element={<FarmerLayout />}>
          <Route index element={<ReviewSuccessPage />} />
        </Route>

        <Route path="/farmer/booking-history" element={<FarmerLayout />}>
          <Route index element={<BookingHistory />} />
        </Route>

        <Route path="/farmer/booking-conform" element={<FarmerLayout />}>
          <Route index element={<BookingConfirmation />} />
        </Route>
        <Route path="/farmer/invoice" element={<FarmerLayout />}>
          <Route index element={<Invoice />} />
        </Route>

        {/* ⭐ 404 Catch All (Must Be Last) */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
