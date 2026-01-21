import { spawn } from "child_process"
import { speed, Speed } from "./operations/speed"
import { trim, Trim } from "./operations/trim"
import { volume, Volume } from "./operations/volume"

type Concat = { type: "concat"; audio: Audio }
type Operation = Trim | Speed | Volume | Concat

class Audio {
  private input
  private operations

  constructor(input: string, operations: Operation[] = []) {
    this.input = input
    this.operations = operations
  }

  trim(options: Trim["options"]) {
    return new Audio(this.input, [
      ...this.operations,
      { type: "trim", options },
    ])
  }

  speed(factor: Speed["factor"]) {
    return new Audio(this.input, [
      ...this.operations,
      { type: "speed", factor },
    ])
  }

  volume(level: Volume["level"]) {
    return new Audio(this.input, [
      ...this.operations,
      { type: "volume", level },
    ])
  }

  concat(audio: Concat["audio"]) {
    return new Audio(this.input, [
      ...this.operations,
      { type: "concat", audio },
    ])
  }

  export(output: string) {
    const audios: Audio[] = []
    const filters: string[] = []

    const compile = (audio: Audio) => {
      let index = audios.indexOf(audio)
      if (index === -1) {
        index = audios.length
        audios.push(audio)
      }

      let aud = `${index}:a`

      const handlers = { volume, trim, speed }

      for (const operation of audio.operations) {
        if (operation.type === "concat") {
          const out = compile(operation.audio)
          const nextAud = `a${filters.length}`

          filters.push(`[${aud}][${out}]concat=n=2:v=0:a=1[${nextAud}]`)

          aud = nextAud
        } else {
          const result = handlers[operation.type](operation as any)

          const next = `a${filters.length}`
          filters.push(`[${aud}]${result}[${next}]`)
          aud = next
        }
      }

      return aud
    }

    const final = compile(this)
    const args = ["-y"]

    for (const audio of audios) {
      args.push("-i", audio.input)
    }

    if (filters.length) {
      args.push("-filter_complex", filters.join(";"))

      const map = (stream: string) =>
        stream.includes(":") ? stream : `[${stream}]`

      args.push("-map", map(final))
    }

    args.push(output)

    return new Promise<void>((resolve, reject) => {
      const process = spawn("ffmpeg", args, { stdio: "inherit" })

      process.on("error", (error) => {
        reject(new Error("Error"))
      })

      process.on("exit", (code) => {
        if (code === 0) resolve()
        else reject(new Error("Error"))
      })
    })
  }
}

export function audio(input: string) {
  return new Audio(input)
}
