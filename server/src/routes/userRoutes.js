const express = require("express");
const router = express.Router();
const {
  logoutUser,
  getUserProfile,
  updateUserProfile,
  updatePassword,
  loginUser,
  registerUser,
} = require("../controllers/userController");
const { authenticate } = require("../middleware/auth");

router.route("/profile").get(authenticate, getUserProfile);

router.route("/profile").put(authenticate, updateUserProfile);

router.route("/profile/password").put(authenticate, updatePassword);

router.route("/login").post(loginUser);

router.post("/logout", authenticate, logoutUser);

router.route("/register").post(registerUser);
module.exports = router;
