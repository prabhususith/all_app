# Quick local server for the PWA
import http.server, socketserver, webbrowser, threading

PORT = 8080
Handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    url = f"http://localhost:{PORT}"
    print(f"Serving at {url}")
    threading.Timer(1.0, lambda: webbrowser.open(url)).start()
    httpd.serve_forever()
