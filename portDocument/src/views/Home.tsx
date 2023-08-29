import React, { memo, useEffect } from 'react'
import s from './Home.module.scss'
import type { FC, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import useScrollDown from '../hooks/useScroll'
interface IProps {
  children?: ReactNode
}

const Home: FC<IProps> = () => {
  const { canScrollUp: isMove } = useScrollDown(true,false)
  const navigate = useNavigate();
  useEffect(() => {
    if (isMove) {
      setTimeout(() => {
          navigate('/welcome', {state: {message: 'home_return'}})
      }, 200);
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