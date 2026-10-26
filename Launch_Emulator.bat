@echo off
title Ekip Android Emulator
cd /d "C:\Users\Mirsoos\AppData\Local\Android\Sdk\emulator"
start "" emulator.exe -avd Small_Phone -no-snapshot-load -gpu auto
echo Waiting for emulator to connect...
cd /d "C:\Users\Mirsoos\AppData\Local\Android\Sdk\platform-tools"
adb.exe wait-for-device
timeout /t 5 /nobreak >nul
adb.exe reverse tcp:8081 tcp:8081
adb.exe reverse tcp:8082 tcp:8082
echo Done! Emulator connected and ports reversed.
