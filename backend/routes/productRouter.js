
// controllers
const {
  fetchProducts,
  fetchProductById,
  fetchAllProducts,
  addProductReview,
  fetchTopProducts,
  fetchNewProducts,getRecommendedProducts,
  filterProducts,
} =require("../controllers/productController.js");
const {authenticate} = require("../middlewares/authMiddleware.js");
const  {checkId} = require ("../middlewares/checkId.js");

const mongoose =require("mongoose"); // Import Mongoose to validate ObjectId
const express=require('express')
const router = express.Router();
const Product = require('../models/productModel')


// router
//   .route("/")
//   .get(fetchProducts)
//   .post(authenticate, authorizeAdmin, formidable(), addProduct);



router.route("/").get(fetchProducts)

router.route("/allproducts").get(fetchAllProducts);
router.route("/:id/reviews").post(authenticate, checkId, addProductReview);

router.get("/top", fetchTopProducts);
router.get("/new", fetchNewProducts);

router.get("/recommendations", getRecommendedProducts);


router
  .route("/:id")
  .get(fetchProductById)
 


//   router
//   .route("/:id")
//   .get(fetchProductById)
//   .put(authenticate, authorizeAdmin, formidable(), updateProductDetails)
//   .delete(authenticate, authorizeAdmin, removeProduct);

router.post("/filter", filterProducts);

// Fetch multiple products by their IDs
router.post("/multiple", async (req, res) => {
  try {
    const { productIds } = req.body; // Receive product IDs as an array

    // Fetch products matching the given IDs
    const products = await Product.find({ _id: { $in: productIds } });

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products", details: error.message });
  }
});

// POST /api/products/check-stock

router.post("/check-stock", async (req, res) => {
    console.log("✅ HIT /check-stock route"); // Log when the route is hit

    try {
        const { cartItems } = req.body;
        console.log("🛒 Received cartItems:", cartItems); // Log received data

        if (!cartItems || !Array.isArray(cartItems)) {
            return res.status(400).json({ error: "Invalid request format" });
        }

        let outOfStockItems = [];

        for (const item of cartItems) {
            // ✅ Validate ObjectId before querying
            console.log("🔍 Checking product ID:", item.id);

            if (!mongoose.Types.ObjectId.isValid(item.id)) {
                console.error("❌ Invalid product ID:", item.id);
                return res.status(400).json({ error: "Invalid product ID format", invalidId: item.id });
            }

            const product = await Product.findById(item.id);
            console.log("🛑 Product found:", product);

            if (!product || product.countInStock < item.qty) {
                outOfStockItems.push({
                    id: item.id,
                    name: product ? product.name : "Unknown Product",
                });
            }
        }

        if (outOfStockItems.length > 0) {
            return res.status(400).json({
                message: "Some items are out of stock. Please update your cart.",
                outOfStockItems,
            });
        }

        res.status(200).json({ message: "All items in stock" });
    } catch (error) {
        console.error("❗ Error checking stock:", error);
        res.status(500).json({ error: "Server error. Please try again." });
    }
});

module.exports = router; 