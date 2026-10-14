@echo off
:: This opens the animated SVG in your default web browser
start "" "loading.html"

echo Initializing Git repository...
git init

echo Adding files...
git add .

echo Committing files...
git commit -m "commit"

echo Setting main branch...
git branch -M main

echo Adding remote origin...
git remote add origin https://github.com/GeorgeZv/cardio-atlas.git

echo Pushing to GitHub...
git push -u origin main

echo.
echo Upload complete!
pause