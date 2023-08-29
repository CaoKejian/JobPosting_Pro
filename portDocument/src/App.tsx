import { Suspense } from 'react'
import s from './App.module.scss'
import { useRoutes } from 'react-router-dom'
import routes from './router/router'
function App() {
  return (
    <div className={s.wrapper}>
      <Suspense fallback="">
        <div className={s.main}>
          {useRoutes(routes)}
        </div>
      </Suspense>
    </div>
  )
}

export default App
