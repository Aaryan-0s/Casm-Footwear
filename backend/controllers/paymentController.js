const catchAsyncError = require("../middleware/catchAsyncError");

const stripe = require("stripe")("sk_test_51OVFOoSClNZKRtJGMcP1KbIekbQqfdwHkpQr2QGU32zbEfXsR85KPHs5QRvo3B04YtPEbqGuVECL8PBvr8Ej4D7q00uqBUVD2A");

exports.processPayment = catchAsyncError(async (req, res, next) => {
  const myPayment = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: "inr",
    description: "Ecommerce Master Project",
    metadata: {
      company: "Ecommerce Master",
    },
  });

  res
    .status(200)
    .json({ success: true, client_secret: myPayment.client_secret });
});

exports.sendStripeApiKey = catchAsyncError(async (req, res, next) => {
  res.status(200).json({ stripeApiKey: "pk_test_51OVFOoSClNZKRtJG4ws0OUBLWxxi9jjdKYGFRx7d2eAN7jmlORhqnXASomJqNuoTSxvqADwfoxzPKgVrI3Iw86pi00x6tzTkRk" });
});
