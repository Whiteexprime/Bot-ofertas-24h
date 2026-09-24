@echo off
cd /d "%~dp0"
where py >nul 2>nul && (start "" http://127.0.0.1:8765/ & py -m http.server 8765) || (start "" http://127.0.0.1:8765/ & python -m http.server 8765)
