/**
 * Handles signup/login user logic with file-based storage.
 */
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { readJSON, writeJSON } = require("../utils/fileDb");

const USERS_FILE = "./users.json";

async function signup(username, password) {
  const users = readJSON(USERS_FILE);
  if (users.find((u) => u.username === username)) {
    throw new Error("Username already exists");
  }
  const hashed = await bcrypt.hash(password, 10);
  const newUser = { id: uuidv4(), username, passwordHash: hashed };
  users.push(newUser);
  writeJSON(USERS_FILE, users);
  return newUser;
}

async function login(username, password) {
  const users = readJSON(USERS_FILE);
  const user = users.find((u) => u.username === username);
  if (!user) throw new Error("Invalid credentials");

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) throw new Error("Invalid credentials");

  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET || "demo_secret",
    { expiresIn: "6h" }
  );
  return { token, user };
}

module.exports = { signup, login };
