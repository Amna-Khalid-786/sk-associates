@echo off
echo Resetting Next.js Dev Server...

:: Kill node processes that might be holding the lock
taskkill /F /IM node.exe /T 2>nul

:: Remove the .next directory which contains the lock file
if exist .next (
    echo Removing .next directory...
    rmdir /s /q .next
)

echo Cleanup complete. You can now run 'npm run dev' again.
pause
