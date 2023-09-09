import React, { memo, useState } from 'react'
import type { FC, ReactNode } from 'react'
import { menuData } from '../common/Common'
import s from './Left.module.scss'
import MenuItem from './MenuItem'
interface IProps {
  children?: ReactNode
  updateTitle: (title:string) => void
}

const Left: FC<IProps> = ({ updateTitle }) => {
  let currentIndex = 0;
  const newData = menuData.map((item) => {
    const updatedSubMenu = item.subMenu.map((subItem) => ({
      ...subItem,
      currentIndex: currentIndex++,
    }));
    return {
      ...item,
      subMenu: updatedSubMenu,
    };
  });
  const [Activeindex, setActiveindex] = useState(0)
  const updateIndex = (title: string, index: number) => {
    const obj = newData.find(item => item.title === title)?.subMenu.find(item => item.currentIndex === index)
    if(!obj) return
    updateTitle(obj.title)
    setActiveindex(index)
  }
  return (
    <div className={s.wrapper}>
      {
        newData.map((item, index) => {
          return (
            <MenuItem key={index}
              item={item}
              currentIndex={Activeindex}
              updateIndex={updateIndex}
            />
          )
        })
      }
    </div>
  )
}

export default memo(Left)