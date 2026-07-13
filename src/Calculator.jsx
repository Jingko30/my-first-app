import { useState } from 'react'

function Calculator() {
  const [display, setDisplay] = useState('0')
  const [prev, setPrev] = useState(null)
  const [operator, setOperator] = useState(null)

  const inputNumber = (num) => {
    setDisplay(display === '0' ? String(num) : display + num)
  }

  const inputOperator = (op) => {
    setPrev(parseFloat(display))
    setOperator(op)
    setDisplay('0')
  }

  const calculate = () => {
    const current = parseFloat(display)
    if (prev === null || operator === null) return
    let result = 0
    if (operator === '+') result = prev + current
    if (operator === '-') result = prev - current
    if (operator === '×') result = prev * current
    if (operator === '÷') result = prev / current
    setDisplay(String(result))
    setPrev(null)
    setOperator(null)
  }

  const clear = () => {
    setDisplay('0')
    setPrev(null)
    setOperator(null)
  }

  const buttons = [
    '7', '8', '9', '÷',
    '4', '5', '6', '×',
    '1', '2', '3', '-',
    '0', 'C', '=', '+',
  ]

  const handleClick = (btn) => {
    if (btn === 'C') return clear()
    if (btn === '=') return calculate()
    if (['+', '-', '×', '÷'].includes(btn)) return inputOperator(btn)
    return inputNumber(btn)
  }

  return (
    <div className="calculator">
      <h2>電卓</h2>
      <div className="calc-display">{display}</div>
      <div className="calc-grid">
        {buttons.map((btn) => (
          <button
            key={btn}
            className={`calc-btn ${['+', '-', '×', '÷', '='].includes(btn) ? 'op' : ''}`}
            onClick={() => handleClick(btn)}
          >
            {btn}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Calculator