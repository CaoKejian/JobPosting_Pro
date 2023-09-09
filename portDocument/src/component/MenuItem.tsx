import React, { memo, useEffect, useRef, useState } from 'react'
import type { FC, ReactNode } from 'react'
import s from './Left.module.scss'
import './index.css'
interface IProps {
  children?: ReactNode
  item: {
    title: string
    subMenu: { title: string }[]
  }
}

const MenuItem: FC<IProps> = ({ item }) => {
  const [isShow, setIsShow] = useState(true);
  const [status, setStatus] = useState('#menuOpen')
  const [active, setActive] = useState(0)
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
  const handleLi = (title: string, index: number) => {
    console.log(item, index)
  }
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
          <li key={index} className={`liItem ${active === index && item.title==='user'? "Liactive" : ''}`} onClick={() => handleLi(item.title, index)}>
            <div className={s.text}>{subItem.title}</div>
          </li>
        ))}
      </ul>
    </ul>
  )
}

export default memo(MenuItem)