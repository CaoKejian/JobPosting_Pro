

import React, { memo, useEffect, useState } from 'react'
import type { FC, ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import s from './Welcome.module.scss'
import useScrollDown from '../hooks/useScroll';

interface IProps {
  children?: ReactNode
}

const WelcomePage: FC<IProps> = () => {
  const isMove = useScrollDown()
  const navigate = useNavigate();
  useEffect(() => {
    if(isMove){
      navigate('/home') 
    }
  }, [isMove])
  return (
    <div className={s.wrapper}>
      <svg className={s.svg}><use xlinkHref='#welcome'></use></svg>
      <p>欢迎来到</p>
      <span>交作业啦App-接口文档</span>
      <div className={s.user}>
        <span>作者：<span className={s.colin}>Colin</span></span>
        <span>前端：<Link target="_blank" to='https://github.com/CaoKejian/JobPosting'>代码链接</Link>访问地址：<Link target="_blank" to='http://jobpost-1314966552.cos-website.ap-shanghai.myqcloud.com/'>点击前往</Link></span>
        <span>后端：<Link target="_blank" to='https://github.com/CaoKejian/JobPosting_Pro'>代码链接</Link>访问地址：<Link target="_blank" to='http://43.139.142.203:3000/api'>点击前往</Link></span>
        <span>接口文档：<Link target="_blank" to='https://github.com/CaoKejian/JobPosting_Pro/tree/main/portDocument'>代码链接</Link></span>
      </div>
      <div className={s.bottom}>
        <svg className={s.tobottom}><use xlinkHref='#tobottom'></use></svg>
      </div>
    </div>
  )
}

export default memo(WelcomePage)