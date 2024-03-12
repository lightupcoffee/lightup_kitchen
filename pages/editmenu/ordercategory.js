import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import axios from '../../utils/axiosInstance'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

const OrderCategory = ({ initcategory, onClose, update }) => {
  const [categorys, setCategorys] = useState(initcategory)
  const [sortchange, setSortchange] = useState(false)
  const initsort = JSON.stringify(initcategory.map((x) => x.categoryid))

  useEffect(() => {
    setSortchange(JSON.stringify(categorys.map((x) => x.categoryid)) !== initsort)
  }, [categorys])

  const updateProductSort = async () => {
    try {
      await axios({
        method: 'post',
        url: '/category/updateCategorySort',
        data: {
          data: categorys.map((x, index) => {
            return { id: x.categoryid, sort: index }
          }),
        },
      }).then(() => {
        update()
        onClose()
      })
    } catch (error) {
      console.error('Failed to fetch data:', error)
    }
  }

  const handleOnDragEnd = (result) => {
    if (!result.destination) return

    const items = Array.from(categorys)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setCategorys(items) // 這裡呼叫 setCategorys 來更新狀態

    //updateCategory(newProductGroup)
  }
  return (
    <div className="">
      <div className="c2 flex justify-between rounded-t-lg bg-gray-800 px-6 py-3.5 ">
        <span>群組排序</span>
        <div className="grid cursor-pointer place-items-center " onClick={onClose}>
          <Image src={`/images/36x/Hero/x-mark.svg`} alt="close" width={18} height={18} />
        </div>
      </div>
      <div className="border-b-1 border-gray-700 p-6">
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="droppableId">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="rounded-lg  bg-gray-800 pb-4">
                <div className="hide-scrollbar flex  min-h-80 flex-col gap-2.5 overflow-auto p-4 pb-0">
                  {categorys.map((category, index) => (
                    <Draggable key={category.categoryid} draggableId={category.categoryid.toString()} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`flex items-center gap-2 rounded-default  bg-gray-700 px-4 py-3 shadow-lv2 ring-2 ring-gray-600 `}
                        >
                          <div>
                            <Image
                              className="mx-auto"
                              src={`/images/36x/Hero/bars-3.svg`} // 圖片的路徑
                              alt="bars-3" // 圖片描述
                              width={18} // 圖片的寬度
                              height={18} // 圖片的高度
                            />
                          </div>
                          <div className="c2">{category.name}</div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
      <div className="c1 flex w-full gap-4 border-t-1 p-4 ">
        <div className="w-full cursor-pointer  rounded-default bg-gray-800 py-3.5 text-center" onClick={onClose}>
          取消
        </div>
        <div
          className={`w-full cursor-pointer  rounded-default bg-orange-500 py-3.5 text-center ${sortchange ? '' : 'cursor-not-allowed bg-opacity-30 text-gray-600'}`}
          onClick={updateProductSort}
        >
          儲存排序
        </div>
      </div>
    </div>
  )
}

export default OrderCategory
