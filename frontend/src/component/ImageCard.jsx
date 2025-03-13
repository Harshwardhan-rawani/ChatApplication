import React from "react";
import { motion } from "framer-motion";
import { FaTimes } from "react-icons/fa";

function ImageCard({ image, onClose }) {
  return (
    <motion.div
      className="relative max-w-sm bg-white rounded-lg shadow-lg overflow-hidden"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
    >
      {/* Close Button */}
      <button
        className="absolute top-2 right-2 bg-gray-800 text-white rounded-full p-1 hover:bg-red-500 transition"
        onClick={()=>onClose()}
      >
        <FaTimes size={18} />
      </button>

      {/* Image */}
      <img
        src={image || "/default-image.png"}
        alt="Preview"
        className="w-full h-64 object-cover"
      />
    </motion.div>
  );
}

export default ImageCard;
