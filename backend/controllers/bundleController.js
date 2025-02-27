const Bundle = require("../models/bundleModel"); // Ensure correct model import

const getBundles = async (req, res) => {
  try {
    const bundles = await Bundle.find({});
    res.json(bundles);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch bundles" });
  }
};

const getBundleProducts = async (req, res) => {
  try {
    const bundle = await Bundle.findById(req.params.id);
    console.log(bundle)

    if (!bundle) {
      return res.status(404).json({ message: "Bundle not found" });
    }

    const productIds = bundle.products.map(product => product._id);
    console.log(bundle)

    res.json({ productIds });
  } catch (error) {
    console.error("Error fetching bundle products:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { getBundles,getBundleProducts };
