// 日付を "YYYY-MM-DD" 形式の文字列にする(タイムゾーンのズレを避けるため)
export function toDateKey(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function parseDateKey(key) {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function addDays(date, n) {
  const d = new Date(date)
  d.setDate(d.getDate() + n)
  return d
}

// 指定した1日に、この繰り返しイベントが発生するかどうか
function recurringOccursOnDate(event, date) {
  const dateKey = toDateKey(date)
  if (event.startDate && dateKey < event.startDate) return false
  if (event.endDate && dateKey > event.endDate) return false

  if (event.frequency === 'daily') return true
  if (event.frequency === 'weekly') return date.getDay() === event.weekday
  if (event.frequency === 'monthly') return date.getDate() === event.monthday
  return false
}

// today の翌日から targetDate までの間に、このイベントで合計いくつ入手できるか
function sumRecurringInRange(event, today, targetDate) {
  let total = 0
  let cursor = addDays(today, 1)
  while (cursor.getTime() <= targetDate.getTime()) {
    if (recurringOccursOnDate(event, cursor)) total += event.amount
    cursor = addDays(cursor, 1)
  }
  return total
}

// 現在の所持数 + 登録済みイベントから、指定日時点の予測所持数を計算する
export function calculateBalance(
  targetDateKey,
  currentCrystals,
  events,
  today,
) {
  const targetDate = parseDateKey(targetDateKey)
  const tomorrowKey = toDateKey(addDays(today, 1))
  let total = currentCrystals

  events.forEach((ev) => {
    if (ev.type === 'once') {
      if (ev.date >= tomorrowKey && ev.date <= targetDateKey) {
        total += ev.amount
      }
    } else {
      total += sumRecurringInRange(ev, today, targetDate)
    }
  })

  return total
}

// カレンダー表示用:その日に該当するイベント一覧
export function getEventsOnDate(dateKey, events) {
  const date = parseDateKey(dateKey)
  return events.filter((ev) => {
    if (ev.type === 'once') return ev.date === dateKey
    return recurringOccursOnDate(ev, date)
  })
}
