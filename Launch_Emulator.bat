@echo off
title Ekip Development and Emulator
echo ===================================================
echo   Starting Ekip in Development Mode (Fast Refresh)
echo ===================================================

cd /d "%LOCALAPPDATA%\Android\Sdk\emulator"
start "" emulator.exe -avd Small_Phone -no-snapshot-load -gpu auto

echo Waiting for Android device to connect...
cd /d "%LOCALAPPDATA%\Android\Sdk\platform-tools"
adb.exe wait-for-device
timeout /t 5 /nobreak >nul
adb.exe reverse tcp:8081 tcp:8081
adb.exe reverse tcp:8082 tcp:8082
echo Ports reversed successfully.

echo.
echo ===================================================
echo   Starting Metro Bundler in Development Mode
echo ===================================================
echo.
cd /d "%~dp0"
call npx expo start --android
pause
