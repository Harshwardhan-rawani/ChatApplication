import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { FaUserCircle,FaCheck } from "react-icons/fa";
import { io } from "socket.io-client";
import { IoAddCircleSharp } from "react-icons/io5";
import Contactloading from "./Contactloading";
const socket = io(`${import.meta.env.VITE_API_URL}`);
import { FaClock, FaUserFriends, FaThList } from "react-icons/fa";
import { Tooltip } from "react-tooltip";
import { toast } from 'react-toastify';
import { UserX } from "lucide-react";
import { AiOutlineLogout } from "react-icons/ai";
import { AuthContext } from "../context/AuthContext";
import { useData } from "../context/UserContext";
function Contact({user,fun,funself,ihs}) {
   const {Alluser} = useData()


  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState({});
  const [unreadCounts, setUnreadCounts] = useState({});
   const {logout} = useContext(AuthContext)
   const [addedUsers, setAddedUsers] = useState(new Set()); // Stores user IDs

   const handleAddUser = (id) => {
     createUser(id);
 
     setAddedUsers((prevAddedUsers) => {
       const newSet = new Set(prevAddedUsers);
       if (newSet.has(id)) {
         newSet.delete(id); // Remove if already added
       } else {
         newSet.add(id); // Add if not in the set
       }
       return newSet;
     });
   };
 

  const createUser = async (id) => {
  
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/contact`, {
        id: user.id,
        contactId: id,
      });

      console.log("User Created:", response.data);
     
    } catch (error) {
      console.error("Error creating user:", error);
   
    }
  };
  

  const fetchContacts = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
  
    try {
      let fetchedData = [];
  
      if (selectedCategory === "All") {
        fetchedData = Alluser || [];
      } 
      else if (selectedCategory === "Contact") {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/contact`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
      
        const allUserIds = new Set(response.data.map((user) => String(user.id)));
      
        fetchedData = Alluser?.filter((contact) => allUserIds.has(String(contact._id)));
      } 
      else if (selectedCategory === "Active") {
        // Show only online users
        fetchedData = contacts.filter((user )=> onlineUsers?.[user.phoneNumber]=== "online");
      }
  
      setContacts(fetchedData);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setLoading(false);
    }
  };
  
  
  useEffect(() => {
    fetchContacts();
  }, [selectedCategory, Alluser, onlineUsers]); 
  
  

  

  useEffect(() => {
    socket.on("updateUserStatus", (data) => {
      setOnlineUsers(data.onlineUsers);
    });
  
    return () => {
      socket.off("updateUserStatus");
    };
  }, []);
  

  const filteredContacts = (contacts || []).filter((contact) =>
    contact.username?.toLowerCase().startsWith(searchTerm.toLowerCase().trim())
  );

  const markMessagesAsRead = (senderId, receiverId) => {
    if (!socket) return;
  
 
    socket.emit("markMessagesAsRead", { senderId, receiverId });
  
  
    setUnreadCounts((prevCounts) => ({
      ...prevCounts,
      [senderId]: 0, 
    }));
  };


  return (
    <>
   
    <div className="w-full h-screen max-w-lg bg-[#F9FBFC]  rounded-md py-5 px-2 md:px-0 mx-auto md:max-w-md sm:max-w-sm cursor-pointer">
      <div className="flex items-center justify-between h-fit pb-4 px-1 border-b border-gray-200">
        {user ? (
          <>
           
            <div className="flex items-center space-x-4">
            <img
              className="w-12 h-12 rounded-full object-cover"
              src={user.image || "/default-profile.jpg"}
              onClick={()=>ihs()}
              alt="My Profile"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "block";
              }}
            />
            <FaUserCircle className="w-12 h-12 text-gray-500 hidden" />
            <div  onClick={()=>funself()}>
              <h2 className="text-lg font-semibold ">{user.username}</h2>
              <p className="text-sm">{user.about || "Hey, I am new user!"}</p>
            </div>
            </div>
            <motion.button
         whileTap={{ scale: 0.9 }} 
         whileHover={{ scale: 1.1 }}
      className=""
    >
   <AiOutlineLogout className="text-[#56A7A7] text-3xl" onClick={()=>{logout()}} />
    </motion.button>
          </>
        ) : (
         <Contactloading/>
        )}
      </div>
  
      <div className="mt-4 relative h-fit">
        <input
          type="text"
          placeholder="Search contacts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 border border-gray-200 rounded-full shadow-sm outline-none focus:ring-1 focus:ring-[#56A7A7]"
        />
      </div>
  
      <div className="mt-4 grid grid-cols-3 border-b h-fit border-gray-200 cursor-pointer">
  <div
    className={`flex justify-center text-xl p-1 group cursor-pointer transition duration-200 
      ${selectedCategory === "Active" ? "bg-[#56A7A7] text-white" : "text-[#56A7A7] hover:bg-[#A0DBDB]"}`}
    onClick={() => {setSelectedCategory("Active");fetchContacts()}}
  >
    <FaClock className={selectedCategory === "Acitve" ? "text-white" : "group-hover:text-white"} />
  </div>
  
  <div
    className={`flex justify-center text-xl p-1 group cursor-pointer transition duration-200 
      ${selectedCategory === "Contact" ? "bg-[#56A7A7] text-white" : "text-[#56A7A7] hover:bg-[#A0DBDB]"}`}
    onClick={() => {setSelectedCategory("Contact"); fetchContacts()}}
  >
    <FaUserCircle className={selectedCategory === "Contact" ? "text-white" : "group-hover:text-white"} />
  </div>
  
  <div
    className={`flex justify-center text-xl p-1 group cursor-pointer transition duration-200 
      ${selectedCategory === "All" ? "bg-[#56A7A7] text-white" : "text-[#56A7A7] hover:bg-[#A0DBDB]"}`}
    onClick={() => setSelectedCategory("All")}
  >
    <FaThList className={selectedCategory === "All" ? "text-white" : "group-hover:text-white"} />
  </div>
