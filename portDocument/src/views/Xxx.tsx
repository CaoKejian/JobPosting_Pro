import React, { memo } from 'react'
import type { FC, ReactNode } from 'react'
interface IProps {
  children?: ReactNode
}

const Xxx: FC<IProps> = () => {
  return (
    <div>Xxx</div>
  )
}

export default memo(Xxx)