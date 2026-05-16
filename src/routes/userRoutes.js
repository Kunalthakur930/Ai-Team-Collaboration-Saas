const express = require("express");
const protect = require("../middlewares/authMiddleware");
const {
  registeredUser,
  loginUser,
  getMe,
} = require("../controllers/userController");
const router = express.Router();
router.post("/register", registeredUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
module.exports = router;
