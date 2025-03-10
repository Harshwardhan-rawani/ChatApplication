const mongoose = require("mongoose");

// Define Schema
const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // Unique User ID
  contact: [
    {
      id: { type: String, required: true }, // Contact ID
      username: { type: String, required: true }, // Contact Username
      phoneNumber: { type: String, required: true } // Contact Phone Number
    }
  ]
});

// Create Model
const User = mongoose.model("Contact", userSchema);

module.exports = User;
