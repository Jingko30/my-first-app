import { useState, useEffect } from 'react'

function Clock() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const format = (n) => String(n).padStart(2, '0')

  return (
    <div className="clock">
      <h2>時計</h2>
      <div className="clock-display">
        {format(time.getHours())}:{format(time.getMinutes())}:
        {format(time.getSeconds())}
      </div>
      <div className="clock-date">
        {time.getFullYear()}年{time.getMonth() + 1}月{time.getDate()}日
      </div>
    </div>
  )
}

export default Clock
