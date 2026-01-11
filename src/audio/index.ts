import { spawn } from "child_process"
import { speed, Speed } from "./operations/speed"
import { trim, Trim } from "./operations/trim"
import { volume, Volume } from "./operations/volume"

type Operation = Trim | Speed | Volume

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

  export(output: string) {
    const a = []

    for (const operation of this.operations) {
      a.push(run(operation))
    }

    const args = ["-y"]
    args.push("-i", this.input)

    if (a.length) {
      args.push("-filter_complex", `[0:a]${a.join(",")}[a0]`)
      args.push("-map", "[a0]")
    }

    args.push("-vn")
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

function run(operation: Operation) {
  switch (operation.type) {
    case "trim":
      return trim(operation)
    case "speed":
      return speed(operation)
    case "volume":
      return volume(operation)
  }
}

export function audio(input: string) {
  return new Audio(input)
}
