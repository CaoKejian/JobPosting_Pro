import React, { memo } from 'react'
import type { FC, ReactNode } from 'react'
import Main from '../share/Main'
import s from './Right.module.scss'
import Table from '../share/Table'
import Notice from '../share/Notice'
import Block from '../share/Block'
import Return from '../share/Return'
import { Root2 } from '../common/Common'
interface IProps {
  children?: ReactNode
  portObj: Root2
}

const Right: FC<IProps> = ({ portObj }) => {
  const { id, failedReturn, notice, paramsMode, requestMode, successReturn, useMode } = portObj
  return (<>
    <div className={s.wrapper}>
      <Main obj={useMode} id={id}/>
      <Table table={paramsMode.params} />
      <Notice desc={paramsMode.notice} />
      <div className={s.response}>
        <Block desc={requestMode.notice} jsonObj={requestMode.reqjson} />
      </div>
      <Return jsonObj={successReturn.jsonObj} type='success' response={successReturn.response} />
      <Return jsonObj={failedReturn.jsonObj} type='failed' response={failedReturn.response} />
      <Notice title='注意事项' desc={notice} />
    </div>
    <hr />
  </>
  )
}

export default memo(Right)