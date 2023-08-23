import React, { memo } from 'react'
import s from './Home.module.scss'
import type { FC, ReactNode } from 'react'
interface IProps {
  children?: ReactNode
}

const Home: FC<IProps> = () => {
  return (
    <div className={s.wrapper}>
      <div className={s.left}>侧边栏</div>
      <div className={s.right}></div>
    </div>
  )
}

export default memo(Home)