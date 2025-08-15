#!/usr/bin/env bash
PORT=8080
echo "Starting local server on http://localhost:${PORT}"
python3 -m http.server ${PORT}
