import { spawn } from "child_process"
import { crop, Crop } from "./operations/crop"
import { flip, Flip } from "./operations/flip"
import { scale, Scale } from "./operations/scale"
import { speed, Speed } from "./operations/speed"
import { text, Text } from "./operations/text"
import { trim, Trim } from "./operations/trim"
import { volume, Volume } from "./operations/volume"

type Concat = { type: "concat"; video: Video }
type Operation = Volume | Trim | Speed | Flip | Crop | Scale | Text | Concat

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

  concat(video: Concat["video"]) {
    return new Video(this.input, [
      ...this.operations,
      { type: "concat", video },
    ])
  }

  export(output: string) {
    const videos: Video[] = []
    const filters: string[] = []
    let counter = 0

    const compile = (video: Video) => {
      let index = videos.indexOf(video)
      if (index === -1) {
        index = videos.length
        videos.push(video)
      }

      let vid = `${index}:v`
      let aud = `${index}:a`

      const handlers = { volume, trim, flip, crop, speed, scale, text }

      for (const operation of video.operations) {
        if (operation.type === "concat") {
          const out = compile(operation.video)
          const nextVid = `v${counter++}`
          const nextAud = `a${counter++}`

          filters.push(
            `[${vid}][${aud}][${out.video}][${out.audio}]concat=n=2:v=1:a=1[${nextVid}][${nextAud}]`,
          )

          vid = nextVid
          aud = nextAud
        } else {
          const result = handlers[operation.type](operation as any)

          if ("video" in result) {
            const next = `v${counter++}`
            filters.push(`[${vid}]${result.video}[${next}]`)
            vid = next
          }

          if ("audio" in result) {
            const next = `a${counter++}`
            filters.push(`[${aud}]${result.audio}[${next}]`)
            aud = next
          }
        }
      }

      return { video: vid, audio: aud }
    }

    const final = compile(this)
    const args = ["-y"]

    for (const video of videos) {
      args.push("-i", video.input)
    }

    if (filters.length) {
      args.push("-filter_complex", filters.join(";"))

      const map = (stream: string) =>
        stream.includes(":") ? stream : `[${stream}]`

      args.push("-map", map(final.video))
      args.push("-map", map(final.audio))
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

export function video(input: string) {
  return new Video(input)
}
