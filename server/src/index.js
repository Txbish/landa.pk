const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo");
const path = require("path");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");

const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");
const productRoutes = require("./routes/productRoutes");
const sellerRequestRoutes = require("./routes/sellerRequestRoutes");
const cartRoutes = require("./routes/cartRoutes");
const { seedAdmin } = require("./utils/seed");

dotenv.config();

const app = express();

// === Rate Limiting ===
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests from this IP, please try again after 15 minutes",
});
app.use(limiter);

// === Body Parsers ===
app.use(express.json());
app.use(cookieParser());

// === Data Sanitization ===
app.use(mongoSanitize());
app.use(xss());

// === CORS Configuration ===
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://landa-pk.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      console.log("CORS Origin:", origin); // Debug
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"), false);
      }
    },
    credentials: true,
  })
);

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
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
      sameSite: "lax",
    },
  })
);

// === Logger ===
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

// === Start Server ===
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

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
