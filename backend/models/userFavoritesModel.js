const userFavoritesSchema = new mongoose.Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    meals: [{ type: Schema.Types.ObjectId, ref: "Meal" }] // Array of meal references
  });
  
  module.exports = mongoose.model("UserFavorites", userFavoritesSchema);
  