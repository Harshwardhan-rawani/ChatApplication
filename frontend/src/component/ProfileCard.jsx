import { FaPhone, FaVideo, FaTimes } from "react-icons/fa";

const ProfileCard = ({ image, name, phone, about, isOnline, onVoiceCall, onVideoCall, hideshow }) => {
    return (
        <div className="relative max-w-sm bg-white shadow-lg rounded-xl p-20 flex flex-col items-center ">
            {/* Close Button */}
            <button 
                onClick={hideshow} 
                className="absolute top-2 right-2 p-2 text-gray-500 hover:text-gray-700"
            >
                <FaTimes className="text-xl" />
            </button>

            {/* Profile Image */}
            <img className="w-24 h-24 rounded-full border-4 border-gray-400" src={image} alt={name} />

            {/* Name & Status */}
            <h2 className="text-xl font-bold mt-3">{name}</h2>
            <p className="text-gray-500">{phone}</p>
            <span className={`text-sm font-semibold ${isOnline ? "text-green-500" : "text-gray-400"}`}>
                {isOnline ? "Online" : "Offline"}
            </span>

            {/* About Section */}
            <p className="text-gray-600 mt-2 text-center">{about}</p>

            {/* Buttons */}
            <div className="flex mt-4 space-x-4">
                <button onClick={onVoiceCall} className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600">
                    <FaPhone className="text-lg" />
                </button>
                <button onClick={onVideoCall} className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600">
                    <FaVideo className="text-lg" />
                </button>
            </div>
        </div>
    );
};

export default ProfileCard;
