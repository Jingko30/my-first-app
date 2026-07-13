import { useState, useEffect } from 'react'
import Home from './Home'
import Clock from './Clock'
import Calculator from './Calculator'
import './App.css'

function App() {
  const [page, setPage] = useState('home')
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <div className="app">
      <div className="top-bar">
        {page !== 'home' ? (
          <button className="back-button" onClick={() => setPage('home')}>
            ← 一覧へ戻る
          </button>
        ) : (
          <span />
        )}
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === 'dark' ? '☀️ ライト' : '🌙 ダーク'}
        </button>
      </div>
      {page === 'home' && <Home onSelect={setPage} />}
      {page === 'clock' && <Clock />}
      {page === 'calculator' && <Calculator />}
    </div>
  )
}

export default App