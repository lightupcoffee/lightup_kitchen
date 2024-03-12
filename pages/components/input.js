import React, { useState, useEffect } from 'react'

const Input = ({
  label,
  helpText,
  required,
  maxLength,
  prefix,
  value,
  onChange,
  type,
  max,
  min,
  addError,
  removeError,
  placeholder,
}) => {
  const [inputFocused, setInputFocused] = useState(false)
  const [status, setStatus] = useState('normal')
  const [statusClasse, setStatusClasse] = useState('normal')
  let statusClasses = {
    normal: 'border-gray-300  placeholder-gray-400',
    fail: 'border-rose-500 ring-1 ring-rose-500',
    // success: 'border-green-500  ',
    // disabled: 'bg-gray-50',
  }

  useEffect(() => {
    if (required && (value === null || value === '')) {
      if (addError) {
        addError()
      }
    } else {
      if (removeError) {
        removeError()
      }
    }
  }, [value, required, addError, removeError])

  const handleInputChange = (event) => {
    let val = event.target.value
    if (type === 'number') {
      val = val ? Number(val) : ''
      if (min !== null && min !== undefined && val < min) {
        val = min
      }
      if (max !== null && max !== undefined && val > max) {
        val = max
      }
    }

    let s = ''
    if (required && (val === null || val === '')) {
      s = 'fail'
      if (addError) {
        addError()
      }
    } else {
      s = 'normal'
      if (removeError) {
        removeError()
      }
    }
    setStatus(s)
    setStatusClasse(statusClasses[s])

    if (onChange) {
      onChange(val) // 調用從父組件傳遞過來的 onChange 函數
    }
  }

  return (
    <div className="flex flex-col space-y-2">
      <label className={`c4 ${inputFocused && status === 'normal' ? 'text-orange-500' : 'text-gray-500'}`}>
        {label}
      </label>
      <div
        className={`${statusClasse} flex items-center rounded-default bg-gray-800 p-4   ${inputFocused ? 'ring-1 ring-orange-500' : ''} `}
      >
        {prefix && <span className="c2 mr-1  text-gray-400">{prefix}</span>}
        <input
          type={type || 'text'}
          className={`c2 w-full bg-gray-800 text-white `}
          disabled={status === 'disabled'}
          maxLength={maxLength}
          onFocus={() => setInputFocused(true)}
          onBlur={() => setInputFocused(false)}
          value={value}
          onChange={handleInputChange}
          min={0}
          placeholder={placeholder}
        />
        {maxLength && <span className="c4 ml-2 text-gray-400">{`${value?.length || 0}/${maxLength}`}</span>}
      </div>
      {status === 'fail' && <p className={`c4 text-rose-500`}>{helpText}</p>}
    </div>
  )
}
export default Input
