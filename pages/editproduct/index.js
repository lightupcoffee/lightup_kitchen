import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import axios from '../../utils/axiosInstance'
import Dialog from '../components/dialog'
import Toggle from '../components/toggle'
import Loading from '../components/loading'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

const EditProduct = () => {
  const [categorys, setCategorys] = useState([])
  const [products, setProducts] = useState([])
  const [productGroup, setProductGroup] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    getCategory()
    getProduct()
    setIsLoading(false)
  }, [])

  useEffect(() => {
    setProductGroup(
      categorys.map((c) => ({
        category: c,
        products: products.filter((x) => x.categoryid === c.categoryid).sort((a, b) => a.sort - b.sort),
      })),
    )
  }, [products, categorys])

  const getCategory = async () => {
    try {
      const res = await axios.get('/category/getAllCategory')
      setCategorys(res.data)
    } catch (error) {
      console.error('Failed to fetch data:', error)
    }
  }

  const getProduct = async () => {
    try {
      const res = await axios.get('/product/getAllProduct')
      setProducts(res.data)
    } catch (error) {
      console.error('Failed to fetch getAllProduct:', error)
    }
  }

  const updateProduct = async (productid, data) => {
    try {
      await axios({
        method: 'post',
        url: '/product/updateProduct',
        data: {
          id: productid,
          data: data,
        },
      }).then(() => {
        getProduct()
      })
    } catch (error) {
      console.error('Failed to fetch data:', error)
    }
  }
  const updateProductSort = async (data) => {
    try {
      await axios({
        method: 'post',
        url: '/product/updateProductSort',
        data: {
          data: data,
        },
      }).then(() => {
        getProduct()
      })
    } catch (error) {
      console.error('Failed to fetch data:', error)
    }
  }
  const handleOnDragEnd = (result) => {
    if (!result.destination) return

    const sourceIndex = result.source.index
    const destinationIndex = result.destination.index
    const categoryId = result.source.droppableId

    const categoryIndex = productGroup.findIndex((group) => group.category.categoryid.toString() === categoryId)
    const newProductsArray = Array.from(productGroup[categoryIndex].products)
    const [removed] = newProductsArray.splice(sourceIndex, 1)
    newProductsArray.splice(destinationIndex, 0, removed)

    const newProductGroup = Array.from(productGroup)
    newProductGroup[categoryIndex].products = newProductsArray
    setProductGroup(newProductGroup)
    updateProductSort(
      newProductsArray.map((x, index) => {
        return { id: x.productid, sort: index }
      }),
    )
    // 這裡你可以調用API來更新後端數據
  }

  return (
    <div className="flex h-screen flex-col px-8 py-9">
      {isLoading && <Loading />}
      <div className="flex items-center gap-2">
        <div className="h3"> 編輯菜單</div>
        <div className="  cursor-pointer  rounded-sm border-2 border-gray-700  p-1 ">
          <Image
            className="mx-auto"
            src={`/images/36x/Hero/plus.svg`} // 圖片的路徑
            alt="Add Category" // 圖片描述
            width={18} // 圖片的寬度
            height={18} // 圖片的高度
          />
        </div>
      </div>
      <div className=" flex flex-1 flex-col overflow-auto pt-3.5">
        <div className=" hide-scrollbar flex  h-full w-full flex-1 gap-3.5 overflow-x-auto ">
          <DragDropContext onDragEnd={handleOnDragEnd}>
            {productGroup.map((item) => (
              <Droppable droppableId={item.category.categoryid.toString()} key={item.category.categoryid}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="flex h-full flex-col overflow-auto rounded-lg border-1 border-gray-600 bg-gray-800 pb-4"
                    style={{ minWidth: '375px' }}
                  >
                    <div className="h3 p-b-3 border-b-2 border-gray-900 px-4">{item.category.name}</div>
                    <div className="hide-scrollbar flex flex-1 flex-col gap-2.5 overflow-auto p-4 pb-0">
                      {item.products.map((product, index) => (
                        <Draggable key={product.productid} draggableId={product.productid.toString()} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="flex items-center gap-4 rounded-default bg-gray-700 px-4 py-3 ring-2 ring-gray-600"
                            >
                              <Toggle
                                value={product.active}
                                onChage={(active) =>
                                  updateProduct(product.productid, [{ column: 'active', value: active }])
                                }
                              />
                              <div>
                                <div className="c2">{product.name}</div>
                                <div className="c4">{product.description}</div>
                              </div>
                              <div className="ml-auto p-2.5">
                                <Image
                                  className="mx-auto"
                                  src={`/images/36x/Hero/pencil.svg`} // 圖片的路徑
                                  alt="Edit" // 圖片描述
                                  width={18} // 圖片的寬度
                                  height={18} // 圖片的高度
                                />
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            ))}
          </DragDropContext>
        </div>
      </div>
    </div>
  )
}

export default EditProduct