</div>

      <div className="mt-2">
        {loading ? (
          <div className="flex flex-col space-y-4">
        <Contactloading/>
        <Contactloading/>
        <Contactloading/>
        </div>
        ) : 
        filteredContacts.length > 0 ? (
          <ul className="divide-y divide-gray-300 overflow-y-scroll h-[68vh]">
            {filteredContacts.map((contact, index) => (
              <li key={index}  className="py-2 hover:bg-[#A0DBDB] rounded-sm transition duration-200">
                <div className="flex justify-between items-center pe-5">
                  <div className="flex items-center w-full space-x-4 p-2 relative">
                  <div>
                  <img
                      className="w-10 h-10 rounded-full object-cover"
                      src={contact.image || "/default-profile.jpg"}
                      alt={contact.username}
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "block";
                      }}
                    />
                    <FaUserCircle className="w-10 h-10 text-gray-500 hidden" />
                  </div>
                    <Link to={`/${contact.phoneNumber}`} className="flex-1" onClick={()=>{fun();}}>
                      <p className="text-sm font-medium  truncate">{contact.username}</p>
                      <p className="text-xs text-gray-400 truncate">{contact.phoneNumber}</p>
                    </Link>
                    {onlineUsers[contact.phoneNumber] === "online" && (
  <motion.span
    className="absolute top-2 left-2 w-3 h-3 bg-green-500 rounded-full"
    animate={{ opacity: [1, 0.3, 1] }} // Blinking effect
    transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }} // Smooth transition
  />
)}
                  </div>
                  {selectedCategory === "All" && (
                    <div>
                               <motion.button
          key={contact._id}
          onClick={() => handleAddUser(contact._id)}
          className="text-white rounded-full z-20"
          whileTap={{ scale: 0.9 }} // Shrinks on click
          whileHover={{ scale: 1.1 }} // Slightly enlarges on hover
        >
          {addedUsers.has(contact._id) ? (
            <FaCheck className="text-3xl text-[#56A7A7]" />
          ) : (
            <IoAddCircleSharp className="text-3xl text-[#56A7A7]" />
          )}
        </motion.button>

                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <motion.p
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-green-600 w-full h-64 flex flex-col justify-center items-center text-sm mt-2"
        >
          <UserX size={32} className="mb-2 text-green-600 animate-pulse" />
          No contacts found
        </motion.p>
        )}
      </div>
    </div>
    </>
  );
}

export default Contact;