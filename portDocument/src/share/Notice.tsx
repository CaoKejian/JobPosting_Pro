import React, { memo } from 'react'
import type { FC, ReactNode } from 'react'
import s from './Notice.module.scss'
interface IProps {
  children?: ReactNode,
  desc: String
}

const Notice: FC<IProps> = ({ desc }) => {
  return (
    <div className={s.wrapper}>
      <div className={s.container}>
        <svg className={s.svg}><use xlinkHref='#notice'></use></svg>
        <div>{desc}</div>
      </div>
    </div>
  )
}

export default memo(Notice)