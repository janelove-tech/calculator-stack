# Creates GitHub repo and pushes (requires Git + GitHub CLI)
# Run from project root: .\scripts\push-to-github.ps1

param(
  [string]$RepoName = "calculator-stack",
  [switch]$Private
)

$ErrorActionPreference = "Stop"
Set-Location (Resolve-Path (Join-Path $PSScriptRoot ".."))

foreach ($cmd in @("git", "gh")) {
  if (-not (Get-Command $cmd -ErrorAction SilentlyContinue)) {
    Write-Error "$cmd not found. See docs/GITHUB.md for setup."
  }
}

gh auth status 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
  Write-Host "Run: gh auth login" -ForegroundColor Yellow
  exit 1
}

if (-not (Test-Path .git)) {
  git init
  git branch -M main
}

git add .
if (git status --porcelain) {
  git commit -m "Initial commit: multifaceted calculator (Next.js, NestJS, PostgreSQL, Prisma)"
}

$vis = if ($Private) { "--private" } else { "--public" }
$hasRemote = git remote 2>$null | Select-String "origin"

if ($hasRemote) {
  git push -u origin main
} else {
  gh repo create $RepoName $vis --source=. --remote=origin --push
}

Write-Host "Success. Open repo:" -ForegroundColor Green
gh repo view --web
