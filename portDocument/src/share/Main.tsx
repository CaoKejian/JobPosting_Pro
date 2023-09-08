import React, { memo } from 'react'
import type { FC, ReactNode } from 'react'
import s from './Main.module.scss'
interface Obj {
  title: string,
  desc: string,
  way: {
    url: string,
    method: string,
    nLogin: boolean,
    nAuth: boolean
  }
}
interface IProps {
  children?: ReactNode,
  obj: Obj
}

const Main: FC<IProps> = (props) => {
  const { obj } = props
  return (
    <div className={s.wrapper}>
      <h1>{obj.title}</h1>
      <p>{obj.desc}</p>
      <div className={s.container}>
        <ul>
          <li>URL:<span className={s.a}>{obj.way.url}</span></li>
          <li>Method:<span className={s.a}>{obj.way.method}</span></li>
          <li>需要登录:<span className={s.b}>{obj.way.nLogin ? '是' : '否'}</span></li>
          <li>需要鉴权:<span className={s.b}>{obj.way.nAuth ? '是' : '否'}</span></li>
        </ul>
      </div>
    </div>
  )
}

export default memo(Main)