const mongoose= require("mongoose");
const Schema= mongoose.Schema;
const bcrypt = require('bcrypt');



const userSchema = new mongoose.Schema(
{
  firstName: {
    type: String,
    required: [true, "Please enter your first name"],
    minLength: 3,
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, "Please enter your last name"],
    minLength: 3,
    trim: true,
  },
  username: {
    type: String,
    unique: true,
    trim: true,
    required: [true, "Please enter your username"],
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true,
    required: [true, "Please enter your email"],
  },
  password: {
    type: String,
    minLength: 8,
    required: [true, "Please enter your password"],
    select: false, 
  },
  
  passwordConfirm: {
    type: String,
    required: function () {
      return this.isNew; // Required only when creating a new user
    },
    validate: {
      validator: function (value) {
        return value === this.password;
      },
      message: "Passwords do not match!",
    },
  },
  
  passwordChangedAt: Date,
  role: {
    type: String,
    default: "user",
    enum: ["admin", "user"],
  },
  
  //Nutrition-Related Info

  birthdate: {
    type: Date,
    required: [true, "Please enter your birthdate"],
  },
  sex: {
    type: String,
    enum: ["male", "female"],
    required: [true, "Please enter your sex"],
  },
  height: {
    type: Number,
    required: [true, "Please enter your height in cm"],
  },
  weight: {
    type: Number,
    required: [true, "Please enter your weight in kg"],
  },
  activityLevel: {
    type: String,
    enum: ["Sedentary", "Lightly Active", "Moderately Active", "Very Active", "Extremely Active"],
    required: [true, "Please enter your activity level"],
  },
  fitnessGoal: {
    type: String,
    enum: ["Fat Loss", "Muscle Gain", "Maintenance"],
    required: [true, "Please enter your fitness goal"],
  },
  targetWeight: {
    type: Number,
    required: false,
  },
  dietaryPreferences: {
    type: [String],
    enum: ["Vegetarian", "Vegan", "Paleo", "Gluten-Free", "Keto", "Other"],
    default: [],
    set: (arr) => [...new Set(arr)], // ✅ Remove duplicates automatically
  },
  

  //Favorite Meals
  favoriteMeals: [{ type: Schema.Types.ObjectId, ref: "Meal" }] 


  //TODO: Meal Plan History


},
{ timestamps: true }
);

// ✅ Hash Password Before Saving & Remove `passwordConfirm`
userSchema.pre("save", async function (next) {
try {
  if (!this.isModified("password")) return next();

  // Hash the password
  this.password = await bcrypt.hash(this.password, 12);

  // Remove the passwordConfirm field from the document
  this.passwordConfirm=undefined;

  next();
} catch (err) {
  next(err);
}
});
  userSchema.methods.checkPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
  };
  

  userSchema.methods.passwordChangedAfterTokenIssued = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
      const passwordChangeTime = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
      return passwordChangeTime > JWTTimestamp;
    }
    return false;
  };

  // ✅ Set PasswordChangedAt Only After It's Modified
  userSchema.pre("save", async function (next) {
    try {
      if (!this.isModified("password") || this.isNew) return next();
    
      // Add a Password Changed Field
      this.passwordChangedAt= Date.now() - 1000;
    
      next();
    } catch (err) {
      next(err);
    }

  });
  

  // Virtual field for age based on birthdate
  userSchema.virtual("age").get(function () {
    const currentDate = new Date();
    const birthdate = new Date(this.birthdate);
    let age = currentDate.getFullYear() - birthdate.getFullYear();
    const monthDiff = currentDate.getMonth() - birthdate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < birthdate.getDate())) {
      age--;
    }
    return age;
  });
  
  module.exports = mongoose.model("User", userSchema);



