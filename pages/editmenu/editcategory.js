import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import axios from '../../utils/axiosInstance'
import Input from '../components/input'

const EditCategory = ({ mode, initcategory, onClose, update }) => {
  const [category, setCategory] = useState({
    name: '',
  })

  useEffect(() => {
    setCategory(initcategory)
  }, [initcategory])

  const handleInputChange = (field) => (value) => {
    setCategory((prevCategory) => ({
      ...prevCategory,
      [field]: value,
    }))
  }
  const [errors, setErrors] = useState({})
  const addError = (key) => {
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors, [key]: true }
      return newErrors
    })
  }
  const removeError = (key) => {
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors, [key]: false }
      return newErrors
    })
  }
  const checkCategory = () => {
    if (Object.values(errors).some((x) => x === true)) {
      return
    }
    if (mode == 'create') {
      createCategory()
    } else {
      updateCategory()
    }
  }
  const updateCategory = async () => {
    try {
      const data = Object.keys(category).map((x) => {
        return { column: x, value: category[x] }
      })
      await axios({
        method: 'post',
        url: '/category/updateCategory',
        data: {
          id: category.categoryid,
          data: data,
        },
      }).then(() => {
        update()
        onClose()
      })
    } catch (error) {
      console.error('Failed to fetch data:', error)
    }
  }

  const createCategory = async () => {
    try {
      await axios({
        method: 'post',
        url: '/category/createCategory',
        data: category,
      }).then(() => {
        update()
        onClose()
      })
    } catch (error) {
      console.error('Failed to fetch data:', error)
    }
  }

  return (
    <div className="">
      <div className="c2 flex justify-between rounded-t-lg bg-gray-800 px-6 py-3.5 ">
        <span>{mode === 'create' ? '新增' : '編輯'}類別</span>
        <div className="grid cursor-pointer place-items-center " onClick={onClose}>
          <Image src={`/images/36x/Hero/x-mark.svg`} alt="close" width={18} height={18} />
        </div>
      </div>
      <div className="border-b-1 border-gray-700 p-6">
        <form>
          <div className="space-y-5 text-start">
            <Input
              label="類別名稱"
              required
              addError={() => addError('name')}
              removeError={() => removeError('name')}
              helpText="請輸入類別名稱"
              maxLength={15}
              value={category.name}
              onChange={handleInputChange('name')}
            />
          </div>
        </form>
      </div>
      <div className="c1 flex w-full gap-4 border-t-1 p-4 ">
        <div className="w-full cursor-pointer  rounded-default bg-gray-800 py-3.5 text-center" onClick={onClose}>
          取消
        </div>
        <div
          className="w-full cursor-pointer  rounded-default bg-orange-500 py-3.5 text-center "
          onClick={checkCategory}
        >
          確認
        </div>
      </div>
    </div>
  )
}

export default EditCategory
