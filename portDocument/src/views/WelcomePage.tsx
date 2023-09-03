

import React, { memo, useEffect, useRef, useState } from 'react'
import type { FC, ReactNode } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom';
import s from './Welcome.module.scss'
import useScrollDown from '../hooks/useScroll';
import './transition.css'
import { throttle } from '../share/Throttle';
import useSwipe from '../hooks/useMove';

interface IProps {
  children?: ReactNode
}

const WelcomePage: FC<IProps> = () => {
  const navigate = useNavigate();
  const main = useRef(null)
  const isMobile = window.innerWidth <= 768;
  const swipeOptions = {
    beforeStart: (e: any) => e.preventDefault(),
    element: main
  };
  const { swiping, direction } = useSwipe(swipeOptions);
  useEffect(() => {
    if (isMobile && !swiping && direction === 'up') {
      push()
    }
  }, [isMobile, swiping, direction])
  const { canScrollDown: isMove } = useScrollDown(false, true, isMobile);
  useEffect(() => {
    if (!isMobile && isMove) {
      push();
    }
  }, [isMove, isMobile])
  const push = throttle(() => {
    console.log(121)
    navigate('/home')
  }, 500)

  return (
    <div className={s.wrapper} ref={main}>
      <svg className={s.svg}><use xlinkHref='#welcome'></use></svg>
      <p>欢迎来到</p>
      <div className={s.container}><span className={s.word}>交作业啦App-接口文档</span></div>
      <div className={s.user}>
        <span>作者：<span className={s.colin}>Colin</span></span>
        <span>前端：<Link target="_blank" to='https://github.com/CaoKejian/JobPosting'>代码链接</Link>访问地址：<Link target="_blank" to='https://jobpost.caokejian.club/'>点击前往</Link></span>
        <span>后端：<Link target="_blank" to='https://github.com/CaoKejian/JobPosting_Pro'>代码链接</Link>访问地址：<Link target="_blank" to='http://43.139.142.203/api'>点击前往</Link></span>
        <span>接口文档：<Link target="_blank" to='https://github.com/CaoKejian/JobPosting_Pro/tree/main/portDocument'>代码链接</Link></span>
      </div>
      <div className={s.bottom} onClick={push}>
        <svg className={s.tobottom}><use xlinkHref='#tobottom'></use></svg>
      </div>
    </div>
  )
}

export default memo(WelcomePage)