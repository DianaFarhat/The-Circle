const User= require("../models/userModel");
const validator = require('validator');
const jwt =require('jsonwebtoken')
const {promisify}=require('util')
const env= require('dotenv');


const signToken = (id, res) => {
    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
    });

    // Set the JWT as a cookie
    res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Set to true in production, false in development
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    return token;
};

const createSendToken = (user, statusCode, res) => {
const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
  expiresIn: process.env.JWT_EXPIRES_IN,
});

res.cookie("jwt", token, {
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  httpOnly: true,
  sameSite: "Strict",
});

res.status(statusCode).json({
  status: "success",
  token, // ✅ Sending token in response
  data: { user },
});

return token; // ✅ Return the generated token
};



exports.signup = async (req, res) => {
    console.log("Request Body:", req.body); // Add this line to inspect the body
    const { 
        firstName, 
        lastName, 
        email, 
        username, 
        password, 
        passwordConfirm, 
        role, 
        birthdate, 
        sex, 
        height, 
        weight, 
        activityLevel, 
        fitnessGoal, 
        targetWeight= null, 
        dietaryPreferences= null 
    } = req.body;
      
    try {
    // Check if email is already in use
    const emailCheck = await User.findOne({ email });
    if (emailCheck) {
        return res.status(409).json({ message: "Email is in use." });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "Invalid Email." });
    }

    // Create a new user instance
    const newUser = new User({
        firstName,
        lastName,
        email,
        username,
        password,
        passwordConfirm,
        role,
        birthdate,
        sex,
        height,
        weight,
        activityLevel,
        fitnessGoal,
        targetWeight,
        dietaryPreferences
    });

    // Explicitly validate the document
    await newUser.validate();

    // ✅ Log passwordChangedAt for debugging
    console.log("passwordChangedAt on signup:", newUser.passwordChangedAt);

    // Save the user to the database
    await newUser.save();

    // Send response with token
    //signing up and logging in the user
    createSendToken(newUser, 201, res);
    } catch (err) {
    // Handle validation errors
    if (err.name === "ValidationError") {
        return res.status(400).json({ message: err.message });
    }
    // Handle other errors
    res.status(500).json({ message: err.message });
    console.error("Error in signup:", err);
    }
};


exports.login= async(req,res)=>{
    console.log("Login route hit");  // Log to see if the route is hit
    try{
        const {email,password}= req.body;
        const user = await User.findOne({ email }).select("+password");
        //user not signedup
        if (!user){
            return res.status (404).json({ message: "User not found" })
        }

        //if password is not correct

        if (!(await user.checkPassword(password,user.password))){
            return res.status(401).json({message:"Incorrect Email or Password"})

        }

        //if login is successfull , set user's token

        createSendToken(user, 200, res)
        console.log("lOGGED IN")


    }catch(err)
    {console.log(err)

    }
}


exports.logout = async (req, res) => {
    res.cookie("jwt", "", {
        httpOnly: true, // Corrected the typo here
        expires: new Date(0),
    });

    console.log("Logged out")
    res.status(200).json({ message: "Logged out successfully" });
};




exports.googleLogin = async (req, res) => {

try {

const { googleId, name, email, photo } = req.body;
console.log(email)

let user = await User.findOne({ email });


if (user) {
// User already exists, send an error response
return res.status(400).json({ message: "User already registered" });
}

if (!user) {
// Create new user if not exists

user = new User({
firstName: name.split(" ")[0],
lastName: name.split(" ")[1] || "",
email,
username: email.split("@")[0], // Generate a username
password: "google-auth", // No password needed, but required in schema
passwordConfirm: "google-auth",
});
await user.save();
}

// Send token & response

createSendToken(user, 200, res);
} catch (error) {
res.status(500).json({ message: error.message });
}
};

exports.loginWithGoogle = async (req, res) => {
try {
const { googleId, email } = req.body;
console.log("Google UID:", googleId);
console.log("Google Email:", email);

const user = await User.findOne({ googleId, email });

if (!user) {
return res.status(401).json({ message: "User not registered or email does not match." });
}

// ✅ Generate token
const token = createSendToken(user, 200, res); // This already sends a response!

console.log("Generated Token:", token); // Debugging

// ✅ Only return if token is valid (Avoids second response)
if (!token) {
return res.status(500).json({ message: "Token generation failed" });
}

} catch (err) {
console.error("Google login error:", err);

// ✅ Ensure error response is sent only ONCE
if (!res.headersSent) {
res.status(500).json({ message: "Google login failed" });
}
}
};

