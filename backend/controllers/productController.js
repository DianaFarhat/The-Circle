const { asyncHandler } = require("../middlewares/asyncHandler.js");
const Product =require("../models/mealModel.js");
const mongoose =require("mongoose")
const Order =require("../models/orderModel.js");

// const addProduct = asyncHandler(async (req, res) => {
//   try {
//     const { name, description, price, category, quantity, brand } = req.fields;

//     // Validation
//     switch (true) {
//       case !name:
//         return res.json({ error: "Name is required" });
//       case !brand:
//         return res.json({ error: "Brand is required" });
//       case !description:
//         return res.json({ error: "Description is required" });
//       case !price:
//         return res.json({ error: "Price is required" });
//       case !category:
//         return res.json({ error: "Category is required" });
//       case !quantity:
//         return res.json({ error: "Quantity is required" });
//     }

//     const product = new Product({ ...req.fields });
//     await product.save();
//     res.json(product);
//   } catch (error) {
//     console.error(error);
//     res.status(400).json(error.message);
//   }
// });

// const updateProductDetails = asyncHandler(async (req, res) => {
//   try {
//     const { name, description, price, category, quantity, brand } = req.fields;

//     // Validation
//     switch (true) {
//       case !name:
//         return res.json({ error: "Name is required" });
//       case !brand:
//         return res.json({ error: "Brand is required" });
//       case !description:
//         return res.json({ error: "Description is required" });
//       case !price:
//         return res.json({ error: "Price is required" });
//       case !category:
//         return res.json({ error: "Category is required" });
//       case !quantity:
//         return res.json({ error: "Quantity is required" });
//     }

//     const product = await Product.findByIdAndUpdate(
//       req.params.id,
//       { ...req.fields },
//       { new: true }
//     );

//     await product.save();

//     res.json(product);
//   } catch (error) {
//     console.error(error);
//     res.status(400).json(error.message);
//   }
// });

// const removeProduct = asyncHandler(async (req, res) => {
//   try {
//     const product = await Product.findByIdAndDelete(req.params.id);
//     res.json(product);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Server error" });
//   }
// });
exports.fetchProducts = asyncHandler(async (req, res) => {
  try {
    const pageSize = 6;

    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: "i",
          },
        }
      : {};

    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({ ...keyword }).limit(pageSize);

    res.json({
      products,
      page: 1,
      pages: Math.ceil(count / pageSize),
      hasMore: false,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});



exports.fetchProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    console.log(productId)

    // Convert string ID to ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ error: "Invalid product ID format" });
    }

    const product = await Product.findById(productId);
    console.log(product)
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    return res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Server error while fetching product" });
  }
};

exports.fetchAllProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({})
      .populate("category")
      .limit(12)
      .sort({ createAt: -1 });

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

exports.addProductReview = asyncHandler(async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        res.status(400);
        throw new Error("Product already reviewed");
      }

      const review = {
        name: req.user.username,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      product.reviews.push(review);

      product.numReviews = product.reviews.length;

      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json({ message: "Review added" });
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

exports.fetchTopProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({}).sort({ rating: -1 }).limit(4);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

exports.fetchNewProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find().sort({ _id: -1 }).limit(5);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

exports.filterProducts = asyncHandler(async (req, res) => {
    try {
      const { checked, radio } = req.body;
  
      let args = {};
      if (checked.length > 0) args.category = checked;
      if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
  
      const products = await Product.find(args);
      res.json(products);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server Error" });
    }
  });


  exports.getRecommendedProducts = async (req, res) => {
    try {
      const { userId } = req.query;
  
      if (userId && !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }
  
      let recommendedProducts = [];
  
      if (userId) {
        const userOrders = await Order.find({ user: userId }).populate("orderItems.product");
  
        if (userOrders.length > 0) {
          const orderedProductIds = userOrders.flatMap(order =>
            order.orderItems.map(item => item.product?._id?.toString())
          );
  
          recommendedProducts = await Product.find({
            _id: { $nin: orderedProductIds },
            category: { $in: userOrders.flatMap(order =>
              order.orderItems.map(item => item.product?.category)
            )}
          }).limit(5);
        }
      }
  
      if (recommendedProducts.length === 0) {
        recommendedProducts = await Product.find().sort({ rating: -1 }).limit(5);
      }
  
      res.json(recommendedProducts);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      res.status(500).json({ error: "Something went wrong" });
    }
  };