# Publishing to GitHub

## Prerequisites

1. [Git for Windows](https://git-scm.com/download/win)
2. [GitHub CLI](https://cli.github.com/) (optional but easiest)
3. A [GitHub](https://github.com) account

Verify:

```powershell
git --version
gh --version
gh auth login
```

## Option A — GitHub CLI (recommended)

From the project root:

```powershell
cd calculator-stack

git init
git add .
git commit -m "Initial commit: multifaceted calculator full stack"

gh repo create calculator-stack --public --source=. --remote=origin --push
```

Use `--private` instead of `--public` for a private repository.

## Option B — Manual

1. On GitHub, click **New repository** → name it `calculator-stack` → do **not** add a README (this repo has one).

2. Locally:

```powershell
cd calculator-stack

git init
git add .
git commit -m "Initial commit: multifaceted calculator full stack"

git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/calculator-stack.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

## What gets committed

Included:

- Source code, Prisma schema, migrations
- `package.json`, lockfiles
- `.env.example` files
- Documentation

Excluded (via `.gitignore`):

- `node_modules/`, `dist/`, `.next/`
- `.env`, `.env.local` (secrets)

## After pushing

Update the clone URL in `README.md`:

```markdown
git clone https://github.com/YOUR_USERNAME/calculator-stack.git
```

Optionally enable **GitHub Actions** later for CI (build + lint).
