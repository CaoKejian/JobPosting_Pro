import React, { memo, useEffect, useState } from 'react'
import type { FC, ReactNode } from 'react'
import s from './OutLine.module.scss'
import { findIndex, menuData } from '../common/Common'
import OutLineItem from '../component/OutLineItem'
interface IProps {
  children?: ReactNode
  updateTitle: (title: string) => void
  activeItemId: string
}

const OutLine: FC<IProps> = ({ updateTitle, activeItemId }) => {
  const [isShow, setIsShow] = useState(false)
  let currentIndex = 0;

  useEffect(() => {
    const screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
    if (screenWidth >= 800) {
      setIsShow(true)
    }
  }, [])
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
    if (!obj) return
    updateTitle(obj.title)
    setActiveindex(index)
    localStorage.setItem('clickIndex', index + '')
  }
  const [isVisible, setIsVisible] = useState('#visible')
  const handleVixible = () => {
    if (isVisible === '#visible') {
      setIsVisible('#novisible')
    } else {
      setIsVisible('#visible')
    }
  }
  useEffect(() => {
    if (!activeItemId) return
    setActiveindex(findIndex(activeItemId)!)
  }, [activeItemId])

  return (
    isShow ? (
      (isVisible === '#visible' ?
        (
          <div className={s.catalogue} >
            <div><span className={s.title}>大纲
              <svg className={s.visible} onClick={handleVixible}><use xlinkHref={isVisible}></use></svg>
            </span>
            </div>
            <div className={s.cat_box}>
              {
                newData.map((item, index) => {
                  return (
                    <OutLineItem key={index}
                      item={item}
                      currentIndex={Activeindex}
                      updateIndex={updateIndex}
                    />
                  )
                })
              }
            </div>
          </div >
        ) : (
          <div className={s.nocatalogue} >
            <div><span className={s.title}>大纲
              <svg className={s.visible} onClick={handleVixible}><use xlinkHref={isVisible}></use></svg>
            </span>
            </div>
          </div >
        )
      )
    ) : null
  )
}

export default memo(OutLine)