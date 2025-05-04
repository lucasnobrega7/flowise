const { createServer } = require("http")
const { parse } = require("url")
const next = require("next")
const { spawn } = require("child_process")
const fs = require("fs")

const dev = process.env.NODE_ENV !== "production"
const hostname = "localhost"
const port = process.env.PORT || 3000

// Ensure directories exist
const DATABASE_PATH = process.env.DATABASE_PATH || ".flowise"
const APIKEY_PATH = process.env.APIKEY_PATH || ".flowise"
const LOG_PATH = process.env.LOG_PATH || ".flowise/logs"

const dirs = [DATABASE_PATH, APIKEY_PATH, LOG_PATH]
dirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
})

// Start Flowise in the background
const flowiseProcess = spawn("npx", ["flowise", "start"], {
  env: {
    ...process.env,
    PORT: Number.parseInt(port) + 1, // Run Flowise on a different port
  },
  detached: true,
})

flowiseProcess.stdout.on("data", (data) => {
  console.log(`Flowise: ${data}`)
})

flowiseProcess.stderr.on("data", (data) => {
  console.error(`Flowise Error: ${data}`)
})

// Start Next.js
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error("Error occurred handling", req.url, err)
      res.statusCode = 500
      res.end("Internal Server Error")
    }
  }).listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://${hostname}:${port}`)
  })
})

// Handle graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down...")
  if (flowiseProcess && !flowiseProcess.killed) {
    flowiseProcess.kill()
  }
  process.exit(0)
})

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down...")
  if (flowiseProcess && !flowiseProcess.killed) {
    flowiseProcess.kill()
  }
  process.exit(0)
})
