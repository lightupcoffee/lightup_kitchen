// components/Dialog.js
import React from 'react'

const Dialog = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50  flex  justify-center bg-orange-500 bg-opacity-30 pt-10">
      <div
        className="absolute  w-full max-w-2xl rounded-lg bg-gray-900  "
        style={{ top: '33%', transform: 'translateY(-50%)' }}
      >
        {children}
        {/* <div className="mt-4 text-right">
          <button className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700" onClick={onClose}>
            Close
          </button>
        </div> */}
      </div>
    </div>
  )
}

export default Dialog
