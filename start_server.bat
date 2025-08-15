@echo off
set PORT=8080
echo Starting local server on http://localhost:%PORT%
python -m http.server %PORT%
pause
