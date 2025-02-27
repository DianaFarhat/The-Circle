import { useState ,useEffect} from "react";
import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineShoppingCart,
  AiOutlineFileText,
} from "react-icons/ai";
import { useSelector } from "react-redux";
import { useLogoutMutation } from "../../redux/api/userApiSlice";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./Navigation.css"; // Make sure to update the CSS for top nav bar

const Navigation = () => {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("userInfo"));
  const loggedInUserId = storedUser?.data?.user._id;
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
    const [isLoggedIn, setIsLoggedIn] = useState(!!loggedInUserId); // Local state for login status
  const [dropdownOpen, setDropdownOpen] = useState(false);

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
    <div className="top-nav-bar bg-black text-white flex justify-between items-center px-4 py-2 fixed w-full z-50">
      <div className="flex space-x-6">
        <Link to="/" className="flex items-center hover:text-gray-400">
          <AiOutlineHome size={26} />
          <span className="ml-2">HOME</span>
        </Link>
        <Link to="/shop" className="flex items-center hover:text-gray-400">
          <AiOutlineShopping size={26} />
          <span className="ml-2">SHOP</span>
        </Link>

        {loggedInUserId && (
          <Link to="/cart" className="relative flex items-center hover:text-gray-400">
            <AiOutlineShoppingCart size={26} />
            {cartItems.length > 0 && (
              <span className="absolute top-0 right-0 px-1 py-0 text-sm text-white bg-pink-500 rounded-full">
                {cartItems.reduce((a, c) => a + c.qty, 0)}
              </span>
            )}
            <span className="ml-2">Cart</span>
          </Link>
        )}

        {loggedInUserId && (
          <Link to="/user-orders" className="flex items-center hover:text-gray-400">
            <AiOutlineFileText size={26} />
            <span className="ml-2">My Orders</span>
          </Link>
        )}
      </div>

      <div className="relative flex items-center">
        {userInfo ? (
          <>
            <button
              onClick={toggleDropdown}
              className="flex items-center text-white hover:text-gray-400"
            >
              <span>{userInfo.username}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 ml-1 ${dropdownOpen ? "transform rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={dropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                />
              </svg>
            </button>
            {loggedInUserId && dropdownOpen && (
              <ul className="absolute right-0 mt-2 bg-white text-black rounded shadow-lg w-40">
                <li>
                  <button
                    onClick={logoutHandler}
                    className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </>
        ) : (
          !loggedInUserId && (
            <div className="flex space-x-6">
              <Link to="/login" className="flex items-center hover:text-gray-400">
                <AiOutlineLogin size={26} />
                <span className="ml-2">LOGIN</span>
              </Link>
              <Link to="/register" className="flex items-center hover:text-gray-400">
                <AiOutlineUserAdd size={26} />
                <span className="ml-2">REGISTER</span>
              </Link>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Navigation;