import React, { memo, useEffect, useRef } from 'react'
import s from './Home.module.scss'
import type { FC, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import useScrollDown from '../hooks/useScroll'
import { throttle } from '../share/Throttle'
import useSwipe from '../hooks/useMove'
import JsonView from '@uiw/react-json-view'
import Right from '../component/Right'
interface IProps {
  children?: ReactNode
}

const Home: FC<IProps> = () => {
 
  return (
    <div className={s.wrapper}>
      <div className={s.left}>侧边栏</div>
      <div className={s.right}>
        <Right />
      </div>
    </div>
  )
}

export default memo(Home)