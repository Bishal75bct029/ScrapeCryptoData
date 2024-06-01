import { useEffect, useState } from 'react'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import { http } from './http'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(localStorage.getItem("token") ? true : false)

  const getUser = async () => {
    setLoading(true)
    setUser(null)

    try {
      const res = await http('/me')

      if (!res.ok) return;

      const data = await res.json()

      localStorage.setItem('id', data.id)

      setUser(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getUser()
    }
  }, [])

  return (
    <div className='min-h-screen'>
      {loading
        ? 'Loading...'
        : ((!loading && !user) ? <Login onLogin={setUser} /> :
          <Dashboard user={user} />)
      }
    </div>
  )
}

export default App
