const express =  require("express");
const router = express.Router();

const  {
  createOrder,
  getAllOrders,cancelOrder,
  getUserOrders,
  countTotalOrders,
  calculateTotalSales,reorderOrder,
  calcualteTotalSalesByDate,
  findOrderById,
  markOrderAsPaid,
  markOrderAsDelivered,
} =require("../controllers/orderController.js");

const { authenticate } =require( "../middlewares/authMiddleware.js");

router.route("/").post(authenticate, createOrder)
//.get(authenticate, getAllOrders);

router.post("/:id/reorder", reorderOrder);


router.route("/mine").get(authenticate, getUserOrders);
router.route("/total-orders").get(countTotalOrders);
router.route("/total-sales").get(calculateTotalSales);
router.route("/total-sales-by-date").get(calcualteTotalSalesByDate);
router.route("/:id").get(authenticate, findOrderById);
router.route("/:id/pay").put(authenticate, markOrderAsPaid);
router.route("/:id/deliver").put(authenticate, markOrderAsDelivered);

router.delete("/:id/cancel",authenticate, cancelOrder); // Change to DELETE method


module.exports = router; 