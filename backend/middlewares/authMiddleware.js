const jwt = require('jsonwebtoken');
const User = require("../models/userModel.js");
const { asyncHandler } = require("./asyncHandler");

exports.authenticate = asyncHandler(async (req, res, next) => {
  let token = req.cookies.jwt;

  if (!token) {
      console.log("No token found in cookies");
      return res.status(401).json({ message: "Not authorized, no token." });
  }

  try {
      // 1️⃣ Decode the JWT
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded Token:", decoded); // ✅ Debugging

      // 2️⃣ Find the user and exclude password
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
          console.log("User not found in database");
          return res.status(401).json({ message: "User not found." });
      }

      // 3️⃣ Check if the password was changed after the token was issued
      if (user.passwordChangedAfterTokenIssued(decoded.iat)) {
          console.log("User changed password after token was issued");
          return res.status(401).json({ message: "Password changed. Please log in again." });
      }

      // 4️⃣ Attach user to request and proceed
      req.user = user;
      console.log("Authenticated User:", req.user);
      next();
  } catch (error) {
      console.error("JWT Verification Error:", error);
      return res.status(401).json({ message: "Not authorized, token failed." });
  }
});
