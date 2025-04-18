const User = require("../model/register");
const Contact = require("../model/contact")
const jwt = require("jsonwebtoken");

const createUser = async (req, res) => {
  try {
    const { id, contactId } = req.body;
    if (!id || !contactId) {
      return res.status(400).json({ message: "ID, Contact ID, Username, and Phone Number are required" });
    }


    let user = await Contact.findOne({ id });

    if (!user) {
      
      user = new Contact({
        id,
        contact: [{ id: contactId }],
      });

      await user.save();
      return res.status(201).json({ message: "User created successfully", user });
    }

  
    const contactExists = user.contact.some((contact) => contact.id === contactId);
    if (contactExists) {
      return res.status(400).json({ message: "Contact ID already exists for this user" });
    }


    user.contact.push({ id: contactId});

 
    await user.save();
    
    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};





// Import User model

const getContact = async (req, res) => {
  try {
   
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }


    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const Id = decoded.id; 


      const user = await Contact.findOne({ id: Id });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
   
      return res.json(user.contact);
  
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};




// ✅ Delete User (DELETE)
const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findOneAndDelete({ id: req.params.id });
    if (!deletedUser) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted", user: deletedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Export all functions
module.exports = {
  createUser,
  getContact,
  deleteUser
};
