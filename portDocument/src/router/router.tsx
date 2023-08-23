import { lazy } from 'react'
import { Navigate, RouteObject } from 'react-router-dom'

const Home = lazy(() => import('../views/Home'))
const Welcome = lazy(() => import('../views/Welcome'))

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to='/welcome'/>
  },
  {
    path: '/welcome',
    element: <Welcome />,
  },
  {
    path: '/home',
    element: <Home />,
  },
]

export default routes;