exports.updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword, passwordConfirm } = req.body;

        // 1️⃣ Validate input
        if (!currentPassword || !newPassword || !passwordConfirm) {
            return res.status(400).json({ message: "All fields are required." });
        }

        if (newPassword !== passwordConfirm) {
            return res.status(400).json({ message: "New passwords do not match." });
        }

        // 2️⃣ Get the logged-in user from DB (include password for verification)
        const user = await User.findById(req.user._id).select("+password");

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // 3️⃣ Use checkPassword method from user model to verify current password
        const isMatch = await user.checkPassword(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Incorrect current password." });
        }

        // 4️⃣ Set the new password (pre-save middleware will handle hashing)
        user.password = newPassword;
        user.passwordChangedAt = Date.now(); // Invalidate old tokens

        await user.save();

        res.status(200).json({ message: "Password updated successfully!" });
    } catch (error) {
        console.error("Error updating password:", error);
        res.status(500).json({ message: "Server error while updating password." });
    }
};

  


//Profile Details
exports.getCurrentUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password"); // Exclude password

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "User profile retrieved successfully.",
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                email: user.email,
                role: user.role,
                birthdate: user.birthdate,
                sex: user.sex,
                height: user.height,
                weight: user.weight,
                bodyFatPercentage: user.bodyFatPercentage,
                activityLevel: user.activityLevel,
                fitnessGoal: user.fitnessGoal,
                targetWeight: user.targetWeight,
                dietaryPreferences: user.dietaryPreferences,
                createdAt: user.createdAt,
            },
        });
        
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.updateCurrentUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // ✅ Update only the provided fields (keep existing values if not provided)
        user.firstName = req.body.firstName || user.firstName;
        user.lastName = req.body.lastName || user.lastName;
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;
        user.birthdate = req.body.birthdate || user.birthdate;
        user.sex = req.body.sex || user.sex;
        user.height = req.body.height || user.height;
        user.weight = req.body.weight || user.weight;
        user.bodyFatPercentage = req.body.bodyFatPercentage || user.bodyFatPercentage;
        user.activityLevel = req.body.activityLevel || user.activityLevel;
        user.fitnessGoal = req.body.fitnessGoal || user.fitnessGoal;
        user.targetWeight = req.body.targetWeight || user.targetWeight;
        user.dietaryPreferences = req.body.dietaryPreferences || user.dietaryPreferences;

        // ✅ Save updated user data to the database
        const updatedUser = await user.save();

        // ✅ Return updated user profile (without password)
        res.status(200).json({
            message: "Profile updated successfully.",
            user: {
                _id: updatedUser._id,
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                username: updatedUser.username,
                email: updatedUser.email,
                role: updatedUser.role,
                birthdate: updatedUser.birthdate,
                sex: updatedUser.sex,
                height: updatedUser.height,
                weight: updatedUser.weight,
                bodyFatPercentage: updatedUser.bodyFatPercentage,
                activityLevel: updatedUser.activityLevel,
                fitnessGoal: updatedUser.fitnessGoal,
                targetWeight: updatedUser.targetWeight,
                dietaryPreferences: updatedUser.dietaryPreferences,
                createdAt: updatedUser.createdAt,
            },
        });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: "Server error while updating profile" });
    }
};

exports.deleteAccount = async (req, res) => {
    try {

        
      const { currentPassword } = req.body;
      if (!currentPassword) {
        return res.status(400).json({ message: "Current password is required." });
      }
  
      // Fetch the user from the database (ensure password is selected)
      const user = await User.findById(req.user.id).select("+password");
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
  
      // Use checkPassword method instead of bcrypt.compare()
      const isMatch = await user.checkPassword(currentPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Incorrect password. Account deletion failed." });
      }
  
      // Delete the user
      await User.findByIdAndDelete(req.user.id);
  
      res.status(200).json({ message: "Account deleted successfully." });
    } catch (error) {
      res.status(500).json({ message: "Something went wrong.", error });
    }
};


  