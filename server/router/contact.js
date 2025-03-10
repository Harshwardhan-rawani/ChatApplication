const express = require("express");
const {
  createUser,
  deleteUser,
  getContact
} = require("../controller/contact");

const router = express.Router();

// Routes
router.post("/contact", createUser); 
router.get("/contact", getContact); 
router.delete("contact/:id", deleteUser);  

module.exports = router;
