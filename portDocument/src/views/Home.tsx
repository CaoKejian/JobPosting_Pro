import React, { memo, useEffect, useRef } from 'react'
import s from './Home.module.scss'
import type { FC, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import useScrollDown from '../hooks/useScroll'
import { throttle } from '../share/Throttle'
import useSwipe from '../hooks/useMove'
interface IProps {
  children?: ReactNode
}

const Home: FC<IProps> = () => {
  const main = useRef(null)
  const navigate = useNavigate();
  const { canScrollUp: isMove } = useScrollDown(true, false)
  const swipeOptions = {
    beforeStart: (e: any) => e.preventDefault,
    element: main
  };
  const { swiping, direction } = useSwipe(swipeOptions);
  const push = throttle(() => {
    navigate('/welcome', { state: { message: 'home_return' } })
  }, 500)
  useEffect(() => {
    if (!swiping && direction === 'down') {
      push()
    }
  }, [swiping, direction])
  useEffect(() => {
    if (isMove) {
      push()
    }
  }, [isMove])
  return (
    <div className={s.wrapper} ref={main}>
      <div className={s.left}>侧边栏</div>
      <div className={s.right}>haha</div>
    </div>
  )
}

export default memo(Home)