const {
    getAllOrdersByUserId,
    getAllOrders,
    getOrderListAdmin,
  } = require("../controllers/orderController");
  const { authenticate, authorizeRole } = require("../middlewear/authMiddlewear");
  
  const router = require("express").Router();
  
  router.use(authenticate);
  router.get("/all", authorizeRole("admin"), getAllOrders);
  router.get("/admin/all", authorizeRole("admin"), getOrderListAdmin);
  router.get("/:id",authorizeRole("user"), getAllOrdersByUserId);
  
  module.exports = router;
  
