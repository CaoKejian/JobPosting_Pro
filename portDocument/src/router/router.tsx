import { lazy } from 'react'
import { Navigate, RouteObject } from 'react-router-dom'

const Home = lazy(() => import('../views/Home'))
const WelcomePage = lazy(() => import('../views/WelcomePage'))

const routes: RouteObject[] = [
  {
    path: '/',
    element: <WelcomePage />,
  },
  {
    path: '/welcome',
    element: <WelcomePage />,
  },
  {
    path: '/home',
    element: <Home />,
  }
]

export default routes;
