/**
 * Routes for user signup and login
 */
const express = require("express");
const router = express.Router();
const { signup, login } = require("../services/userService");

// POST /api/auth/signup
router.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await signup(username, password);
    res.status(201).json({ message: "User created", userId: user.id });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const { token, user } = await login(username, password);
    res.json({ token, userId: user.id });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
});

module.exports = router;
