const express = require("express");
const router = express.Router();
const { isAuthenticatedUser } = require("../middleware/auth");
const {
  addToCart,
  removeFromCart,
  getCart,
  saveShippingDetails,
} = require("../controllers/cartController");

// Add a product to the cart
router.route("/cart/add-to-cart/:productId").post( isAuthenticatedUser, addToCart);

// Remove a product from the cart
router.delete("/cart/remove-from-cart/:productId", isAuthenticatedUser, removeFromCart);

// Get cart information
router.route("/cart/get-cart").get( isAuthenticatedUser, getCart);

// Save shipping details
router.post("/cart/save-shipping-details", isAuthenticatedUser, saveShippingDetails);

module.exports = router;
