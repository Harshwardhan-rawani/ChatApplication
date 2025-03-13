const express = require("express");
const { registerUser, loginUser, getChatUser, updateContact, getprofile } = require("../controller/register");

const router = express.Router();

const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "profile_pictures", 
      allowed_formats: ["jpg", "png", "jpeg"],
    },
  });
  const upload = multer({ storage });

// Register Route
router.post("/register", registerUser);
router.put("/api/users/update-profile/:id",upload.single("image"),updateContact)
// Login Route
router.post("/login", loginUser);
router.get("/api/data/:phoneNumber", getChatUser);
router.get("/api/users/profile/:id",getprofile);

module.exports = router;
