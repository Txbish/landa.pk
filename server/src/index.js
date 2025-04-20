const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo");

const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");
const productRoutes = require("./routes/productRoutes");
const sellerRequestRoutes = require("./routes/sellerRequestRoutes");
const cartRoutes = require("./routes/cartRoutes");
const { seedAdmin } = require("./utils/seed");

dotenv.config();

const app = express();

// === Allowed Origins for CORS ===
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://landa-pk.vercel.app",
];

// === Middleware ===
app.use(express.json());
app.use(cookieParser());

// === CORS Middleware ===
app.use(
  cors({
    origin: (origin, callback) => {
      console.log("CORS Origin:", origin); // Debug line

      // Allow requests with no origin (like mobile apps or curl)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"), false);
      }
    },
    credentials: true,
  })
);

// === Handle Preflight (OPTIONS) Requests Globally ===
app.options(
  "*",
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"), false);
      }
    },
    credentials: true,
  })
);

// === Session Middleware ===
app.use(
  session({
    secret: process.env.SESSION_SECRET || "some-default-secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production", // Only true in prod over HTTPS
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      sameSite: "lax", // 'lax' is safe for most cross-site cookie needs
    },
  })
);

// === Logging ===
app.use(morgan(process.env.NODE_ENV === "development" ? "dev" : "combined"));

// === Routes ===
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/seller-requests", sellerRequestRoutes);
app.use("/api/cart", cartRoutes);

// === Default Route ===
app.get("/", (req, res) => {
  res.send("Welcome to Landa.pk API!");
});

// === MongoDB Connection & Server Startup ===
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    // Seed the admin user
    await seedAdmin();

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () =>
      console.log(
        `🚀 Server running in ${process.env.NODE_ENV} on port ${PORT}`
      )
    );
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

startServer();
