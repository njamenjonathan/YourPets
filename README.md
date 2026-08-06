# YourPets

YourPets is a React, Vite, and Express application for browsing pets, managing carts and wishlists, and using AI-assisted pet recommendation features.

## Windows local installation

These instructions assume you are using Windows 10 or Windows 11 with PowerShell.

### 1. Install prerequisites

Install the following tools before setting up the project:

- [Git for Windows](https://git-scm.com/download/win)
- [Node.js LTS](https://nodejs.org/) version 20 or newer
- [Python](https://www.python.org/downloads/windows/) version 3.11 or newer, if you want to create a Python virtual environment for local helper tooling

After installation, open a new PowerShell window and verify the tools are available:

```powershell
git --version
node --version
npm --version
python --version
```

### 2. Clone the repository

```powershell
git clone <repository-url>
cd YourPets
```

Replace `<repository-url>` with the URL for this repository.

### 3. Create a Python virtual environment

The application itself runs on Node.js, but a Python virtual environment can keep any local Python-based helper tools isolated from your system Python installation.

```powershell
python -m venv .venv
```

Activate the virtual environment:

```powershell
.\.venv\Scripts\Activate.ps1
```

If PowerShell blocks activation scripts, allow scripts for the current user and then try activation again:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\.venv\Scripts\Activate.ps1
```

When the environment is active, your PowerShell prompt should show `(.venv)`. To leave the virtual environment later, run:

```powershell
deactivate
```

### 4. Install Node.js dependencies

With or without the Python virtual environment active, install the JavaScript dependencies from the project root:

```powershell
npm install
```

> Note: This repository includes a `bun.lock` file. If you prefer Bun and already have it installed, you can use `bun install` instead of `npm install`.

### 5. Configure environment variables

Copy the example environment file:

```powershell
Copy-Item .env.example .env
```

Open `.env` and update the values as needed:

```env
GEMINI_API_KEY="your_gemini_api_key"
APP_URL="http://localhost:3000"
```

`GEMINI_API_KEY` is optional for basic local browsing. If it is not set, AI features fall back to local matching where supported.

### 6. Start the local development server

```powershell
npm run dev
```

The Express and Vite development server starts on:

```text
http://localhost:3000
```

Open that address in your browser.

## Useful commands

```powershell
npm run dev      # Start the local development server
npm run build    # Build the production app and server bundle
npm run start    # Run the built production server
npm run preview  # Preview the Vite production build
npm run lint     # Run TypeScript checks without emitting files
```

## Troubleshooting on Windows

### `python` is not recognized

Install Python from python.org and select **Add python.exe to PATH** during installation. Then reopen PowerShell.

### Virtual environment activation is blocked

Run this once in PowerShell:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Then activate again:

```powershell
.\.venv\Scripts\Activate.ps1
```

### Port 3000 is already in use

Stop the other process using port 3000, or close the terminal where another copy of the app is running. On Windows, you can find the process with:

```powershell
netstat -ano | findstr :3000
```

Then stop it by process ID:

```powershell
taskkill /PID <process-id> /F
```
