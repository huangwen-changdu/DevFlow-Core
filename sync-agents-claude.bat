@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

rem =====================================================
rem  Sync AGENTS.md & CLAUDE.md to other projects
rem  Source: directory where this script resides
rem =====================================================

set "SOURCE=%~dp0"
set "FILES=AGENTS.md CLAUDE.md"

set "TARGETS=D:\Project\hetu D:\Project\KocServer D:\Project\KocTask D:\Project\ServerApi\KocServer D:\Project\ServerApi\KocTask D:\Project\ServerApi\MoboTreeServer D:\Project\ServerApi\CdFinanceWebApi D:\Project\KocWebApi"

echo === Sync AGENTS.md / CLAUDE.md ===
echo Source: %SOURCE%
echo.

for %%t in (%TARGETS%) do (
    if exist "%%t" (
        for %%f in (%FILES%) do (
            if exist "%SOURCE%%%f" (
                copy /y "%SOURCE%%%f" "%%t\" >nul
                echo   [OK] %%f  -^>  %%t
            ) else (
                echo   [SKIP] source missing: %%f
            )
        )
    ) else (
        echo   [SKIP] target dir missing: %%t
    )
)

echo.
echo === Done ===
pause
endlocal
