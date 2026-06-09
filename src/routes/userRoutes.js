const express = require("express");
const protect = require("../middlewares/authMiddleware");
const {
  registeredUser,
  loginUser,
  getMe,
  forgotPassword,
  resetPassword,
} = require("../controllers/userController");
const router = express.Router();
router.post("/register", registeredUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.get("/me", protect, getMe);
router.put("/reset-password/:token", resetPassword);
module.exports = router;
