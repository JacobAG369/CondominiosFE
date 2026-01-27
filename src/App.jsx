import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { apiUrl, echo } from './echo'

function App() {
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState('')
  const [usuarioId, setUsuarioId] = useState('')
  const [depaId, setDepaId] = useState('')
  const [loading, setLoading] = useState(true)
  const [socketState, setSocketState] = useState('connecting')

  const orderedMessages = useMemo(() => {
    return [...messages].sort(
      (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime(),
    )
  }, [messages])

  useEffect(() => {
    const channel = echo.channel('chat.condominios')

    channel.listen('.mensaje.creado', (event) => {
      const incoming = event.mensaje
      setMessages((prev) => {
        if (prev.some((item) => item.id === incoming.id)) {
          return prev
        }
        return [...prev, incoming]
      })
    })

    return () => {
      echo.leaveChannel('chat.condominios')
    }
  }, [])

  useEffect(() => {
    const pusher = echo.connector?.pusher
    if (!pusher) {
      return undefined
    }

    const updateState = (state) => setSocketState(state)

    updateState(pusher.connection.state)
    pusher.connection.bind('state_change', (state) => {
      updateState(state.current)
    })

    return () => {
      pusher.connection.unbind('state_change')
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    const params = new URLSearchParams()
    if (depaId) {
      params.set('depa', depaId)
    }

    setLoading(true)
    fetch(`${apiUrl}/api/mensajes?${params.toString()}`, {
      signal: controller.signal,
    })
      .then((response) => response.json())
      .then((data) => {
        setMessages(Array.isArray(data) ? data : [])
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false)
      })

    return () => controller.abort()
  }, [depaId])

  const canSend = usuarioId && depaId && message.trim().length > 0

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!canSend) {
      return
    }

    const socketId = echo.socketId()
    const headers = { 'Content-Type': 'application/json' }
    if (socketId) {
      headers['X-Socket-Id'] = socketId
    }

    const payload = {
      remitente: Number(usuarioId),
      id_depaA: Number(depaId),
      mensaje: message.trim(),
    }

    const response = await fetch(`${apiUrl}/api/mensajes`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    })

    if (response.ok) {
      setMessage('')
    }
  }

  return (
    <div className="app">
      <header className="hero">
        <div>
          <p className="eyebrow">Condominios</p>
          <h1>Chat entre departamentos</h1>
          <p className="subtitle">
            
          </p>
        </div>
        <div className="status">
          <span className="status-text">Chat en tiempo real</span>
        </div>
      </header>

      <section className="panel">
        <div className="panel-head">
          <div>
            <h2>Chat Grupal</h2>
            <p>Define quien escribe y que departamento representa. (De momentoi)</p>
          </div>
          <div className="fields">
            <label>
              Usuario ID
              <input
                type="number"
                value={usuarioId}
                onChange={(event) => setUsuarioId(event.target.value)}
                placeholder="Ej. 12"
              />
            </label>
            <label>
              Departamento ID
              <input
                type="number"
                value={depaId}
                onChange={(event) => setDepaId(event.target.value)}
                placeholder="Ej. 3"
              />
            </label>
          </div>
        </div>

        <div className="messages">
          {loading && <p className="muted">Cargando mensajes...</p>}
          {!loading && orderedMessages.length === 0 && (
            <p className="muted">No hay mensajes aun.</p>
          )}
          {orderedMessages.map((item, index) => (
            <article
              key={item.id}
              className="message"
              style={{ '--delay': `${index * 30}ms` }}
            >
              <div className="message-meta">
                <span>Usuario {item.remitente}</span>
                <span>Depa {item.id_depaA}</span>
                <span>{new Date(item.fecha).toLocaleString()}</span>
              </div>
              <p>{item.mensaje}</p>
            </article>
          ))}
        </div>

        <form className="composer" onSubmit={handleSubmit}>
          <input
            type="text"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Escribe tu mensaje para el grupo..."
          />
          <button type="submit" disabled={!canSend}>
            Enviar
          </button>
        </form>
      </section>
    </div>
  )
}

export default App
