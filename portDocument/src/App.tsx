import { Suspense } from 'react'
import s from './App.module.scss'
import { useRoutes } from 'react-router-dom'
import routes from './router/router'
function App() {
  return (
    <div className={s.wrapper}>
      <header>头部</header>
      <Suspense fallback="">
        <div className={s.main}>{useRoutes(routes)}</div>
      </Suspense>
      <footer>底部</footer>
    </div>
  )
}

export default App
