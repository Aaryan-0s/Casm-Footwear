const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError = require("../middleware/catchAsyncError");

// Add a product to the cart
exports.addToCart = catchAsyncError(async (req, res, next) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }

  const cartItem = cart.items.find(item => item.product.equals(productId));

  if (cartItem) {
    cartItem.quantity += parseInt(quantity || 1, 10);
    cartItem.total = cartItem.price * cartItem.quantity;
  } else {
    cart.items.push({
      product: productId,
      quantity: parseInt(quantity || 1, 10),
      price: product.price,
      total: product.price * parseInt(quantity || 1, 10)
    });
  }

  await cart.save();

  res.status(200).json({ cart });
});

// Remove a product from the cart
exports.removeFromCart = catchAsyncError(async (req, res, next) => {
  const { productId } = req.params;

  const cart = await Cart.findOne({ user: req.user._id });

  cart.items = cart.items.filter(item => !item.product.equals(productId));
  await cart.save();

  res.status(200).json({ cart });
});

// Get cart information
exports.getCart = catchAsyncError(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });

  res.status(200).json({ cart });
});

// Save shipping details (Not sure how cart relates to shipping details, so here's a basic example)
exports.saveShippingDetails = catchAsyncError(async (req, res, next) => {
  const { address, city, postalCode, country } = req.body;

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new ErrorHandler("Cart not found", 404));
  }

  // For demonstration purposes, adding shipping details to the cart
  cart.shippingDetails = {
    address,
    city,
    postalCode,
    country
  };

  await cart.save();

  res.status(200).json({ cart });
});
