import "./App.css";
import BookingHistory from "./Pages/bookingHistory/BookingHistory";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Invoice from "./Pages/bookingHistory/Invoice";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BookingHistory />} />
        <Route path="/invoice" element={<Invoice />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
