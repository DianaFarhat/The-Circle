const mongoose = require("mongoose");
const Schema = mongoose.Schema;


// Meal Schema
const mealSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: {type: String, enum: ["simple", "recipe"], required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    tags: {type: [String], default: []},
    calories: { type: Number, required: true },
    servingSize: {
      value: { type: Number, required: true }, // Numeric value (e.g., 355 for "355ml")
      unit: { type: String, required: true } // Unit as a string (e.g., "ml", "g", "cup")
    },
    macros: {
      carbs: { type: Number, required: true },
      protein: { type: Number, required: true },
      fats: { type: Number, required: true }
    },
    
    sugar: { type: Number, required: true },
    fiber: { type: Number, required: true },
    sodium: { type: Number, required: true },
    caffeine: { type: Number, required: true },
    cholesterol: { type: Number, required: true },
    saturatedFats: { type: Number, required: true },
    unsaturatedFats: { type: Number, required: true },
    
    ingredients: [
      {
        name: { type: String, required: true },
        amount: { type: String, required: true },
        calories: { type: Number, required: true },
        brand: { type: String }, // Optional brand for the ingredient
        isOptional: { type: Boolean, default: false } // Flag to mark optional ingredients
      }
    ],
  
    recipeSteps: [{ type: String }], 
    recipeUrl: { type: String },
    videoUrl: { type: String },
    nbOfTimesSaved: { type: Number, required: true },
  },
  { timestamps: true }
);

// Export the Meal model
module.exports = mongoose.model("Meal", mealSchema);