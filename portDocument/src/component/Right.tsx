import React, { memo } from 'react'
import type { FC, ReactNode } from 'react'
import Main from '../share/Main'
import s from './Right.module.scss'
import Table from '../share/Table'
import Notice from '../share/Notice'
import Block from '../share/Block'
import Return from '../share/Return'
interface IProps {
  children?: ReactNode
}

const Right: FC<IProps> = () => {
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
  const jsonObj = {
    name: 'lucy',
    sex: 'female',
    age: 18,
  }
  const response = {
    conditions: 'stuId必填',
    status: 200,
    exampleDesc: '根据stuId来查询'
  }
  return (
    <div className={s.wrapper}>
      <Main obj={obj} />
      <Table table={TableObj} />
      <Notice desc={'stuId 是必填的，根据它有很多重要操作'} />
      <div className={s.response}>
        <Block desc={'必须传递所有参数，且格式必须正确'} jsonObj={jsonObj} />
      </div>
      <Return jsonObj={jsonObj} type='success' response={response} />
      <Return jsonObj={jsonObj} type='failed' response={response} />
      <div className={s.notice}>
        <h1>注意事项</h1>
        <Notice desc={'如果用户的用户信息不存在，将会使用请求的数据创建一个新的用户信息。'} />
      </div>
    </div>
  )
}

export default memo(Right)