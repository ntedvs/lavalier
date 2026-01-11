import { spawn } from "child_process"
import { crop, Crop } from "./operations/crop"
import { flip, Flip } from "./operations/flip"
import { scale, Scale } from "./operations/scale"
import { speed, Speed } from "./operations/speed"
import { text, Text } from "./operations/text"
import { trim, Trim } from "./operations/trim"
import { volume, Volume } from "./operations/volume"

type Operation = Volume | Trim | Speed | Flip | Crop | Scale | Text

class Video {
  private input
  private operations

  constructor(input: string, operations: Operation[] = []) {
    this.input = input
    this.operations = operations
  }

  volume(level: Volume["level"]) {
    return new Video(this.input, [
      ...this.operations,
      { type: "volume", level },
    ])
  }

  trim(options: Trim["options"]) {
    return new Video(this.input, [
      ...this.operations,
      { type: "trim", options },
    ])
  }

  speed(factor: Speed["factor"]) {
    return new Video(this.input, [
      ...this.operations,
      { type: "speed", factor },
    ])
  }

  flip(direction: Flip["direction"]) {
    return new Video(this.input, [
      ...this.operations,
      { type: "flip", direction },
    ])
  }

  crop(options: Crop["options"]) {
    return new Video(this.input, [
      ...this.operations,
      { type: "crop", options },
    ])
  }

  scale(factor: Scale["factor"]) {
    return new Video(this.input, [
      ...this.operations,
      { type: "scale", factor },
    ])
  }

  text(content: Text["content"], options?: Text["options"]) {
    return new Video(this.input, [
      ...this.operations,
      { type: "text", content, options },
    ])
  }

  export(output: string) {
    const v = []
    const a = []

    for (const operation of this.operations) {
      const output = run(operation)

      if ("video" in output) v.push(output.video)
      if ("audio" in output) a.push(output.audio)
    }

    const args = ["-y"]
    const sides = []

    args.push("-i", this.input)

    if (v.length) {
      sides.push(`[0:v]${v.join(",")}[v0]`)
      args.push("-map", "[v0]")
    }

    if (a.length) {
      sides.push(`[0:a]${a.join(",")}[a0]`)
      args.push("-map", "[a0]")
    }

    args.push("-filter_complex", sides.join(";"))
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
    case "volume":
      return volume(operation)
    case "trim":
      return trim(operation)
    case "speed":
      return speed(operation)
    case "flip":
      return flip(operation)
    case "crop":
      return crop(operation)
    case "scale":
      return scale(operation)
    case "text":
      return text(operation)
  }
}

export function video(input: string) {
  return new Video(input)
}
