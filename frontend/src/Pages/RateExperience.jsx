import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaStar,FaCamera, FaTimes} from "react-icons/fa";

function StarRating({ rating, setRating }) {
  return (
    <div className="flex justify-center gap-1 sm:gap-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          onClick={() => setRating(i)}
          className={`text-2xl sm:text-3xl transition-all duration-200 transform hover:scale-110 ${
            i <= rating ? 'text-[#d6a545] drop-shadow-lg' : 'text-gray-300 hover:text-gray-400'
          }`}
        >
          <FaStar />
        </button>
      ))}
    </div>
  );
}

function Tag({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 sm:px-4 py-1.5 rounded-full text-sm sm:text-base border transition-all duration-300 transform hover:scale-105 ${
        active
          ? "bg-[#e8f5e9] border-green-600 text-green-800 font-medium shadow-md hover:shadow-lg"
          : "border-gray-300 text-gray-700 hover:border-green-400 hover:text-green-700"
      }`}
    >
      {label}
    </button>
  );
}

function ImageUpload({ image, setImage }) {
  const handleFile = (file) => file && file.type.startsWith('image/') && setImage(URL.createObjectURL(file));

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  return (
    <label 
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="group border-2 border-dashed border-gray-300 hover:border-green-700 hover:bg-green-50 transition-all duration-300 rounded-xl p-6 sm:p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:shadow-md"
    >
      {image ? (
        <div className="relative group/image">
          <img src={image} className="w-full sm:w-44 h-28 object-cover rounded-lg shadow-md group-hover/image:shadow-lg transition-shadow" />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setImage(null);
            }}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-all shadow-lg"
          >
            <FaTimes size={10} />
          </button>
        </div>
      ) : (
        <>
          <FaCamera className="text-gray-500 mb-2 group-hover:text-green-700 text-2xl sm:text-3xl transition-colors" />
          <p className="text-sm sm:text-base text-gray-700 font-medium">Click to upload or drag and drop</p>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">PNG, JPG up to 10MB</p>
        </>
      )}
      <input type="file" hidden onChange={(e) => handleFile(e.target.files[0])} />
    </label>
  );
}

export default function RateExperience() {
  const [rating, setRating] = useState(4);
  const [review, setReview] = useState("");
  const [image, setImage] = useState(null);
  const [tags, setTags] = useState(["Timely Delivery", "Machine Condition"]);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleTag = (tag) =>
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));

  const handleSubmitReview = (e) => {
    e.preventDefault();
    
    if (!review.trim()) {
      alert("Please write a detailed review");
      return;
    }

    const reviewData = {
      rating,
      review,
      image,
      tags,
      timestamp: new Date().toLocaleString()
    };

    navigate("/farmer/rent-review", { 
      state: { reviewData, showSubmissionMessage: true } 
    });
  };

  return (
    <div>
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slideUp 0.6s ease-out;
        }
      `}</style>
      <div className="w-full min-h-screen bg-white text-[#1a1a1a] overflow-x-hidden pb-64 sm:pb-72 lg:pb-8">
        <div className="text-center py-3 sm:py-4 lg:py-5 pt-6 sm:pt-8 lg:pt-10 px-4 bg-[#f7f7f7] sm:bg-white">
          <h1 className="text-[22px] sm:text-[28px] lg:text-[32px] font-bold text-[#0f5132] px-2">
            Rate Your Experience
          </h1>
          <p className="text-[13px] sm:text-[16px] text-[#666] mt-2 sm:mt-3 max-w-md sm:max-w-lg mx-auto leading-relaxed px-2">
            Your feedback helps our farming community grow stronger.
          </p>
        </div>

        <div className="w-full px-4 sm:px-6 py-0 sm:py-1">
        <div className="max-w-3xl mx-auto">

        <form onSubmit={handleSubmitReview} className="bg-white rounded-lg shadow-sm border-2 border-[#e8e8e8] p-4 sm:p-6 hover:shadow-md transition-shadow duration-300 animate-slide-up">
          <div className="flex flex-col sm:flex-row gap-4">
            <img
              src="/assets/image/John%20Deere%20S780.webp"
              alt="John Deere 5E Series Tractor"
              loading="lazy"
              className="w-full sm:w-48 lg:w-56 h-56 sm:h-40 lg:h-48 rounded-lg object-cover shadow-md hover:shadow-lg transition-shadow"
            />
            <div>
              <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                ✓ RENTAL COMPLETED
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-black mt-2">
                Thank You for choosing AgriRent
              </h2>
              <p className="text-sm sm:text-base text-gray-700 mt-2 leading-relaxed">
                We hope the John Deere 5E Series tractor served your farm well from Oct 12 - Oct 15
              </p>
            </div>
          </div>

          <div className="text-center mt-6 sm:mt-8">
            <h3 className="font-bold text-black mb-4 text-base sm:text-lg px-2 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              How would you rate the overall service?
            </h3>
            <StarRating rating={rating} setRating={setRating} />
            <p className="text-sm sm:text-base text-[#d6a545] mt-3 font-bold">{["Poor", "Fair", "Good", "Very Good", "Excellent"][rating - 1]} Experience</p>
          </div>

          <div className="mt-6 sm:mt-8">
            <h4 className="text-sm sm:text-base font-bold text-black mb-3">What went well?</h4>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {["Timely Delivery", "Machine Condition", "Owner Communication", "Value for Money", "Ease of Use"].map((tag) => (
                <Tag key={tag} label={tag} active={tags.includes(tag)} onClick={() => toggleTag(tag)} />
              ))}
            </div>
          </div>

          <div className="mt-6 sm:mt-8">
            <h4 className="text-sm sm:text-base font-bold text-black mb-2">Detailed Review</h4>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows={4}
              placeholder="Tell us about the performance, ease of use, and any other details that might help other farmers..."
              className="w-full rounded-xl border-2 border-gray-300 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:ring-2 focus:ring-green-600 focus:border-green-600 focus:outline-none transition-all"
            />
          </div>

          <div className="mt-6">
            <h4 className="text-sm sm:text-base font-bold text-black mb-3">Share the machine in action</h4>
            <ImageUpload image={image} setImage={setImage} />
          </div>

          <button type="submit" className="w-full mt-6 bg-[#1f3d2b] hover:bg-[#2e5b3f] transition-all duration-300 text-white py-3 rounded-lg font-semibold text-base sm:text-lg cursor-pointer active:scale-95 hover:shadow-lg shadow-md transform hover:scale-105">
            Submit Review
          </button>
        </form>

        <div className="bg-white rounded-lg shadow-sm border-2 border-gray-200 p-4 sm:p-6 mt-6 mb-6 hover:shadow-md transition-shadow">
          <h3 className="text-sm sm:text-base font-bold text-black mb-4">Current Ratings for this Machine</h3>
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
            <div className="text-center sm:text-left">
              <p className="text-4xl sm:text-5xl font-bold text-green-900">4.8</p>
              <div className="flex justify-center sm:justify-start text-[#d6a545] mt-2 text-lg">
                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
              </div>
              <p className="text-xs text-gray-600 mt-2 font-medium">Based on 124 reviews</p>
            </div>
            <div className="flex-1 space-y-3">
              {[85, 12, 3, 0, 0].map((val, i) => (
                <div key={i} className="flex items-center gap-2 sm:gap-3">
                  <span className="text-sm sm:text-base font-semibold text-gray-700 w-3 sm:w-4">{5 - i}</span>
                  <div className="flex-1 bg-gray-200 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-[#1f3d2b] to-[#2e5b3f] h-2.5 rounded-full transition-all duration-500" style={{ width: `${val}%` }} />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-gray-600 w-8 sm:w-10 text-right">{val}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        </div>
        </div>
      </div>
    </div>
  );
}