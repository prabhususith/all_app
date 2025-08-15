# Herbal & Ayurvedic Remedy Guide — Quick Start

This PWA must be served over **http(s)** or **localhost** for the Service Worker to work.
Opening `index.html` via `file://` loads the UI, but **Install**/**Offline** won't work.

## Option A — One‑liner (Python)
```bash
cd herbal-remedy-pwa
python3 -m http.server 8080
# then open http://localhost:8080/
```

## Option B — Windows (double‑click)
- Double‑click `start_server.bat`
- It will open http://localhost:8080/

## Option C — macOS/Linux (Terminal)
```bash
chmod +x start_server.sh
./start_server.sh
# then open http://localhost:8080/
```

## After first load
- Use browser menu to **Install** / **Add to Home Screen**.
- Go offline and refresh to verify cached assets.
