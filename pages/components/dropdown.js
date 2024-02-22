// components/Dropdown.js
import React, { useState } from 'react'
import Image from 'next/image'
const Dropdown = ({ option, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false) // 控制下拉菜單是否展開
  const [openOption, setopenOption] = useState(null) // 控制子菜單是否展開

  return (
    <div className="c2 relative w-full">
      <div onClick={() => setIsOpen(!isOpen)} className="flex w-full justify-between rounded-default bg-gray-800 p-4 ">
        <span> 選擇選項</span>{' '}
        {option?.subitem && <Image src={`/images/36x/Hero/chevron-down.svg`} alt="close" width={18} height={18} />}
      </div>
      {isOpen && (
        <div className="absolute mt-2   w-full  rounded-default bg-gray-800">
          {option &&
            option.map((option) => (
              <div
                key={option.value}
                className=" relative flex w-full cursor-pointer justify-between  px-3 py-4 first:rounded-t-default last:rounded-b-default hover:bg-gray-700"
                onClick={() => {
                  setopenOption(option.value)
                }}
              >
                <span> {option.name}</span>
                <Image src={`/images/36x/Hero/chevron-right.svg`} alt="close" width={18} height={18} />
                {openOption && openOption === option.value && option.subitem && (
                  <div className="absolute left-full top-0  ml-2 mt-0 w-full  rounded-default border  bg-gray-800">
                    {option.subitem &&
                      option.subitem.map((subitem) => (
                        <div
                          key={subitem.value}
                          className="cursor-pointer p-1 px-3 py-4 first:rounded-t-default  last:rounded-b-default hover:bg-gray-700"
                          onClick={() => onSelect(subitem.value)}
                        >
                          {subitem.name}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  )
}

export default Dropdown
