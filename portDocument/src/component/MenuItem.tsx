import React, { memo, useEffect, useRef, useState } from 'react'
import type { FC, ReactNode } from 'react'
import s from './Left.module.scss'
import './index.css'
interface IProps {
  children?: ReactNode
  item: any
}

const MenuItem: FC<IProps> = ({ item }) => {
  const [isShow, setIsShow] = useState(true);
  const [status, setStatus] = useState('#menuOpen')
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
    if (status === '#menuOpen') {
      setStatus('#menuClose')
    } else {
      setStatus('#menuOpen')
    }
    setIsShow(!isShow);
  };
  return (
    <ul>
      <li className={s.item}>
        <svg className={`svg ${isShow ? 'rotate' : 'ro'}`} onClick={toggleSubMenu}>
          <use xlinkHref={status}></use>
        </svg>
        <div>{item.title}</div>
      </li>
      <ul className={[`twoTitle ${isShow ? 'show' : ''}`].join()} ref={contentRef}>
        {item.subMenu.map((subItem: any, index: number) => (
          <li key={index} className={isShow ? 'show' : ''}>
            {subItem.title}
          </li>
        ))}
      </ul>
    </ul>
  )
}

export default memo(MenuItem)