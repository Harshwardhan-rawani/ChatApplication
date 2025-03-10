import React from 'react'

function Contactloading() {
  return (
    <div>
           <div className="flex items-center space-x-4 animate-pulse">
            <div className="size-10 rounded-full bg-gray-200"></div>
            <div className="flex flex-col space-y-2">
              <div className="h-2 rounded bg-gray-200 w-40"></div>
              <div className="h-2 rounded bg-gray-200 w-40"></div>
            </div>
          </div>
    </div>
  )
}

export default Contactloading
