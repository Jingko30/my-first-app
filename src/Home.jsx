function Home({ onSelect }) {
  const apps = [
    { id: 'clock', name: '時計', desc: '現在時刻をリアルタイム表示' },
    { id: 'calculator', name: '電卓', desc: '四則演算ができる電卓' },
    { id: 'gacha', name: '宝晶石予測', desc: 'ガチャの引き時をチェック' },
  ]

  return (
    <div className="home">
      <h1>My Apps</h1>
      <div className="app-list">
        {apps.map((app) => (
          <button
            key={app.id}
            className="app-card"
            onClick={() => onSelect(app.id)}
          >
            <span className="app-name">{app.name}</span>
            <span className="app-desc">{app.desc}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default Home
