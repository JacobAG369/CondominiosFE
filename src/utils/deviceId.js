/**
 * Returns a persistent device identifier stored in localStorage.
 * - Uses crypto.randomUUID() when available (all modern browsers).
 * - Falls back to a Math.random-based UUID-like string for older environments.
 */
export function getDeviceId() {
    const STORAGE_KEY = "device_id";

    let id = localStorage.getItem(STORAGE_KEY);
    if (id) return id;

    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        id = crypto.randomUUID();
    } else {
        // Fallback: RFC4122 v4 UUID approximation
        id = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
            const r = (Math.random() * 16) | 0;
            const v = c === "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }

    localStorage.setItem(STORAGE_KEY, id);
    return id;
}
