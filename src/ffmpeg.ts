import { spawn } from "node:child_process"

export async function ffmpeg(args: readonly string[]): Promise<void> {
  const child = spawn("ffmpeg", args, {
    stdio: ["ignore", "ignore", "pipe"],
  })

  let stderr = ""
  child.stderr.setEncoding("utf8")
  child.stderr.on("data", (chunk) => {
    stderr += chunk
  })

  const code = await new Promise<number | null>((resolve, reject) => {
    child.on("error", reject)
    child.on("close", resolve)
  })

  if (code !== 0) {
    throw new Error(`ffmpeg exited with code ${code}\n${stderr.trim()}`)
  }
}
