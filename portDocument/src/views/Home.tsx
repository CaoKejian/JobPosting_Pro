import React, { memo } from 'react'
import type { FC, ReactNode } from 'react'
interface IProps {
  children?: ReactNode
}

const Home: FC<IProps> = () => {
  return (
    <div>Home</div>
  )
}

export default memo(Home)