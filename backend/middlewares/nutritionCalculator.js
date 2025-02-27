// Function to calculate BMR (Harris-Benedict Equation for simplicity)
const calculateBMR = (weight, height, age, gender) => {
    if (gender === "male") {
      return 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      return 10 * weight + 6.25 * height - 5 * age - 161;
    }
  };
  
// Function to calculate daily calories needs based on activity level
const calculateCalories = (user) => {
const { weight, height, birthdate, gender, activityLevel, fitnessGoal } = user;

const age = user.age; // Accessing the age virtual property
const bmr = calculateBMR(weight, height, age, gender);

// Activity Level Multiplier
const activityLevelMultiplier = {
    Sedentary: 1.2,
    "Lightly Active": 1.375,
    "Moderately Active": 1.55,
    "Very Active": 1.725,
    "Extremely Active": 1.9,
};

let dailyCalories = bmr * activityLevelMultiplier[activityLevel];

// Adjust calories based on fitness goal (deficit for fat loss, surplus for muscle gain)
if (fitnessGoal === "Fat Loss") {
    dailyCalories -= 500; // 500 calorie deficit for fat loss
} else if (fitnessGoal === "Muscle Gain") {
    dailyCalories += 500; // 500 calorie surplus for muscle gain
}

return dailyCalories;
};

// Function to calculate daily protein requirements (typically 1.6 to 2.2 grams of protein per kg of body weight)
const calculateProtein = (weight, fitnessGoal) => {
const proteinPerKg = fitnessGoal === "Muscle Gain" ? 2.2 : 1.6; // Higher for muscle gain
return weight * proteinPerKg; // Protein in grams
};

// Function to calculate daily restrictions for saturated fat and sugar
const calculateNutrientRestrictions = (fitnessGoal, dietaryPreferences) => {
let sugarLimit = 30; // Default 30g for normal cases

let saturatedFatLimit = 20; // Default for average needs in grams

if (fitnessGoal === "Fat Loss") {
    // Lower sugar intake and fat for fat loss goals
    sugarLimit = 25; // 25g max sugar for fat loss
    saturatedFatLimit = 15; // 15g max saturated fat for fat loss
}

// Handle dietary preferences for more specific restrictions
if (dietaryPreferences.includes("Keto")) {
    sugarLimit = 20; // Keto diet has stricter sugar limit
    saturatedFatLimit = 10; // Keto focuses on fats but controls types
}

return {
    sugarLimit,
    saturatedFatLimit,
};
};

module.exports = {
calculateCalories,
calculateProtein,
calculateNutrientRestrictions,
};
