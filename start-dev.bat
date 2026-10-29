@echo off
if exist ".runtime\node20\node.exe" (
    echo Starting server with Node 20...
    call .runtime\node20\npm.cmd run dev
) else (
    echo Starting server with system Node...
    call npm run dev
)
