import React, { memo, useState } from 'react'
import type { FC, ReactNode } from 'react'
import { menuData } from '../common/Common'
import s from './Left.module.scss'
import MenuItem from './MenuItem'
interface IProps {
  children?: ReactNode
}

const Left: FC<IProps> = () => {
  console.log(menuData)
  return (
    <div className={s.wrapper}>
      {
        menuData.map((item, index) => {
          return <MenuItem key={index} item={item} />
        })
      }
    </div>
  )
}

export default memo(Left)