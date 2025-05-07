const express = require("express");
const router = express.Router();
const {
  logoutUser,
  getUserProfile,
  updateUserProfile,
  updatePassword,
  loginUser,
  registerUser,
  getAllUsers,
  toggleBlockUser,
} = require("../controllers/userController");
const { authenticate, admin } = require("../middleware/auth");

router.route("/profile").get(authenticate, getUserProfile);

router.route("/profile").put(authenticate, updateUserProfile);

router.route("/profile/password").put(authenticate, updatePassword);

router.route("/login").post(loginUser);

router.post("/logout", authenticate, logoutUser);

router.route("/register").post(registerUser);

router.route("/").get(authenticate, admin, getAllUsers);
router.route("/:id/toggle-block").put(authenticate, admin, toggleBlockUser);

module.exports = router;
