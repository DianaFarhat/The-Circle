import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth, provider } from "../../Firebase"; 
import { signInWithPopup } from "firebase/auth";

const SignUp = () => {
  const navigate = useNavigate(); // ✅ Initialize useNavigate
  const [loading, setLoading] = useState(false); // Track login status
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [role, setRole] = useState('user');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
      setLoading(true); // Set button to "Logging in..."

    try {
      const response = await axios.post('http://localhost:3000/api/users/signup', {
        firstName,
        lastName,
        email,
        username,
        password,
        passwordConfirm,
        role,
      });

      toast.success("User successfully registered"); 
      setTimeout(() => navigate("/Login"), 2000); // ✅ Redirect to home after success
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error occurred during signup');
         setLoading(false); // Reset button state on failure

    }
  };

  const signInWithGoogle = async (e) => {
       e.preventDefault();
      setLoading(true); // Set button to "Logging in..."
    try {
      const result = await signInWithPopup(auth, provider.setCustomParameters({ prompt: "select_account" }));
      const { displayName, email, photoURL, uid } = result.user;

      const res = await axios.post("http://localhost:3000/api/users/google-login", {
        googleId: uid,
        name: displayName,
        email: email,
        photo: photoURL,
      });

      toast.success("User successfully registered");
      setTimeout(() => navigate("/Login"), 2000); // ✅ Redirect to home after success
    } catch (error) {
 if (error.response?.status === 400) {
      toast.error("User already registered");
       setLoading(false); // Reset button state on failure
          }     

     else {
      toast.error("Google Sign-In Error");
    }      setLoading(false); // Reset button state on failure
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <div className="bg-white shadow-lg rounded-lg p-8 sm:max-w-md w-full">
        <h1 className="text-3xl font-semibold text-center mb-6 text-gray-800">Create Account</h1>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                required
                className="w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 text-sm"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
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
/>  Sign in with Google
</button>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            >
              Sign Up
            </button>
          </div>
        </form>

        {message && (
          <p className="mt-4 text-center text-red-500 text-sm">{message}</p>
        )}

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 hover:underline">
              Log In
            </Link>
          </p>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default SignUp;
