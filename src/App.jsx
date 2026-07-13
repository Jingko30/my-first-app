import { useState } from 'react'
import Home from './Home'
import Clock from './Clock'
import Calculator from './Calculator'
import './App.css'

function App() {
  const [page, setPage] = useState('home')

  return (
    <div className="app">
      {page !== 'home' && (
        <button className="back-button" onClick={() => setPage('home')}>
          ← 一覧へ戻る
        </button>
      )}
      {page === 'home' && <Home onSelect={setPage} />}
      {page === 'clock' && <Clock />}
      {page === 'calculator' && <Calculator />}
    </div>
  )
}

export default App