import React, { memo, useEffect } from 'react'
import s from './Home.module.scss'
import type { FC, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import useScrollDown from '../hooks/useScroll'
import { throttle } from '../share/Throttle'
interface IProps {
  children?: ReactNode
}

const Home: FC<IProps> = () => {
  const { canScrollUp: isMove } = useScrollDown(true, false)
  const navigate = useNavigate();
  const push = throttle(() => {
    navigate('/welcome', { state: { message: 'home_return' } })
  }, 500)
  useEffect(() => {
    if (isMove) {
      push()
    }
  }, [isMove])
  return (
    <div className={s.wrapper}>
      <div className={s.left}>侧边栏</div>
      <div className={s.right}>haha</div>
    </div>
  )
}

export default memo(Home)