import { spawn } from "child_process"
import { Labels } from "./labels"
import { compile, Operation } from "./operations"

class Video {
  private input
  private operations

  constructor(input: string, operations: Operation[] = []) {
    this.input = input
    this.operations = operations
  }

  trim(start: number, end: number) {
    return new Video(this.input, [
      ...this.operations,
      { type: "trim", start, end },
    ])
  }

  resize(scale: number) {
    return new Video(this.input, [
      ...this.operations,
      { type: "resize", scale },
    ])
  }

  crop(width: number, height: number, options?: { x?: number; y?: number }) {
    return new Video(this.input, [
      ...this.operations,
      { type: "crop", width, height, ...options },
    ])
  }

  speed(factor: number) {
    return new Video(this.input, [
      ...this.operations,
      { type: "speed", factor },
    ])
  }

  volume(factor: number) {
    return new Video(this.input, [
      ...this.operations,
      { type: "volume", factor },
    ])
  }

  text(
    content: string,
    options?: {
      position?: { x: number; y: number } | "center"
      size?: number
      font?: string
      color?: string
      start?: number
      end?: number
    }
  ) {
    return new Video(this.input, [
      ...this.operations,
      { type: "text", content, ...options },
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
      args.push("-map", `[${labels.video}]`)
      args.push("-map", `[${labels.audio}]`)
    }

    args.push(output)
    spawn("ffmpeg", args)
  }
}

export function video(input: string) {
  return new Video(input)
}
