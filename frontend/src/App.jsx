import "./App.css";
import BookingHistory from "./Pages/bookingHistory/BookingHistory";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Invoice from "./Pages/bookingHistory/Invoice";
import Listing from "./Pages/FarmerListing/Listing.jsx";
import MachineDetails from "./Pages/FarmerListing/MachineDetails.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BookingHistory />} />
        <Route path="/invoice" element={<Invoice />} />
        <Route path="/listing" element={<Listing />} />
        <Route path="/machine/:id" element={<MachineDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
