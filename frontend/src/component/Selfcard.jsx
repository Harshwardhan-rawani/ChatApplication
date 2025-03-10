import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { FaTimes } from "react-icons/fa";

function Selfcard({ User, fun }) {
 
//   const [image, setImage] = useState(user.image || "/default-avatar.png");
//   const [about, setAbout] = useState(user.about || '');

//   useEffect(() => {
//     setImage(user.image || "/default-avatar.png");
//     setAbout(user.about || '');
//   }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div
      className="relative max-w-sm mx-auto p-6 bg-white shadow-xl rounded-lg flex flex-col items-center space-y-4"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Close Button */}
      <button 
        className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
        onClick={()=>fun()}
      >
        <FaTimes size={20} />
      </button>

      {/* Profile Image */}
      {/* <label htmlFor="imageUpload" className="cursor-pointer">
        <img
          src={image}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
        />
        <input
          type="file"
          id="imageUpload"
          className="hidden"
          accept="image/*"
          onChange={handleImageChange}
        />
      </label> */}

      {/* Username (Fixed, Not Editable) */}
      <p className="text-xl font-bold text-center">{User.username}</p>

      {/* Phone Number (Fixed, Not Editable) */}
      {User.phone && <p className="text-gray-500">📞 {User.phone}</p>}

      {/* About Section (Editable) */}
      {/* <textarea
        className="w-full p-2 text-sm text-center border border-gray-300 rounded-md focus:outline-none"
        rows="3"
        placeholder="Write something about yourself..."
        value={about}
        onChange={(e) => setAbout(e.target.value)}
      ></textarea> */}
    </motion.div>
  );
}

export default Selfcard;
