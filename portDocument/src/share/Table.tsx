import React, { memo } from 'react'
import type { FC, ReactNode } from 'react'
import s from './Table.module.scss'
interface Table {
  param: string;
  type: string;
  pattern: string;
}

interface IProps {
  table: Table[];
}

const Table: FC<IProps> = ({ table }) => {
  return (
    <div className={s.wrapper}>
      <h1>请求参数</h1>
      <table>
        <thead>
          <tr>
            <th>参数</th>
            <th>类型</th>
            <th>约束</th>
          </tr>
        </thead>
        <tbody>
          {table.map((item, index) => (
            <tr key={index}>
              <td><span className={s.param}>{item.param}</span></td>
              <td>{item.type}</td>
              <td>{item.pattern ? item.pattern : '无'}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  )
}

export default memo(Table)