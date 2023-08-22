import React, { Suspense, memo } from 'react'
import type { FC, ReactNode } from 'react'
import s from './Login.module.scss'
import { NavLink, Outlet } from 'react-router-dom'
interface IProps {
  children?: ReactNode
}

const Login: FC<IProps> = () => {
  const mapHub = {
    "login": "/login/xxx",
    "home": "/login/home",
    "about": "/login/about"
  }
  return (
    <div>
      {
        Object.entries(mapHub).map(([key, value]) => {
          return <div key={key}>
            <NavLink to={value}>
              {key}
            </NavLink>
          </div>
        })
      }
      <div className={s.content}>
        <Suspense fallback="">
          <Outlet />
        </Suspense>
      </div>
    </div>
  )
}

export default memo(Login)