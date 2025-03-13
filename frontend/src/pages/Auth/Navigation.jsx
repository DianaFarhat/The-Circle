import { useState ,useEffect} from "react";
import {
  AiOutlineHome,
  AiOutlineMenu,
  AiOutlineShopping,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineShoppingCart,
  AiOutlineFileText,
  AiOutlineSearch,
  AiOutlineUser, 
  
} from "react-icons/ai";
import { FaUserCircle, FaMale, FaFemale } from "react-icons/fa";
import { FiSettings, FiLogOut } from "react-icons/fi";
import { useSelector } from "react-redux";
import { useLogoutMutation } from "../../redux/api/userApiSlice";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./Navigation.css"; // Make sure to update the CSS for top nav bar
import colorPalette from "../../Utils/color-pallette"; // Import the color palette


const Navigation = () => {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("userInfo"));
  const loggedInUserId = storedUser?.data?.user._id;
  const { userInfo } = useSelector((state) => state.auth);
  const [isLoggedIn, setIsLoggedIn] = useState(!!loggedInUserId); // Local state for login status
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen]= useState(false);
  const [searchQuery, setSearchQuery]= useState("");

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };


  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userInfo"));
    setIsLoggedIn(!!storedUser?.data?.user._id); // Sync with localStorage
  }, []);

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/users/logout",
        {},
        { withCredentials: true }
      );

setIsLoggedIn(false);
      if (response.status === 200) {
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
        localStorage.removeItem("expirationTime");

        Swal.fire({
          icon: "success",
          title: "Logged out successfully!",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => navigate("/login"));
      } else {
        Swal.fire("Error", "Logout failed. Please try again.", "error");
      }
    } catch (err) {
      Swal.fire("Error", "An unexpected error occurred.", "error");
      console.error("Logout error:", err);
    }
  };

  return (
    <div className="top-nav-bar text-white flex justify-between items-center px-4 py-2 h-16 w-full z-50">
    {/* Left Side (Logo & Menu) */}
    <div className="flex items-center space-x-6">
      <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-black focus:outline-none">
        <AiOutlineMenu size={19} />
      </button>
      <Link to="/" className="flex hover:text-gray-400 relative">
      <span className="text-3xl font-semibold text-black lowercase tracking-tight leading-none">
        thecircle
      </span>
      {/* Green Dot */}
      <span className="text-[#6BBE44] text-4xl font-bold leading-none">.</span>
    </Link>
    </div>

  {/* Centered Search Bar */}
  <div className="flex-1 flex justify-center">
    <div className="w-full max-w-[600px] min-w-[300px]">
      <div className="relative flex items-center">
      {/* Search Input */}
      <input
        className="w-full bg-white placeholder-gray-700 text-black text-lg border border-gray-300 rounded-full pl-4 pr-14 py-2 transition duration-200 ease-in-out 
        focus:outline-none focus:border-blue-500 hover:border-gray-400 shadow-sm"
        placeholder="Matcha Protein Shake"
        style={{
          height: "42px", // Ensures input and button are the same height
          borderColor: colorPalette.citrusZest, // Default border color
          transition: "border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = colorPalette.limeGreen; // Border color when focused
          e.target.style.boxShadow = `0 0 4px ${colorPalette.lemonYellow}`; // Adds glow effect
        }}
        onBlur={(e) => {
          e.target.style.borderColor = colorPalette.citrusZest; // Reset to original border color
          e.target.style.boxShadow = "none"; // Removes glow
        }}
      />

      {/* Search Button (Merged with Input) */}
      <button
        className="absolute right-0 top-0 h-full w-12 bg-gray-100 border-l border-gray-300 rounded-r-full flex justify-center items-center hover:bg-gray-200 active:bg-gray-300"
        style={{
          height: "42px", // Matches input height exactly
          padding: "0", // Removes extra padding
          minWidth: "48px", // Ensures correct width
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5 text-gray-600"
        >
          <path
            fillRule="evenodd"
            d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      </div>
    </div>
  </div>

  {/* Right Side (User) */}
  <div className="flex items-center space-x-6">
     {/* Logged-in state: Display gender-based avatar with username */}
     {loggedInUserId && userInfo ? (
        <button onClick={toggleDropdown} className="flex items-center text-black">
          {userInfo.sex === "female" ? (
            <FaFemale size={30} className="text-pink-400" />
          ) : (
            <FaMale size={30} className="text-blue-400" />
          )}
          <span className="ml-2">{userInfo.username}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-4 w-4 ml-1 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="white"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      ) : (
        // Not logged in: Show user icon
        <button onClick={toggleDropdown} className="flex items-center">
          <AiOutlineUser size={30} />
        </button>
      )}

      {/* Dropdown Menu */}
      {dropdownOpen && (
        <div className="absolute top-16 right-0 mt-2 w-48 bg-white shadow-lg rounded-lg overflow-hidden animate-fade-in">
          {!loggedInUserId ? (
            // Not Logged In: Show Login & Sign Up
            <>
              <Link to="/login" className="flex items-center px-4 py-2 ">
                <span className="text-black">Login</span>
              </Link>
              <Link to="/register" className="flex items-center px-4 py-2">
                <span className="text-black">Sign Up</span>
              </Link>
            </>
          ) : (
            // Logged In: Show Profile, Settings & Logout
            <>
              <Link to="/profile" className="flex items-center px-4 py-2 ">
                <span className="text-black">My Profile</span>
              </Link>
              <Link to="/password-settings" className="flex items-center px-4 py-2">
                <span className="text-black">Password Settings</span>
              </Link>
              <button
                onClick={logoutHandler}
                className="flex items-center w-full text-left px-4 py-2">
              <span className="text-black">Logout</span>
              </button>
            </>
          )}
        </div>
      )}

  </div>
</div>

  );
};

export default Navigation;