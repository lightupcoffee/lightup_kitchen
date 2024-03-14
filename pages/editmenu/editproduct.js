import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import axios from '../../utils/axiosInstance'
import Toggle from '../components/toggle'
import Input from '../components/input'
import Dialog from '../components/dialog'

const EditProduct = ({ mode, initproduct, onClose, update }) => {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    remark: '',
    price: '',
    active: true,
  })
  const [deleteProdcutDialog, setDeleteProdcutDialog] = useState(false)

  useEffect(() => {
    setProduct(initproduct)
  }, [initproduct])

  const handleInputChange = (field) => (value) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
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
  const checkProduct = () => {
    if (Object.values(errors).some((x) => x === true)) {
      return
    }
    if (mode == 'create') {
      createProduct()
    } else {
      updateProduct()
    }
  }
  const updateProduct = async () => {
    try {
      const data = Object.keys(product).map((x) => {
        return { column: x, value: product[x] }
      })
      await axios({
        method: 'post',
        url: '/product/updateProduct',
        data: {
          id: product.productid,
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

  const createProduct = async () => {
    try {
      await axios({
        method: 'post',
        url: '/product/createProduct',
        data: product,
      }).then(() => {
        update()
        onClose()
      })
    } catch (error) {
      console.error('Failed to fetch data:', error)
    }
  }
  const deleteProduct = () => {
    axios({
      method: 'post',
      url: '/product/deleteProductbyId',
      data: {
        id: product.productid,
      },
    })
      .then(async (res) => {
        setDeleteProdcutDialog(false)
        update()
        onClose()
      })
      .catch((error) => {
        console.error('Failed to fetch data:', error)
      })
  }
  return (
    <div className="">
      <div className="c2 flex justify-between rounded-t-lg bg-gray-800 px-6 py-3.5 ">
        <span>{mode === 'create' ? '新增' : '編輯'}品項</span>
        <div className="grid cursor-pointer place-items-center " onClick={onClose}>
          <Image src={`/images/36x/Hero/x-mark.svg`} alt="close" width={18} height={18} />
        </div>
      </div>
      <div className="border-b-1 border-gray-700 p-6">
        <form>
          <div className="space-y-5 text-start">
            <Input
              label="品名"
              required
              addError={() => addError('name')}
              removeError={() => removeError('name')}
              helpText="請輸入品項"
              maxLength={15}
              value={product.name}
              onChange={handleInputChange('name')}
            />
            <Input
              label="品項描述"
              maxLength={15}
              value={product.description}
              onChange={handleInputChange('description')}
            />
            <Input
              label="金額"
              required
              addError={() => addError('price')}
              removeError={() => removeError('price')}
              helpText="請輸入金額"
              prefix="$"
              value={product.price}
              onChange={handleInputChange('price')}
              type="number"
              min={0}
            />
            <Input
              label="廚房端備註"
              maxLength={10}
              value={product.remark}
              placeholder={'此欄位不顯示於菜單'}
              onChange={handleInputChange('remark')}
            />
            <div className="flex gap-4">
              <Toggle value={product.active} onChange={handleInputChange('active')} />
              <label className="c3">{product.active ? '開放品項' : '隱藏品項'}</label>
            </div>
          </div>
        </form>
      </div>
      <div className="c1 flex w-full items-center gap-4 border-t-1 p-4 ">
        {mode == 'edit' && (
          <div
            className="grow-0  cursor-pointer  rounded-default bg-gray-800 p-3.5 ring-2 ring-gray-700"
            onClick={() => setDeleteProdcutDialog(true)}
          >
            <Image src={`/images/36x/Hero/trash.svg`} alt="trash" width={24} height={24} />
          </div>
        )}
        <div
          className="grow  cursor-pointer  rounded-default bg-gray-800  py-3.5 text-center ring-2 ring-gray-700"
          onClick={onClose}
        >
          取消
        </div>
        <div className="grow  cursor-pointer  rounded-default bg-orange-500 py-3.5 text-center " onClick={checkProduct}>
          {mode == 'create' ? '新增' : '確認'}
        </div>
      </div>

      <Dialog isOpen={deleteProdcutDialog} onClose={() => setDeleteProdcutDialog(false)} width={'20%'}>
        <div className="p-6 text-center">
          <div className="">
            <Image className="mx-auto" src={`/images/App/dangericon.svg`} alt="dangericon" width={50} height={50} />
          </div>

          <div className="c1 pt-4">
            確定刪除 <span className="text-rose-500">{product.name} </span>?
          </div>
        </div>
        <div className="c1 flex w-full  gap-2 border-t-1 p-4 ">
          <div
            className="w-full cursor-pointer rounded-default bg-gray-800 py-3.5 text-center "
            onClick={() => {
              setDeleteProdcutDialog(false)
            }}
          >
            取消
          </div>
          <div
            className="w-full cursor-pointer  rounded-default bg-rose-500 py-3.5 text-center "
            onClick={() => {
              deleteProduct()
            }}
          >
            確認
          </div>
        </div>
      </Dialog>
    </div>
  )
}

export default EditProduct
