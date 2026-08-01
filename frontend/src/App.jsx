import { useEffect, useState } from 'react'

function App() {
  const [message, setMessage] = useState('Loading...')

  useEffect(() => {
    fetch('http://127.0.0.1:8000/')
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch(() => setMessage('Failed to connect to backend'))
  }, [])

  return (
    <div className="min-h-screen bg-blue-600 flex items-center justify-center">
      <h1 className="text-white text-4xl font-bold">{message}</h1>
    </div>
  )
}

export default App