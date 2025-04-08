const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const morgan = require("morgan");

dotenv.config();

const app = express();

app.use(express.json());

app.user(cors());

app.use(morgan());
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.log(err);
  });

// Auth routes
app.use("/", userRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to Landa.pk API!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
