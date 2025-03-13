const mongoose = require("mongoose");

// Define Schema
const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // Unique User ID
  contact: [
    {
      id: { type: String, required: true }, 
    }
  ]
});

// Create Model
const User = mongoose.model("Contact", userSchema);

module.exports = User;
