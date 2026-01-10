import { spawn } from "child_process"
import { Labels } from "./labels"
import { compile, Operation } from "./operations"

class Audio {
  private input
  private operations

  constructor(input: string, operations: Operation[] = []) {
    this.input = input
    this.operations = operations
  }

  trim(start: number, end: number) {
    return new Audio(this.input, [
      ...this.operations,
      { type: "trim", start, end },
    ])
  }

  speed(factor: number) {
    return new Audio(this.input, [
      ...this.operations,
      { type: "speed", factor },
    ])
  }

  volume(factor: number) {
    return new Audio(this.input, [
      ...this.operations,
      { type: "volume", factor },
    ])
  }

  export(output: string) {
    const filters: string[] = []
    const labels = new Labels()

    for (const operation of this.operations) {
      compile(operation, { filters, labels })
    }

    const args = ["-y"]
    args.push("-i", this.input)

    const complex = filters.join(";")
    if (complex.length) {
      args.push("-filter_complex", complex)
      args.push("-map", `[${labels.audio}]`)
    }

    args.push("-vn")
    args.push(output)

    return new Promise<void>((resolve, reject) => {
      const process = spawn("ffmpeg", args)

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
