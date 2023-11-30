const express = require("express");
const app = express();
const errorMiddleware = require("./middleware/error");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
//const dotenv = require("dotenv");
const path = require("path");
//CONFIG
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "backend/config/config.env" });
}

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

//Route Imports
const product = require("./routes/productRoute");
const user = require("./routes/userRoute");
const order = require("./routes/orderRoute");
const payment = require("./routes/paymentRoute");
const wishlist = require("./routes/wishlistRoute");
const audit=require("./routes/auditlog")
const cart = require("./routes/cartRoute");
const { urlencoded } = require("body-parser");
const AuditLog = require("./models/auditlog");
app.use('/test', (req, res) => {
  // This middleware will be triggered for GET requests to '/test'
  res.status(200).json({ message: 'This is a test endpoint for GET requests' });
});
app.use("/api/v1/", product);
app.use("/api/v1/", user);
app.use("/api/v1/", order);
app.use("/api/v1/", payment);
app.use("/api/v1/", wishlist);
app.use("/api/v1/",cart)
app.use("/api/v1/",audit)



// app.use(express.static(path.join(__dirname, "../frontend/build")));

// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
// });

// Middleware For Errors
app.use(errorMiddleware);

module.exports = app;
