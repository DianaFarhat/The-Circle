import { useState, useEffect } from "react";
import axios from "axios";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { refreshCart } from "../../redux/features/cart/cartSlice"; // Import the resetCart action
import { auth, provider } from "../../Firebase"; 
import { signInWithPopup } from "firebase/auth";
const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { userInfo } = useSelector((state) => state.auth);

    const { search } = useLocation();
    const sp = new URLSearchParams(search);
    const redirect = sp.get("redirect") || "/login";

const signInWithGoogle = async (e) => {
  e.preventDefault();

  try {
    // Open Google Sign-In popup (doesn't set loading yet)
    const result = await signInWithPopup(auth, provider.setCustomParameters({ prompt: "select_account" }));

    if (!result?.user) {
      throw new Error("No user returned from Google Sign-In");
    }

    // ✅ Now we know an account was chosen, so set loading to true
    setLoading(true);

    const user = result.user;
    const uid = user.uid;
    const email = user.email;

    console.log("Google User UID:", uid);
    console.log("Google User Email:", email);

    // Send UID & Email to backend
    const res = await axios.post("http://localhost:3000/api/users/loginWithGoogle", {
      googleId: uid,
      email: email,
    }, { withCredentials: true });

    const { token } = res.data;

    localStorage.setItem("token", token);
    localStorage.setItem("userInfo", JSON.stringify(user));

    dispatch(setCredentials(res.data));
    dispatch(refreshCart());

    setIsLoggedIn(true);
    toast.success("User successfully Logged in!");

    setTimeout(() => {
      navigate("/");
    }, 2000);
  } catch (error) {
    if (error.code === "auth/popup-closed-by-user") {
      toast.info("Google Sign-In popup was closed. Please try again.");
    } else if (error.response?.status === 400) {
      toast.error("User not found or incorrect credentials.");
    } else {
      toast.error("Google Sign-In Error");
    }
  } finally {
    setLoading(false); // ✅ Ensures loading state is always reset
  }
};


    // Check login status when the component mounts
    useEffect(() => {
        if (localStorage.getItem("token")) {
            setIsLoggedIn(true);
        }
    }, []);

    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }
    }, [navigate, redirect, userInfo]);

    // Login handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await axios.post(
                "http://localhost:3000/api/users/auth/login",
                { email, password },
                { withCredentials: true }
            );

            setIsLoggedIn(true);

            const { token, user } = response.data;

            // Store token and user info in localStorage
            localStorage.setItem("token", token);
            localStorage.setItem("userInfo", JSON.stringify(user)); // Store user info as JSON

            // Dispatch the user info to the Redux store
            dispatch(setCredentials(response.data)); // Dispatch full response data
            console.log(response.data); // This will show the exact structure of the response from the server

            // Dispatch the resetCart action to update the cart state
            dispatch(refreshCart());

            setIsLoggedIn(true);
            toast.success("User successfully Logged in!");

            // Add a delay (e.g., 2 seconds) before redirecting
            setTimeout(() => {
                navigate("/");
            }, 2000); // 2000 ms = 2 seconds
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Error occurred during login";
            toast.error(errorMessage);
                     setLoading(false); // Reset button state on failure
        }
    };

    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-96">
                <h2 className="text-2xl font-bold mb-4">Login</h2>
                {error && <p className="text-red-500">{error}</p>}
                <div className="mb-4">
                    <label className="block text-gray-700">Email</label>
                    <input
                        type="email"
                        className="w-full px-3 py-2 border rounded"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Password</label>
                    <input
                        type="password"
                        className="w-full px-3 py-2 border rounded"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

              <button
  className="w-full flex items-center justify-center gap-2 border border-gray-300 bg-white text-gray-700 py-2 rounded-md hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 text-sm font-medium shadow-sm"
  onClick={signInWithGoogle}
  type="button"
>
<img 
  src="https://developers.google.com/identity/images/g-logo.png" 
  alt="Google logo" 
  className="w-5 h-5"
/>

  Sign in with Google
</button>


                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded w-full"
                    disabled={loading}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-indigo-600 hover:underline">
                            Sign Up
                        </Link>
                    </p>
                </div>
            </form>
            <ToastContainer />
        </div>
    );
};

export default Login;