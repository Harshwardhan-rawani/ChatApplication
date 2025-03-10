const express = require("express");
const { registerUser, loginUser,getContact, getChatUser } = require("../controller/register");

const router = express.Router();

// Register Route
router.post("/register", registerUser);

// Login Route
router.post("/login", loginUser);
router.get("/api/users/contacts", getContact);
router.get("/api/data/:phoneNumber", getChatUser);

module.exports = router;
