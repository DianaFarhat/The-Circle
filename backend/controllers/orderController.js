const Order =require ("../models/orderModel.js");
const Product = require ("../models/productModel.js");
const mongoose =require("mongoose")
// Utility Function
function calcPrices(orderItems) {
  const itemsPrice = orderItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxRate = 0.15;
  const taxPrice = (itemsPrice * taxRate).toFixed(2);

  const totalPrice = (
    itemsPrice +
    shippingPrice +
    parseFloat(taxPrice)
  ).toFixed(2);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice,
    totalPrice,
  };
}
exports.createOrder = async (req, res) => {
  try {
    console.log("✅ Received order request");
    console.log("📝 Request Body:", req.body);

    const { orderItems, shippingAddress, paymentMethod,user } = req.body;

    if (!orderItems || orderItems.length === 0) {
      console.log("❌ No order items provided");
      return res.status(400).json({ error: "No order items" });
    }

    console.log("🔍 Fetching products from database...");
    const productIds = orderItems.map((item) => item.productId);

    const productsFromDB = await Product.find({ _id: { $in: productIds } });

    console.log("📦 Found products:", productsFromDB);

    const dbOrderItems = orderItems.map((item) => {
      const product = productsFromDB.find((p) => p._id.toString() === item.productId);

      if (!product) {
        console.log(`❌ Product not found: ${item.productId}`);
        return res.status(404).json({ error: `Product not found: ${item.productId}` });
      }

      return {
        name: product.name,
        image: product.image,
        price: product.price,
        product: product._id,
        qty: item.qty,
      };
    });

    console.log("📌 Final Order Items:", dbOrderItems);

    const itemsPrice = dbOrderItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    const shippingPrice = itemsPrice > 100 ? 0 : 10; // Example logic
    const taxPrice = Number((0.15 * itemsPrice).toFixed(2)); // 15% tax
    const totalPrice = itemsPrice + shippingPrice + taxPrice;

   

    console.log("💰 Calculated Prices:", { itemsPrice, taxPrice, shippingPrice, totalPrice });

    const order = new Order({
      orderItems: dbOrderItems,
      user: new mongoose.Types.ObjectId(user), // ✅ Convert user to ObjectId
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    console.log("📜 Saving order...");
    const createdOrder = await order.save();
    
    console.log("✅ Order created successfully:", createdOrder);

     // 🔻 Deduct Stock Quantity 🔻
     for (const item of dbOrderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        product.countInStock -= item.qty; // Deduct ordered quantity from stock
        await product.save(); // Save the updated stock
      }
    }
    console.log("✅ Product stock updated successfully");

    res.status(201).json(createdOrder);
  } catch (error) {
    console.log("🚨 Error creating order:", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user", "id username");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserOrders = async (req, res) => {
    console.log("hit")
  try {
    const { userId } = req.query; // Get userId from query parameters
    console.log(userId)
    useridObject= new mongoose.Types.ObjectId(userId)
    const orders = await Order.find({ user: useridObject });
    console.log(orders)

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.countTotalOrders = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    res.json({ totalOrders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.calculateTotalSales = async (req, res) => {
  try {
    const orders = await Order.find();
    const totalSales = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    res.json({ totalSales });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.calcualteTotalSalesByDate = async (req, res) => {
  try {
    const salesByDate = await Order.aggregate([
      {
        $match: {
          isPaid: true,
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$paidAt" },
          },
          totalSales: { $sum: "$totalPrice" },
        },
      },
    ]);

    res.json(salesByDate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.findOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "username email"
    );

    if (order) {
      res.json(order);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.markOrderAsPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.payer.email_address,
      };

      const updateOrder = await order.save();
      res.status(200).json(updateOrder);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.markOrderAsDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    const { userId } = req.query; // Get userId from query parameters

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Ensure the user requesting the cancellation owns the order
    if (order.user.toString() !== userId.toString()) {
      return res.status(403).json({ error: "You are not authorized to cancel this order" });
    }

    // Prevent canceling a paid order
    if (order.isPaid) {
      return res.status(400).json({ error: "Cannot cancel a paid order" });
    }

    // Restore stock quantities
    for (const item of order.orderItems) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { countInStock: item.qty } }, // Increase stock by ordered quantity
        { new: true }
      );
    }

    // Delete the order after restoring stock
    await Order.deleteOne({ _id: order._id });

    res.json({ message: "Order has been successfully canceled, and stock has been restored." });
  } catch (error) {
    console.error("🚨 Error canceling order:", error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
};

exports.reorderOrder = async (req, res) => {
  console.log("hit reorder");
  try {
    // Find the order by ID
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Extract product details including qty
    const reorderedItems = order.orderItems.map((item) => ({
      product: item.product, // Product ID
      qty: item.qty, // Quantity
    }));

    // Fetch full product details from MongoDB
    const productsFromDB = await Product.find({ _id: { $in: reorderedItems.map(item => item.product) } });

    // Map product details with corresponding quantities
    const productsWithQty = productsFromDB.map((product) => {
      const matchingItem = reorderedItems.find((item) => item.product.toString() === product._id.toString());
      return {
        ...product.toObject(),
        qty: matchingItem ? matchingItem.qty : 1, // Ensure qty is included
      };
    });

    console.log("📦 Found products with qty:", productsWithQty);

    // Return the products to be added to the cart
    res.json(productsWithQty);
  } catch (error) {
    console.error("Error in reorder function:", error);
    res.status(500).json({ message: "Server error" });
  }
};

