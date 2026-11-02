@echo off
title Ekip Web Server (Mobile & LAN)
cd /d "%~dp0"
cls
echo ===================================================
echo             Ekip Web Server for Mobile
echo ===================================================
echo.
echo [1] Normal LAN Mode (Same Wi-Fi: Phone + PC) [Default]
echo [2] Tunnel Mode (Works even with VPN / Firewall)
echo.
set /p choice="Choose an option (1 or 2, Enter for 1): "

if "%choice%"=="2" (
    echo.
    echo Starting Expo in Tunnel mode for Web...
    cmd /c npx expo start --web --tunnel
) else (
    echo.
    echo Your IPv4 Address:
    for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i "IPv4"') do (
        echo    %%a:8081
    )
    echo.
    echo Open the address above in your phone browser!
    echo Starting Expo Web on LAN...
    echo.
    cmd /c npx expo start --web --host lan
)
pause
