import React, { memo } from 'react'
import type { FC, ReactNode } from 'react'
import s from './Return.module.scss'
import Block from './Block'
interface IProps {
  children?: ReactNode,
  type: "success" | "failed"
  jsonObj: {}
  response: {
    conditions: string
    status: number
    exampleDesc: string
  }
}

const Return: FC<IProps> = ({ type, jsonObj, response }) => {
  return (
    <div className={s.wrapper}>
      <h1>{type === 'success' ? "成功响应" : "失败响应"}</h1>
      <div className={s.desc}>
        <div>条件：<span>{response.conditions}</span></div>
        <div>状态码：<span className={s.status}>{response.status}</span></div>
        <div>响应示例：<span>{response.exampleDesc}</span></div>
      </div>
      <Block title={''} desc={''} jsonObj={jsonObj} />
    </div>
  )
}

export default memo(Return)