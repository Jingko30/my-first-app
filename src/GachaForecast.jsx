import { useState, useEffect, useMemo } from 'react'
import {
  calculateBalance,
  getEventsOnDate,
  toDateKey,
} from './gachaForecastLogic'
import './GachaForecast.css'

const STORAGE_KEY = 'gachaForecast:data'
const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土']

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function GachaForecast() {
  const today = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])

  const [initial] = useState(() => loadData() || {})
  const [currentCrystals, setCurrentCrystals] = useState(
    initial.currentCrystals ?? 0,
  )
  const [gachaCost, setGachaCost] = useState(initial.gachaCost ?? 300)
  const [events, setEvents] = useState(initial.events ?? [])
  const [gachaDates, setGachaDates] = useState(initial.gachaDates ?? [])
  const [selectedDateKey, setSelectedDateKey] = useState(toDateKey(today))
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())

  // 入手予定フォームの入力state
  const [eventType, setEventType] = useState('once')
  const [eventLabel, setEventLabel] = useState('')
  const [eventAmount, setEventAmount] = useState('')
  const [eventDate, setEventDate] = useState(toDateKey(today))
  const [eventFrequency, setEventFrequency] = useState('daily')
  const [eventWeekday, setEventWeekday] = useState(1)
  const [eventMonthday, setEventMonthday] = useState(1)
  const [eventStartDate, setEventStartDate] = useState('')
  const [eventEndDate, setEventEndDate] = useState('')

  // ガチャ予定日フォーム
  const [gachaDate, setGachaDate] = useState(toDateKey(today))
  const [gachaLabel, setGachaLabel] = useState('')

  useEffect(() => {
    const data = { currentCrystals, gachaCost, events, gachaDates }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }, [currentCrystals, gachaCost, events, gachaDates])

  const addEvent = () => {
    if (!eventLabel || !eventAmount) return
    const base = {
      id: Date.now().toString(),
      label: eventLabel,
      amount: Number(eventAmount),
      type: eventType,
    }
    const newEvent =
      eventType === 'once'
        ? { ...base, date: eventDate }
        : {
            ...base,
            frequency: eventFrequency,
            weekday:
              eventFrequency === 'weekly' ? Number(eventWeekday) : undefined,
            monthday:
              eventFrequency === 'monthly' ? Number(eventMonthday) : undefined,
            startDate: eventStartDate || undefined,
            endDate: eventEndDate || undefined,
          }
    setEvents([...events, newEvent])
    setEventLabel('')
    setEventAmount('')
  }

  const removeEvent = (id) => setEvents(events.filter((e) => e.id !== id))

  const addGachaDate = () => {
    if (!gachaLabel) return
    setGachaDates([
      ...gachaDates,
      { id: Date.now().toString(), date: gachaDate, label: gachaLabel },
    ])
    setGachaLabel('')
  }

  const removeGachaDate = (id) =>
    setGachaDates(gachaDates.filter((g) => g.id !== id))

  // カレンダーのマス目(前後の月を含めて6週間分)
  const calendarDays = useMemo(() => {
    const firstOfMonth = new Date(viewYear, viewMonth, 1)
    const startOffset = firstOfMonth.getDay()
    const gridStart = new Date(viewYear, viewMonth, 1 - startOffset)
    const days = []
    for (let i = 0; i < 42; i++) {
      const d = new Date(gridStart)
      d.setDate(gridStart.getDate() + i)
      days.push(d)
    }
    return days
  }, [viewYear, viewMonth])

  const goPrevMonth = () => {
    const d = new Date(viewYear, viewMonth - 1, 1)
    setViewYear(d.getFullYear())
    setViewMonth(d.getMonth())
  }

  const goNextMonth = () => {
    const d = new Date(viewYear, viewMonth + 1, 1)
    setViewYear(d.getFullYear())
    setViewMonth(d.getMonth())
  }

  const selectedBalance = calculateBalance(
    selectedDateKey,
    currentCrystals,
    events,
    today,
  )
  const drawCount = gachaCost > 0 ? Math.floor(selectedBalance / gachaCost) : 0
  const gachaDatesInView = gachaDates.filter((g) => g.date <= selectedDateKey)

  return (
    <div className="gacha-forecast">
      <h2>宝晶石 予測カレンダー</h2>

      <div className="gf-section">
        <label className="gf-label">
          現在の所持数
          <input
            type="number"
            value={currentCrystals}
            onChange={(e) => setCurrentCrystals(Number(e.target.value))}
            className="gf-input"
          />
        </label>
        <label className="gf-label">
          ガチャ1回に必要な個数
          <input
            type="number"
            value={gachaCost}
            onChange={(e) => setGachaCost(Number(e.target.value))}
            className="gf-input"
          />
        </label>
      </div>

      <div className="gf-section gf-form">
        <h3>入手予定を登録</h3>
        <div className="gf-type-toggle">
          <button
            className={
              eventType === 'once' ? 'gf-toggle-btn active' : 'gf-toggle-btn'
            }
            onClick={() => setEventType('once')}
          >
            単発
          </button>
          <button
            className={
              eventType === 'recurring'
                ? 'gf-toggle-btn active'
                : 'gf-toggle-btn'
            }
            onClick={() => setEventType('recurring')}
          >
            繰り返し
          </button>
        </div>

        <input
          type="text"
          placeholder="ラベル(例: 生放送記念配布)"
          value={eventLabel}
          onChange={(e) => setEventLabel(e.target.value)}
          className="gf-input"
        />
        <input
          type="number"
          placeholder="個数"
          value={eventAmount}
          onChange={(e) => setEventAmount(e.target.value)}
          className="gf-input"
        />

        {eventType === 'once' ? (
          <input
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className="gf-input"
          />
        ) : (
          <>
            <select
              value={eventFrequency}
              onChange={(e) => setEventFrequency(e.target.value)}
              className="gf-input"
            >
              <option value="daily">毎日</option>
              <option value="weekly">毎週</option>
              <option value="monthly">毎月</option>
            </select>

            {eventFrequency === 'weekly' && (
              <select
                value={eventWeekday}
                onChange={(e) => setEventWeekday(e.target.value)}
                className="gf-input"
              >
                {WEEKDAYS.map((w, i) => (
                  <option key={i} value={i}>
                    {w}曜日
                  </option>
                ))}
              </select>
            )}

            {eventFrequency === 'monthly' && (
              <input
                type="number"
                min="1"
                max="31"
                placeholder="毎月の日にち(例: 1)"
                value={eventMonthday}
                onChange={(e) => setEventMonthday(e.target.value)}
                className="gf-input"
              />
            )}

            <div className="gf-range">
              <label>
                開始日(任意)
                <input
                  type="date"
                  value={eventStartDate}
                  onChange={(e) => setEventStartDate(e.target.value)}
                  className="gf-input"
                />
              </label>
              <label>
                終了日(任意)
                <input
                  type="date"
                  value={eventEndDate}
                  onChange={(e) => setEventEndDate(e.target.value)}
                  className="gf-input"
                />
              </label>
            </div>
          </>
        )}

        <button className="gf-add-btn" onClick={addEvent}>
          追加
        </button>

        {events.length > 0 && (
          <ul className="gf-list">
            {events.map((ev) => (
              <li key={ev.id} className="gf-list-item">
                <span>
                  {ev.label}({ev.amount}個・
                  {ev.type === 'once'
                    ? ev.date
                    : ev.frequency === 'daily'
                      ? '毎日'
                      : ev.frequency === 'weekly'
                        ? `毎週${WEEKDAYS[ev.weekday]}`
                        : `毎月${ev.monthday}日`}
                  )
                </span>
                <button
                  className="gf-remove-btn"
                  onClick={() => removeEvent(ev.id)}
                >
                  削除
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="gf-section gf-form">
        <h3>ガチャ開始予定日を登録(目安)</h3>
        <input
          type="date"
          value={gachaDate}
          onChange={(e) => setGachaDate(e.target.value)}
          className="gf-input"
        />
        <input
          type="text"
          placeholder="ラベル(例: 新春ガチャ予想)"
          value={gachaLabel}
          onChange={(e) => setGachaLabel(e.target.value)}
          className="gf-input"
        />
        <button className="gf-add-btn" onClick={addGachaDate}>
          追加
        </button>

        {gachaDates.length > 0 && (
          <ul className="gf-list">
            {gachaDates.map((g) => (
              <li key={g.id} className="gf-list-item">
                <span>
                  {g.date} {g.label}
                </span>
                <button
                  className="gf-remove-btn"
                  onClick={() => removeGachaDate(g.id)}
                >
                  削除
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="gf-section">
        <div className="gf-calendar-header">
          <button onClick={goPrevMonth}>←</button>
          <span>
            {viewYear}年 {viewMonth + 1}月
          </span>
          <button onClick={goNextMonth}>→</button>
        </div>

        <div className="gf-calendar-grid">
          {WEEKDAYS.map((w) => (
            <div key={w} className="gf-weekday">
              {w}
            </div>
          ))}
          {calendarDays.map((d) => {
            const dateKey = toDateKey(d)
            const isCurrentMonth = d.getMonth() === viewMonth
            const isSelected = dateKey === selectedDateKey
            const isToday = dateKey === toDateKey(today)
            const dayEvents = getEventsOnDate(dateKey, events)
            const dayGacha = gachaDates.filter((g) => g.date === dateKey)

            return (
              <button
                key={dateKey}
                className={
                  'gf-day' +
                  (isCurrentMonth ? '' : ' gf-day-outside') +
                  (isSelected ? ' gf-day-selected' : '') +
                  (isToday ? ' gf-day-today' : '')
                }
                onClick={() => setSelectedDateKey(dateKey)}
              >
                <span className="gf-day-number">{d.getDate()}</span>
                <span className="gf-day-marks">
                  {dayEvents.length > 0 && (
                    <span className="gf-mark-crystal">💎</span>
                  )}
                  {dayGacha.length > 0 && (
                    <span className="gf-mark-gacha">⭐</span>
                  )}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="gf-section gf-result">
        <h3>{selectedDateKey} 時点の予測</h3>
        <p className="gf-balance">
          所持数: {selectedBalance.toLocaleString()} 個
        </p>
        <p className="gf-draw-count">ガチャ {drawCount} 回分</p>

        {gachaDatesInView.length > 0 && (
          <div className="gf-gacha-note">
            <p>この日までのガチャ開催予定(目安):</p>
            <ul>
              {gachaDatesInView.map((g) => (
                <li key={g.id}>
                  {g.date} {g.label}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default GachaForecast
