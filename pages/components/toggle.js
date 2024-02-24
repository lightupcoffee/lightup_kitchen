import React from 'react'
import PropTypes from 'prop-types'

const Toggle = ({ value, onChage }) => {
  Toggle.propTypes = {
    value: PropTypes.bool.isRequired,
    onChage: PropTypes.func,
  }

  const toggleClass = 'transform translate-x-4'
  return (
    <div className="flex items-center justify-center ">
      {/* Toggle container */}
      <div
        className={`flex h-5 w-10 cursor-pointer items-center rounded-full  ${value === true ? 'bg-orange-600' : 'bg-gray-400'} p-1`}
        onClick={() => onChage(!value)}
      >
        {/* Toggle circle */}
        <div
          className={`h-4 w-4 transform rounded-full bg-white shadow-md duration-300 ease-in-out ${
            value === true ? toggleClass : ''
          }`}
        ></div>
      </div>
    </div>
  )
}

export default Toggle
