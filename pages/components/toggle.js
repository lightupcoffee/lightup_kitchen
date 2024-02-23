import React, { useState } from 'react'

const Toggle = () => {
  const [isToggled, setIsToggled] = useState(false)

  const toggleClass = 'transform translate-x-5'
  return (
    <div className="flex items-center justify-center ">
      {/* Toggle container */}
      <div
        className="flex h-5 w-9 cursor-pointer items-center rounded-full bg-orange-600 p-1"
        onClick={() => setIsToggled(!isToggled)}
      >
        {/* Toggle circle */}
        <div
          className={`h-4 w-4 transform rounded-full bg-white shadow-md duration-300 ease-in-out ${
            isToggled ? toggleClass : ''
          }`}
        ></div>
      </div>
    </div>
  )
}

export default Toggle
