// components/Dialog.js
import React from 'react'

const Dialog = ({ isOpen, onClose, children, top, width }) => {
  if (!isOpen) return null

  const dialogStyle = {
    top: top || '30%',
    //marginTop: top ? `-${top / 2}px` : '-15%', // 這裡假設你的彈出框高度約為 30% 的視窗高度
    width: width || '50%',
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-center bg-orange-500 bg-opacity-30 pt-10">
      <div className={`absolute w-full max-w-xl rounded-lg bg-gray-900`} style={dialogStyle}>
        {children}
      </div>
    </div>
  )
}

export default Dialog
