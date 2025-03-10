import React from 'react';
import texture1 from "../assests/texture1.png";
import { FaBars } from 'react-icons/fa';

function ChatLoading() {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-green-50" >
      <div className="flex-1 flex flex-col bg-white shadow-lg rounded-lg h-full">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 shadow-md flex items-center justify-between bg-white">
          <div className="flex items-center space-x-4 animate-pulse">
            <div className="size-10 rounded-full bg-gray-200"></div>
            <div className="flex flex-col space-y-2">
              <div className="h-2 rounded bg-gray-200 w-60"></div>
              <div className="h-2 rounded bg-gray-200 w-60"></div>
            </div>
          </div>
          <div className="flex space-x-4 animate-pulse">
            <div className="size-6 rounded-full bg-gray-200"></div>
            <div className="size-6 rounded-full bg-gray-200"></div>
            <button className="md:hidden cursor-pointer">
              <FaBars className="text-xl" />
            </button>
          </div>
        </div>

        {/* Chat Body */}
        <div
  className="flex-1 h-full overflow-y-auto p-4 space-y-2 relative"
  style={{ background: `url(${texture1})` }}
>
    <div className='flex justify-start'>
    <div className="h-14 rounded bg-gray-200 w-36 animate-pulse "></div>
    </div>
    <div className='flex justify-end'>
    <div className="h-14 rounded bg-gray-200 w-36 animate-pulse "></div>
    </div>
    <div className='flex justify-start'>
    <div className="h-14 rounded bg-gray-200 w-36 animate-pulse "></div>
    </div>
    <div className='flex justify-end'>
    <div className="h-14 rounded bg-gray-200 w-36 animate-pulse "></div>
    </div>
 
</div>

        {/* Message Input */}
        <div className="p-4 flex gap-2 border-t items-center border-gray-200 bg-white">
          <div className="h-10 rounded bg-gray-200 w-full animate-pulse"></div>
          <div className="size-10 rounded-full bg-gray-200"></div>
        </div>
      </div>
    </div>
  );
}

export default ChatLoading;
