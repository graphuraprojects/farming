import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BookingHistory from "./Pages/bookingHistory/BookingHistory";
import Invoice from "./Pages/bookingHistory/Invoice";
import Listing from "./Pages/FarmerListing/Listing.jsx";
import MachineDetails from "./Pages/FarmerListing/MachineDetails.jsx";
import RateExperience from './Pages/RateExperience';
import RentReview from './Pages/RentReview.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BookingHistory />} />
        <Route path="/invoice" element={<Invoice />} />
        <Route path="/listing" element={<Listing />} />
        <Route path="/machine/:id" element={<MachineDetails />} />
         <Route path="/rate-experience" element={<RateExperience />} />
        <Route path="/rent-review" element={<RentReview />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
