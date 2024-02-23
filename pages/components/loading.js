// components/Dialog.js
import React from 'react'

const Loading = () => {
  return (
    <div className="absolute inset-0 z-50  flex  justify-center bg-gray-300 bg-opacity-30 pt-10">
      <div className="flex items-center justify-center ">
        <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-orange-600"></div>
      </div>
    </div>
  )
}

export default Loading
