import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { motion } from "framer-motion";
import Contact from "./Contact";
import { useParams } from "react-router-dom";
import { FaPhone, FaVideo, FaPaperPlane, FaBars, FaCommentDots } from "react-icons/fa";
import texture1 from "../assests/texture1.png";
import ProfileCard from "./ProfileCard";
import ChatLoading from "./ChatLoading";
import Selfcard from "./Selfcard";
import { BsThreeDotsVertical } from "react-icons/bs";

const socket = io(`${import.meta.env.VITE_API_URL}`);

function Chat() {
    const params = useParams();
    const [message, setMessage] = useState("");
    const [chats, setChats] = useState({});
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState({});
    const [user,setuser] = useState(null)
    const [data, setData] = useState(null);
    const [hideProfile,setHideProfile] = useState(false);
    const [selfhideshow,setselfhideshow] = useState(false);
    const [showSidebar, setShowSidebar] = useState(true);
    const messagesEndRef = useRef(null);
 
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
  
    // Toggle dropdown state
    const toggleDropdown = () => {
      setIsOpen(!isOpen);
    };
  
    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    useEffect(() => {
        if (!userId || !params.phoneNumber) return;
    
        const fetchMessages = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/messages/${userId}/${params.phoneNumber}`);
                setChats((prevChats) => ({
                    ...prevChats,
                    [params.phoneNumber]: response.data, 
                }));
            } catch (err) {
                console.error("Error fetching messages:", err);
            }
        };
    
        fetchMessages();
    }, [userId, params.phoneNumber]);
    
 
    useEffect(() => {
        if (!params.phoneNumber) return; 

        const fetchData = async () => {
       
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/data/${params.phoneNumber}`);
                setData(response.data);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to fetch data");
            } 
        };

        fetchData();
    }, [params.phoneNumber]);

    // Fetch user data
    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUserId(response.data.phoneNumber);
                setuser(response.data)
                // Register user in socket
                socket.emit("registerUser", { userId: response.data.phoneNumber, name: response.data.username });

            } catch (err) {
                console.error("Error fetching user:", err);
                setError(err.response?.data?.message || "Failed to fetch user");
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    
  useEffect(() => {
    if (userId) {
        socket.on("updateUserStatus", ({ onlineUsers }) => {
            setOnlineUsers(onlineUsers); 
           
        });
    }

    return () => {
        socket.off("updateUserStatus");
    };
}, [userId]);

    useEffect(() => {
        socket.on("receiveMessage", (data) => {
            setChats((prevChats) => ({
                ...prevChats,
                [data.senderId]: [...(prevChats[data.senderId] || []), data],
            }));
        });
        return () => socket.off("receiveMessage");
    }, []);

    // Auto-scroll to latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chats]);

    const sendMessage = async () => {
        if (message.trim() && params.phoneNumber && userId) {
            const now = new Date();
    
            // Extract date and time separately
            const formattedDate = now.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
            const formattedTime = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric", hour12: true });
    
            const newMessage = {
                senderId: userId,
                receiverId: params.phoneNumber,
                message,
                date: formattedDate,
                time: formattedTime,
         
            };
    
            // Update UI instantly
            setChats((prevChats) => ({
                ...prevChats,
                [params.phoneNumber]: [...(prevChats[params.phoneNumber] || []), newMessage],
            }));
    
            // Emit message to server
            socket.emit("sendMessage", newMessage);
    
            setMessage("");
        }
    };
    
    const messages = chats[params.phoneNumber] || [];

    const groupedMessages = messages.reduce((acc, msg) => {
      const date = msg.date; // Extract date
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(msg);
      return acc;
    }, {});
    const handleToggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };
  

    useEffect(() => {
      if (!socket) return;
    
 
    
      socket.on("messagesRead", ({ senderId, receiverId }) => {
        console.log(`Messages from ${senderId} to ${receiverId} are now read`);
      });
    
      return () => {
        socket.off("messagesRead");
      };
    }, [socket]);
    
    const handleProfilehideshow=()=>{
         setHideProfile(!hideProfile)
    }


 const handleselfhideshow = ()=>{
    setselfhideshow(!selfhideshow)
 }

    return (
        <>
      
      {user && (
  <div 
    className={`${selfhideshow ? "fixed inset-0 flex items-center justify-center z-50 bg-[#ffffff51] bg-opacity-50" : "hidden"}`}
  >
    <Selfcard User={user} fun={handleselfhideshow} />
  </div>
)}

        <div className="flex space-x-2 h-screen w-full cursor-pointer">
            {/* Sidebar */}
            <div className={`absolute z-10 md:relative w-full md:w-1/3 h-full bg-[#F9FBFC] shadow-md transition-transform ${showSidebar ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
                <Contact fun={handleToggleSidebar} funself={handleselfhideshow} user ={user}/>
            </div>
            
         {data ? 
         (  <>
            <div className={`${hideProfile ? "fixed z-50 inset-0 flex items-center justify-center bg-[#ffffff51]  bg-opacity-50" : "hidden"}`}>
            <ProfileCard name={data.username} phone={data.phoneNumber} isOnline={onlineUsers[params.phoneNumber]} hideshow = {handleProfilehideshow}/>
        </div>
        
        
                    {/* Main Chat */}
                    <div className="flex-1 flex flex-col h-screen bg-[#56A7A7] shadow-lg rounded-lg">
                        {/* Header */}
                        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-[#F9FBFC]">
                            <div className="flex items-center space-x-4">
                                <img className="w-10 h-10 rounded-full" src="/user-profile.jpg" alt="User" />
                                <div onClick={()=>{handleProfilehideshow()}}>
                                    <h2 className="text-lg font-bold">{data.username}</h2>
                                    <p className={`text-sm ${onlineUsers[params.phoneNumber] ? "text-green-500" : "text-gray-400"}`}>
                                        {onlineUsers[params.phoneNumber] ? "Online" : "Offline"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex space-x-4">
                            <div className="relative inline-block" ref={dropdownRef}>
      {/* Three Dots Icon */}
      <motion.div
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.1 }}
        className="cursor-pointer text-[#56A7A7] text-xl"
        onClick={toggleDropdown}
      >
        <BsThreeDotsVertical />
      </motion.div>

      {/* Dropdown Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md p-2 z-50"
        >
          <ul className="text-sm text-gray-700">
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Edit</li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Delete</li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Share</li>
          </ul>
        </motion.div>
      )}
    </div>

      <motion.div
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.1 }}
        className="cursor-pointer text-[#56A7A7] text-xl"
      >
        <FaPhone />
      </motion.div>

      <motion.div
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.1 }}
        className="cursor-pointer text-[#56A7A7] text-xl"
      >
        <FaVideo />
      </motion.div>
      <motion.button
      className="md:hidden"
      onClick={handleToggleSidebar}
      whileTap={{ scale: 0.9 }} 
      whileHover={{ scale: 1.1 }} 
    >
      <FaBars className="text-xl text-[#56A7A7]" />
    </motion.button>
                            </div>
                        </div>
                        
                        {/* Messages */}
                        <div style={{ background: `url(${texture1})` }} className="flex-1 overflow-y-auto p-4 space-y-2 bg-[#FCEA90]">
                        {Object.keys(groupedMessages).map((date, index) => (
        <div key={index} className=" p-4">
          {/* Date Header */}
          <p className="text-center text-gray-400 text-sm  mb-2">{date}</p>

          {/* Messages under the date */}
          <div className="space-y-2">
            {groupedMessages[date].map((msg, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg w-fit max-w-xs  shadow-sm text-md ${
                  msg.senderId === userId ? "bg-green-200 ml-auto" : "bg-[#F9FBFC] mr-auto"
                }`}
              >
                {msg.message}
                <span className="block text-xs mt-1 text-right text-black">{msg.time}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
                            {/* Auto-scroll target */}
                            <div ref={messagesEndRef} />
                        </div>
                        
                        {/* Message Input */}
                        <div className="p-4 flex gap-2 border-t border-gray-200 bg-[#F9FBFC]">
                            <input
                                type="text"
                                placeholder="Type a message..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="flex-1 p-3 border border-gray-200 shadow-md rounded-full outline-none focus:ring-1 focus:ring-[#56A7A7]"
                            />
                          <motion.button
      onClick={sendMessage}
      className="p-4 bg-[#56A7A7] text-white shadow-md rounded-full"
      whileTap={{ scale: 0.9 }} 
      whileHover={{ scale: 1.1 }} 
    >
      <FaPaperPlane className="text-lg" />
    </motion.button>
                        </div>
                    </div>
                    </>
         ):(
         <div className="w-2/3">
         {params.phoneNumber ? (
            <ChatLoading/>
         ):
         (   <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col items-center justify-center h-full text-gray-600"
          >
            <FaCommentDots className="text-6xl text-green-500 animate-pulse" />
            <motion.h2
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-2xl font-semibold mt-4"
            >
              Let's Start the Chat!
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="text-gray-500 mt-2 text-sm"
            >
              Select a contact and start your conversation.
            </motion.p>
          </motion.div>)}
         </div>
         )}
        </div>
        </>
    );
}

export default Chat;
