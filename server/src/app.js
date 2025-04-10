const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");
const productRoutes = require("./routes/productRoutes");
const { seedAdmin } = require("./utils/seedAdmin");
dotenv.config();

const app = express();

// === Middleware ===
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

// === Logging ===
app.use(morgan(process.env.NODE_ENV === "development" ? "dev" : "combined"));

// === Routes ===
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);

// === Default Route ===
app.get("/", (req, res) => {
  res.send("Welcome to Landa.pk API!");
});

// === Connect to MongoDB & Start Server ===
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log(`MongoDB connected`);
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () =>
      console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`)
    );
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1); // Exit process with failure
  });

seedAdmin();
