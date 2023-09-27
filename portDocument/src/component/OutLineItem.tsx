import React, { memo, useEffect, useRef, useState } from 'react'
import type { FC, ReactNode } from 'react'
import s from './OutLineItem.module.scss'
interface IProps {
  children?: ReactNode
  item: {
    title: string
    subMenu: { title: string }[]
  },
  currentIndex: Number,
  updateIndex: (title:string, index: number) => void
}

const OutLineItem: FC<IProps> = ({item, currentIndex, updateIndex}) => {
  const [isShow, setIsShow] = useState(true);
  const [status, setStatus] = useState('#outLineToBottom')
  const contentRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    if (!contentRef.current) return
    if (isShow) {
      const contentHeight = contentRef.current.scrollHeight;
      contentRef.current.style.maxHeight = `${contentHeight}px`;
    } else {
      contentRef.current.style.maxHeight = '0';
    }
  }, [isShow]);
  const toggleSubMenu = () => {
    if (status === '#outLineToBottom') {
      setStatus('#outLineToRight')
    } else {
      setStatus('#outLineToBottom')
    }
    setIsShow(!isShow);
  };
  return (
    <ul className={s.ul}>
      <li className={s.item}>
        <svg className={`outSvg`} onClick={toggleSubMenu}>
          <use xlinkHref={status}></use>
        </svg>
        <div className={s.title}>{item.title}</div>
      </li>
      <ul className={[`twoTitle ${isShow ? 'show' : ''}`].join()} ref={contentRef}>
        {item.subMenu.map((subItem: any, index: number) => (
          <li key={index} className={`outItem ${currentIndex === subItem.currentIndex ? "outactive" : ''}`} onClick={() => updateIndex(item.title,subItem.currentIndex)}>
            <div className={s.outText}>{subItem.title}</div>
          </li>
        ))}
      </ul>
    </ul>
  )
}

export default memo(OutLineItem)