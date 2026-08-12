# YourPets

YourPets is a React, Vite, and Express application for browsing pets, managing carts and wishlists, and using AI-assisted pet recommendation features.

## Local installation

### 1. Install prerequisites

- [Git](https://git-scm.com/downloads)
- [Node.js LTS](https://nodejs.org/) version 20 or newer

Verify the tools are available:

```powershell
git --version
node --version
npm --version
```

### 2. Clone the repository

```powershell
git clone <repository-url>
cd YourPets
```

Replace `<repository-url>` with the URL for this repository.

### 3. Install dependencies

```powershell
npm install
```

> Note: This repository includes a `bun.lock` file. If you prefer Bun and already have it installed, you can use `bun install` instead of `npm install`.

### 4. Configure environment variables

Copy the example environment file:

```powershell
Copy-Item .env.example .env
```

Open `.env` and fill in the values. `GEMINI_API_KEY` is optional for basic local browsing — without it, AI features fall back to local matching where supported.

### 5. Start the development server

```powershell
npm run dev
```

The Express and Vite development server starts on <http://localhost:3000>.

## Useful commands

```powershell
npm run dev      # Start the local development server
npm run build    # Build the production app and server bundle
npm run start    # Run the built production server
npm run preview  # Preview the Vite production build
npm run lint     # Run TypeScript checks without emitting files
```

## Troubleshooting

### Port 3000 is already in use

Stop the other process using port 3000, or close the terminal where another copy of the app is running. On Windows, find the process with:

```powershell
netstat -ano | findstr :3000
```

Then stop it by process ID:

```powershell
taskkill /PID <process-id> /F
```
