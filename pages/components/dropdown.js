// components/Dropdown.js
import React, { useState } from 'react'
import Image from 'next/image'
const Dropdown = ({ option, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false) // 控制下拉菜單是否展開
  const [openOption, setopenOption] = useState(null) // 控制子菜單是否展開

  return (
    <div className="c2 relative w-full">
      <div onClick={() => setIsOpen(!isOpen)} className="flex w-full justify-between rounded-lg bg-gray-800 p-8 ">
        <span> 選擇選項</span>{' '}
        {option?.subitem && <Image src={`/images/36x/Hero/chevron-down.svg`} alt="close" width={36} height={36} />}
      </div>
      {isOpen && (
        <div className="absolute mt-4   w-full  rounded-lg bg-gray-800">
          {option &&
            option.map((option) => (
              <div
                key={option.value}
                className=" relative flex w-full cursor-pointer justify-between  px-6 py-8 first:rounded-t-lg last:rounded-b-lg hover:bg-gray-700"
                onClick={() => {
                  setopenOption(option.value)
                }}
              >
                <span> {option.name}</span>
                <Image src={`/images/36x/Hero/chevron-right.svg`} alt="close" width={36} height={36} />
                {openOption && openOption === option.value && option.subitem && (
                  <div className="absolute left-full top-0  ml-4 mt-0 w-full  rounded-lg border  bg-gray-800">
                    {option.subitem &&
                      option.subitem.map((subitem) => (
                        <div
                          key={subitem.value}
                          className="cursor-pointer p-2 px-6 py-8 first:rounded-t-lg  last:rounded-b-lg hover:bg-gray-700"
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
