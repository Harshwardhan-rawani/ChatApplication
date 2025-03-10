const User = require("../model/register");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

exports.registerUser = async (req, res) => {
  try {
    const { username, phoneNumber, password } = req.body;

    
    if (!username || !phoneNumber || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await User.findOne({ phoneNumber });
    if (userExists) {
      return res.status(400).json({ message: "Phone number already registered" });
    }

    
    const newUser = new User({ username, phoneNumber, password });
    await newUser.save();

    // Generate token
    const token = generateToken(newUser._id);

    res.status(201).json({
      message: "User registered successfully",
      user: { id: newUser._id, username: newUser.username, phoneNumber: newUser.phoneNumber },
      token
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


exports.loginUser = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    if (!phoneNumber || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }


    const user = await User.findOne({ phoneNumber });
    
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }


    const token = generateToken(user._id);

    res.status(200).json({
      message: "Login successful",
      user: { id: user._id, username: user.username, phoneNumber: user.phoneNumber },
      token
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getContact = async(req,res)=>{
  if(req.query.category == "All"){
    try {
      const users = await User.find({}, "username phoneNumber"); // Fetch username and phone number
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }
  else if(req.query.category == "Contact"){
    
  }

}


exports.getChatUser = async (req, res) => {
    try {
        const { phoneNumber } = req.params;
       
 
        const user = await User.findOne({ phoneNumber });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
