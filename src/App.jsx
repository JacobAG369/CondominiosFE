import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { apiUrl, echo } from './echo'

const NOTIFICATION_TYPES = {
  mensaje: {
    label: 'Mensaje',
    tone: 'sea',
  },
  multa: {
    label: 'Multa',
    tone: 'alert',
  },
  asamblea: {
    label: 'Asamblea',
    tone: 'sun',
  },
  pago: {
    label: 'Pago atrasado',
    tone: 'rose',
  },
}

const formatLocalDate = (date) => {
  if (!date) {
    return ''
  }
  const parsed = typeof date === 'string' ? new Date(date) : date
  if (Number.isNaN(parsed.getTime())) {
    return ''
  }
  return parsed.toLocaleString()
}

const buildNotification = (payload) => {
  const createdAt = payload.fecha || payload.fecha_creacion || new Date().toISOString()
  return {
    id: payload.id ?? `${payload.tipo}-${createdAt}-${Math.random()}`,
    tipo: payload.tipo,
    titulo: payload.titulo,
    resumen: payload.resumen,
    fecha: createdAt,
    enlace: payload.enlace,
    detalle: payload.detalle,
    meta: payload.meta,
    read: false,
  }
}

function App() {
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState('')
  const [usuarioId, setUsuarioId] = useState('')
  const [depaId, setDepaId] = useState('')
  const [loading, setLoading] = useState(true)
  const [socketState, setSocketState] = useState('connecting')
  const [notifications, setNotifications] = useState([])
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [activeNotificationId, setActiveNotificationId] = useState(null)

  const orderedMessages = useMemo(() => {
    return [...messages].sort(
      (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime(),
    )
  }, [messages])

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.read).length,
    [notifications],
  )

  const activeNotification = useMemo(
    () => notifications.find((item) => item.id === activeNotificationId) || null,
    [notifications, activeNotificationId],
  )

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

      const notification = buildNotification({
        id: incoming.id,
        tipo: 'mensaje',
        titulo: 'Nuevo mensaje',
        resumen: incoming.mensaje,
        fecha: incoming.fecha,
        enlace: `#mensaje-${incoming.id}`,
        detalle: `Usuario ${incoming.remitente} · Depa ${incoming.id_depaA}`,
        meta: {
          remitente: incoming.remitente,
          depa: incoming.id_depaA,
        },
      })

      setNotifications((prev) => {
        if (prev.some((item) => item.id === notification.id)) {
          return prev
        }
        return [notification, ...prev]
      })
    })

    return () => {
      echo.leaveChannel('chat.condominios')
    }
  }, [])

  useEffect(() => {
    const channel = echo.channel('notificaciones.condominios')

    channel.listen('.notificacion.creada', (event) => {
      const incoming = event.notificacion || event
      if (!incoming) {
        return
      }

      const rawType = incoming.tipo || incoming.type
      const normalized =
        rawType === 'pago_atrasado' || rawType === 'pago-atrasado'
          ? 'pago'
          : rawType
      const tipo = NOTIFICATION_TYPES[normalized] ? normalized : 'mensaje'

      const notification = buildNotification({
        id: incoming.id,
        tipo,
        titulo: incoming.titulo || incoming.title || NOTIFICATION_TYPES[tipo].label,
        resumen: incoming.resumen || incoming.summary || incoming.descripcion || '',
        fecha: incoming.fecha || incoming.created_at || new Date().toISOString(),
        enlace: incoming.enlace || incoming.link || '',
        detalle: incoming.detalle || incoming.detalles || '',
        meta: incoming.meta || {},
      })

      setNotifications((prev) => {
        if (prev.some((item) => item.id === notification.id)) {
          return prev
        }
        return [notification, ...prev]
      })
    })

    return () => {
      echo.leaveChannel('notificaciones.condominios')
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

  const handleNotificationClick = (notification) => {
    setActiveNotificationId(notification.id)
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === notification.id ? { ...item, read: true } : item,
      ),
    )

    if (notification.enlace?.startsWith('#')) {
      const target = document.getElementById(notification.enlace.slice(1))
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })))
  }

  const handleToggleNotifications = () => {
    setNotificationsOpen((prev) => !prev)
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
        <div className="hero-actions">
          <div className="notification">
            <button
              type="button"
              className={`notification-button ${
                unreadCount > 0 ? 'has-unread' : ''
              }`}
              onClick={handleToggleNotifications}
              aria-expanded={notificationsOpen}
            >
              <span className="notification-icon">🔔</span>
              <span>Notificaciones</span>
              {unreadCount > 0 && (
                <span className="notification-count">{unreadCount}</span>
              )}
            </button>

            {notificationsOpen && (
              <div className="notification-panel">
                <div className="notification-panel-head">
                  <div>
                    <h3>Actividad reciente</h3>
                    <p>
                      {unreadCount > 0
                        ? `${unreadCount} sin leer`
                        : 'Todo al dia'}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="notification-clear"
                    onClick={handleMarkAllRead}
                    disabled={unreadCount === 0}
                  >
                    Marcar todo leido
                  </button>
                </div>

                <div className="notification-list">
                  {notifications.length === 0 && (
                    <p className="muted">Sin notificaciones nuevas.</p>
                  )}
                  {notifications.map((item) => {
                    const config = NOTIFICATION_TYPES[item.tipo] || {
                      label: 'Notificacion',
                      tone: 'sea',
                    }

                    return (
                      <button
                        key={item.id}
                        type="button"
                        className={`notification-item ${
                          item.read ? '' : 'unread'
                        }`}
                        onClick={() => handleNotificationClick(item)}
                      >
                        <span className={`notification-tag ${config.tone}`}>
                          {config.label}
                        </span>
                        <div>
                          <p className="notification-title">{item.titulo}</p>
                          <p className="notification-summary">{item.resumen}</p>
                          <span className="notification-date">
                            {formatLocalDate(item.fecha)}
                          </span>
                        </div>
                      </button>
                    )
                  })}
                </div>

                {activeNotification && (
                  <div className="notification-detail">
                    <h4>Detalle</h4>
                    <p className="notification-detail-title">
                      {activeNotification.titulo}
                    </p>
                    {activeNotification.detalle && (
                      <p className="notification-detail-text">
                        {activeNotification.detalle}
                      </p>
                    )}
                    {activeNotification.enlace && (
                      <a
                        className="notification-link"
                        href={activeNotification.enlace}
                      >
                        Ver detalles
                      </a>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="status">
            <span className="status-text">
              Chat en tiempo real · {socketState}
            </span>
          </div>
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
              id={`mensaje-${item.id}`}
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
