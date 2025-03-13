import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaTimes, FaUpload } from "react-icons/fa";
import axios from "axios";
import imageCompression from "browser-image-compression"; // Import image compression library

function Selfcard({ user, fun, tf }) {
  const [image, setImage] = useState(user?.image || "/default-avatar.png");
  const [about, setAbout] = useState(user?.about || "Hey, I am a new user!");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setImage(user?.image && user.image.trim() !== "" ? user.image : "/default-avatar.png");
    setAbout(user?.about?.trim() ? user.about : "Hey, I am a new user!");
  }, [user]);

  // Function to handle image selection and compression
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // Compression options
      const options = {
        maxSizeMB: 0.1, // Target 300KB
        maxWidthOrHeight: 500, // Resize image if necessary
        useWebWorker: true, // Improves performance
      };

      // Compress the image
      const compressedFile = await imageCompression(file, options);
      setSelectedFile(compressedFile);

      // Convert compressed image to preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error("Image compression error:", error);
    }
  };

  // Function to update profile
  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("about", about);
      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/users/update-profile/${user?.id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log(response.data);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
    setLoading(false);
  };

  return (
    <motion.div
      className="relative max-w-sm mx-auto p-10 bg-white shadow-lg rounded-xl flex flex-col items-center space-y-4"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Close Button */}
      <button
        className="absolute top-3 right-3 text-gray-500 transition"
        onClick={() => fun()}
      >
        <FaTimes size={22} />
      </button>

      {/* Profile Image Upload */}
      <label htmlFor="imageUpload" className="cursor-pointer relative">
        <img
          src={image}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover border-4 border-gray-300 shadow-md transition-transform transform hover:scale-105"
        />
        <div className="absolute bottom-0 right-0 bg-gray-800 p-1 rounded-full border-2 border-white shadow-md">
          <FaUpload size={14} className="text-white" />
        </div>
        <input
          type="file"
          id="imageUpload"
          className="hidden"
          accept="image/*"
          onChange={handleImageChange}
        />
      </label>

      {/* Username */}
      <p className="text-xl font-semibold text-gray-900">{user?.username || "Unknown User"}</p>

      {/* Phone Number */}
      {user?.phoneNumber && <p className="text-sm text-gray-500">📞 {user.phoneNumber}</p>}

      {/* About Section */}
      <textarea
        className="w-full p-3 text-sm bg-gray-100 text-gray-800 rounded-lg focus:ring-2 focus:ring-blue-400 border-none"
        rows="3"
        placeholder="Write something about yourself..."
        value={about}
        onChange={(e) => setAbout(e.target.value)}
      ></textarea>

      {/* Save Button */}
      <motion.button
        className={`w-full py-2 text-white font-semibold rounded-lg transition ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#56A7A7]"
        }`}
        onClick={() => {
          handleUpdateProfile();
          tf();
        }}
        disabled={loading}
        whileTap={{ scale: 0.9 }}
      >
        {loading ? "Updating..." : "Save Changes"}
      </motion.button>
    </motion.div>
  );
}

export default Selfcard;
