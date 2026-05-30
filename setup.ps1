# Run from calculator-stack folder: .\setup.ps1
$ErrorActionPreference = "Stop"
$env:NODE_OPTIONS = "--use-system-ca"

Write-Host "Installing backend..." -ForegroundColor Cyan
Set-Location "$PSScriptRoot\backend"
npm install
npm exec prisma generate

Write-Host "Installing frontend..." -ForegroundColor Cyan
Set-Location "$PSScriptRoot\frontend"
npm install

Write-Host ""
Write-Host "Done. Next steps:" -ForegroundColor Green
Write-Host "  1. (Optional) Install Docker, then: docker compose up -d"
Write-Host "  2. (Optional) cd backend; npm exec prisma migrate deploy"
Write-Host "  3. Terminal 1: cd backend; npm run start:dev"
Write-Host "  4. Terminal 2: cd frontend; npm run dev"
Write-Host ""
Write-Host "Without Docker/Postgres the UI still works (local math + browser history)." -ForegroundColor Yellow
