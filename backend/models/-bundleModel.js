const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Bundle Schema
const bundleSchema = new mongoose.Schema(
  {
    
    _id: { type: String, required: true }, // Explicitly setting _id as a String
    name: { type: String, required: true },
    image: { type: String, required: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }] , // Reference to Product model
    price: { type: Number, required: true, default: 0 },
    description: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    rating: { type: Number, requirWed: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
    countInStock: { type: Number, required: true, default: 0 },
    originalPrice: { type: Number, required: true, default: 0 }, // Total price without discount
    FinalPrice: { type: Number, required: true, default: 0 }, // Total price without discount

    isAvailable: { type: Boolean, default: true },

  },
  { timestamps: true }
);

// bundleSchema.pre("save", function (next) {
//   // Apply Buy 3, Pay for 2 logic if there are 3 products
//   if (this.products.length === 3) {
//     // Calculate the price as if buying 2, discounting the price of the 3rd product
//     let totalPrice = 0;
//     this.products.forEach(product => {
//       totalPrice += product.product.price;
//     });
//     this.price = totalPrice - this.products[2].product.price; // subtract the 3rd product's price

//     // Set the discount price logic
//     if (this.Discount > 0) {
//       this.discountPrice = this.price - (this.price * this.Discount) / 100;
//     } else {
//       this.discountPrice = this.price;
//     }
//   } else {
//     // Standard pricing logic for bundles with fewer or more than 3 products
//     let totalPrice = 0;
//     this.products.forEach(product => {
//       totalPrice += product.product.price;
//     });
//     this.price = totalPrice;

//     // Apply discount
//     if (this.Discount > 0) {
//       this.discountPrice = this.price - (this.price * this.Discount) / 100;
//     } else {
//       this.discountPrice = this.price;
//     }
//   }

//   next();
// });


// Export the Bundle model
module.exports = mongoose.model("Bundle", bundleSchema);
