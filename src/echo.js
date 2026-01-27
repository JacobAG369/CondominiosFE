import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
const wsScheme = import.meta.env.VITE_REVERB_SCHEME || 'http'
const wsHost = import.meta.env.VITE_REVERB_HOST || 'localhost'
const wsPort = Number(import.meta.env.VITE_REVERB_PORT || 8080)

window.Pusher = Pusher

export const echo = new Echo({
  broadcaster: 'pusher',
  key: import.meta.env.VITE_REVERB_APP_KEY || 'local',
  cluster: 'mt1',
  wsHost,
  wsPort,
  wssPort: wsPort,
  forceTLS: wsScheme === 'https',
  enabledTransports: ['ws', 'wss'],
  disableStats: true,
})

export const apiUrl = apiBaseUrl
