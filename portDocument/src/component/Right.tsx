import React, { memo } from 'react'
import type { FC, ReactNode } from 'react'
import Main from '../share/Main'
import s from './Right.module.scss'
import Table from '../share/Table'
import Notice from '../share/Notice'
interface IProps {
  children?: ReactNode
}

const Right: FC<IProps> = () => {
  const jsonObj = {
    name: 'lucy',
    sex: 'female',
    age: 18,
  }
  const obj = {
    title: '更新用户信息',
    desc: '通过name来找相关用户，更新信息',
    way: {
      url: '/api/user/upload',
      method: 'POST',
      nLogin: true,
      nAuth: true
    }
  }
  const TableObj = [
    { param: 'name', type: 'String', pattern: '' },
    { param: 'stuId', type: 'String', pattern: '' },
    { param: 'classId', type: 'String', pattern: '6位数字' }
  ]
  return (
    <div className={s.wrapper}>
      {/* <JsonView value={jsonObj}></JsonView> */}
      <Main obj={obj} />
      <Table table={TableObj} />
      <Notice desc={'stuId 是必填的，根据它有很多重要操作'}/>
    </div>
  )
}

export default memo(Right)