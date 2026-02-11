import ScrollToTop from "./components/ScrollToTop.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import FarmerLayout from "./layouts/FarmerLayout";
import Register from "./pages/auth/Register";
import Login from "./Pages/auth/Login.jsx";
import VerifyOtp from "./Pages/auth/VerifyOtp.jsx";
import MachineApproval from "./Admin/MachineAppoval.jsx";
import NotFound from "./pages/NotFound";
import AdminRegister from "./Admin/AdminRegister.jsx";

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
// import ApprovalList from "./Admin/ApprovalList.jsx";
import TermsAndConditions from "./Pages/Terns&Condition.jsx";
import PrivacyPolicy from "./Pages/PrivacyPolicy.jsx";
import AboutUs from "./Pages/about/AboutUs.jsx";
import Profile from "./Pages/profile/Profile.jsx";
import OwnerDashboard from "./owner/OwnerDashboard.jsx";
import WithdrwaEarnings from "./Pages/Withdrawal/WithdrawEarnings.jsx";
import WithdrwalSuccess from "./Pages/Withdrawal/WithdrawalSuccess.jsx";
import Contact from "./Pages/contact/Contact.jsx";
import Checkout from "./Pages/checkoutPage/Checkout.jsx";
import FarmerDashboard from "./Pages/FarmerDashboard.jsx";
import ProtectedOwner from "./components/ProtectedOwner.jsx";
import ProtectedFarmer from "./components/ProtectedFarmer.jsx";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* AUTH */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />

        {/* ADMIN TEST ROUTES */}
        <Route path="/admin/machines/:id" element={<MachineApproval />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/register" element={<AdminRegister />} />
        {/* <Route path="/appList" element={<ApprovalList />} /> */}

        {/* FARMER ROUTES */}
        <Route path="/" element={<FarmerLayout />}>
          <Route index element={<FarmerHome />} />
          <Route path="machine-listing" element={<Listing />} />
          <Route path="machine-details/:id" element={<MachineDetails />} />
          <Route path="rate-experience" element={<RateExperience />} />
          <Route path="rent-review" element={<ReviewSuccessPage />} />
          <Route path="booking-history" element={<ProtectedFarmer allowedRoles={["farmer","admin"]}> <BookingHistory /></ProtectedFarmer>} />
          <Route path="booking-conform" element={<BookingConfirmation />} />
          <Route
            path="booking-confirmation/:orderId"
            element={<BookingConfirmation />}
          />

          <Route
            path="/add-machine"
            element={
              <ProtectedOwner allowedRoles={["owner", "admin"]}>
                <AddMachine />
              </ProtectedOwner>
            }
          />
          <Route path="/invoice/:bookingId" element={<Invoice />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/owner-dashboard" element={<OwnerDashboard />} />
          {/* <Route path="/about-us" element={<AboutUs />} /> */}
          <Route path="/withdrawl" element={<WithdrwaEarnings />} />
          <Route path="/withdrawl-success" element={<WithdrwalSuccess />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/farmer-dashboard" element={<FarmerDashboard />} />
        </Route>

        <Route path="/T&C" element={<TermsAndConditions />} />
        <Route path="/P" element={<PrivacyPolicy />} />

        {/* NOT FOUND */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
