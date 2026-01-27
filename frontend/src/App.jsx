import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RateExperience from './Pages/RateExperience';
import RentReview from './Pages/RentReview.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/rate-experience" element={<RateExperience />} />
        <Route path="/rent-review" element={<RentReview />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
