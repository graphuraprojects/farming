import { useEffect, useState } from "react";
import axios from "axios";

const OwnerBookingRequests = () => {
  const [requests, setRequests] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/owner/bookings/pending-requests",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setRequests(res.data);
  };

  const decideBooking = async (id, action) => {
    await axios.patch(
      `http://localhost:5000/api/bookings/${id}/decision`,
      { action },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    fetchRequests();
  };

  return (
    <div>
      <h2>Booking Requests</h2>

      {requests.map((booking) => (
        <div key={booking._id}>
          <h3>{booking.machine_id.machine_name}</h3>
          <p>Farmer: {booking.farmer_id.name}</p>
          <p>Hours: {booking.total_hours}</p>

          <button onClick={() => decideBooking(booking._id, "accept")}>
            Accept
          </button>

          <button onClick={() => decideBooking(booking._id, "reject")}>
            Reject
          </button>
        </div>
      ))}
    </div>
  );
};

export default OwnerBookingRequests;
