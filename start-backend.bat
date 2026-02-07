@echo off
echo Starting IA Management Backend...
cd /d "%~dp0backend"

REM Use mvnd (Maven Daemon) since that's what's installed
echo Using Maven Daemon (mvnd)...
call mvnd spring-boot:run

pause
