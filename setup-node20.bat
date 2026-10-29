@echo off
echo ==================================================
echo Setting up Node 20 LTS environment...
echo ==================================================

if not exist ".runtime" mkdir .runtime

if not exist ".runtime\node20\node.exe" (
    echo Downloading portable Node.js 20 LTS (no install required)...
    powershell -NoProfile -Command "Invoke-WebRequest -Uri 'https://nodejs.org/dist/v20.18.0/node-v20.18.0-win-x64.zip' -OutFile 'node20.zip'; Expand-Archive -Path 'node20.zip' -DestinationPath '.runtime' -Force; if (Test-Path '.runtime\node20') { Remove-Item -Recurse -Force '.runtime\node20' }; Rename-Item -Path '.runtime\node-v20.18.0-win-x64' -NewName 'node20'; Remove-Item -Force 'node20.zip'"
)

if not exist ".env.local" (
    echo Creating .env.local from .env.example...
    copy .env.example .env.local
)

echo.
echo Installing npm packages with Node 20...
call .runtime\node20\npm.cmd install

echo.
echo Seeding SQLite database...
call .runtime\node20\node.exe scripts\seed-all.js

echo.
echo ==================================================
echo Setup Complete!
echo Run start-dev.bat or npm run dev to start the website!
echo ==================================================
pause
