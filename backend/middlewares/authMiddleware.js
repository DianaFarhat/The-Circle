const jwt =require('jsonwebtoken')
const  User =require("../models/userModel.js");
const { asyncHandler } = require("./asyncHandler");


exports.authenticate = asyncHandler(async (req, res, next) => {
  let token = req.cookies.jwt;

  if (!token) {
      console.log("No token found in cookies");
      return res.status(401).json({ message: "Not authorized, no token." });
  }

  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded Token:", decoded); // ✅ Debugging: Check what the token contains

      req.user = await User.findById(decoded.id).select("-password"); // ✅ Fix: Use `id`, not `userId`
      
      if (!req.user) {
          console.log("User not found in database");
          return res.status(401).json({ message: "User not found." });
      }

      console.log("Authenticated User:", req.user); // ✅ Debugging
      next();
  } catch (error) {
      console.error("JWT Verification Error:", error); // ✅ Debugging
      return res.status(401).json({ message: "Not authorized, token failed." });
  }
});
