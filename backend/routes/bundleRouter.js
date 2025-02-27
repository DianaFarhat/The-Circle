const express= require('express')
const router=express.Router();
const {getBundles,getBundleProducts}= require ('../controllers/bundleController');
const Bundle =require('../models/bundleModel')
router.get("/", getBundles);

// Get product IDs from a specific bundle
// Get product details along with bundle ID
router.get("/:id/products", async (req, res) => {
    console.log("Received request for bundle ID:", req.params.id);

    try {
        const bundle = await Bundle.findById(req.params.id).populate("products");

        if (!bundle) {
            console.log("Bundle not found in database.");
            return res.status(404).json({ message: "Bundle not found" });
        }

        // Add `bundleId` to each product
        const productsWithBundleId = bundle.products.map((product) => ({
            ...product.toObject(),
            bundleId: req.params.id,  // Attach the bundle ID to each product
            isBundle: true,  
        }));

        console.log("Bundle products with bundleId:", productsWithBundleId);
        res.json(productsWithBundleId);

    } catch (error) {
        console.error("Error fetching bundle products:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


  
 
module.exports = router; 