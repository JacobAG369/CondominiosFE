import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = Pusher;

const echo = new Echo({
  broadcaster: "pusher",
  key: "local",
  cluster: "mt1",     // obligatorio para pusher-js
  wsHost: "127.0.0.1",
  wsPort: 6002,
  wssPort: 6002,
  forceTLS: false,
  encrypted: false,
  enabledTransports: ["ws"],
});

export default echo;

