import React, { memo, useEffect, useRef } from 'react'
import s from './Home.module.scss'
import type { FC, ReactNode } from 'react'
import Right from '../component/Right'
import { Root2, portTree } from '../common/Common'
import Left from '../component/Left'
interface IProps {
  children?: ReactNode
}

const Home: FC<IProps> = () => {

  return (
    <div className={s.wrapper}>
      <div className={s.left}>
        <Left />
      </div>
      <div className={s.right}>
        {
          portTree.map((item: Root2, index: number) => {
            return <Right key={index} portObj={item}/>
          })
        }
      </div>
    </div>
  )
}

export default memo(Home)