import { spawn } from "child_process"
import fs from "fs"

export async function startFlowiseServer() {
  // Environment variables with defaults
  const PORT = process.env.PORT || "3000"
  const FLOWISE_USERNAME = process.env.FLOWISE_USERNAME
  const FLOWISE_PASSWORD = process.env.FLOWISE_PASSWORD
  const FLOWISE_SECRETKEY_OVERWRITE = process.env.FLOWISE_SECRETKEY_OVERWRITE
  const DATABASE_PATH = process.env.DATABASE_PATH || ".flowise"
  const APIKEY_PATH = process.env.APIKEY_PATH || ".flowise"
  const LOG_PATH = process.env.LOG_PATH || ".flowise/logs"
  const DEBUG = process.env.DEBUG || "false"
  const TOOL_FUNCTION_BUILTIN_DEP = process.env.TOOL_FUNCTION_BUILTIN_DEP || "crypto,fs,os,path,process,stream,util"
  const TOOL_FUNCTION_EXTERNAL_DEP = process.env.TOOL_FUNCTION_EXTERNAL_DEP || ""

  // Ensure directories exist
  const dirs = [DATABASE_PATH, APIKEY_PATH, LOG_PATH]
  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
  })

  // Start Flowise server
  const flowiseProcess = spawn("npx", ["flowise", "start"], {
    env: {
      ...process.env,
      PORT,
      FLOWISE_USERNAME,
      FLOWISE_PASSWORD,
      FLOWISE_SECRETKEY_OVERWRITE,
      DATABASE_PATH,
      APIKEY_PATH,
      LOG_PATH,
      DEBUG,
      TOOL_FUNCTION_BUILTIN_DEP,
      TOOL_FUNCTION_EXTERNAL_DEP,
    },
  })

  flowiseProcess.stdout.on("data", (data) => {
    console.log(`Flowise: ${data}`)
  })

  flowiseProcess.stderr.on("data", (data) => {
    console.error(`Flowise Error: ${data}`)
  })

  flowiseProcess.on("close", (code) => {
    console.log(`Flowise process exited with code ${code}`)
  })

  return flowiseProcess
}
