import { lazy } from 'react'
import { Navigate, RouteObject } from 'react-router-dom'

const Login = lazy(() => import('../views/Login'))
const Home = lazy(() => import('../views/Home'))
const About = lazy(() => import('../views/About'))
const Xxx = lazy(() => import('../views/Xxx'))

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to='/login'/>
  },
  {
    path: '/login',
    element: <Login />,
    children:[
      {
        path:'/login',
        element: <Navigate to='/login/xxx'/>
      },
      {
        path:'/login/home',
        element: <Home />
      },
      {
        path:'/login/about',
        element: <About />
      },
      {
        path:'/login/xxx',
        element: <Xxx />
      }
    ]
  },
]

export default routes;
