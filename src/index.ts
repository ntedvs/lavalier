import { spawn } from "child_process"

type Trim = { type: "trim"; start: number; end: number }
type Resize = { type: "resize"; scale: number }
type Speed = { type: "speed"; factor: number }
type Volume = { type: "volume"; factor: number }

type Crop = {
  type: "crop"
  width: number
  height: number
  x?: number
  y?: number
}

type Text = {
  type: "text"
  content: string
  position?: { x: number; y: number } | "center"
  size?: number
  font?: string
  color?: string
  start?: number
  end?: number
}

type Operation = Trim | Resize | Crop | Text | Speed | Volume

class Video {
  private input
  private operations

  constructor(input: string, operations: Operation[] = []) {
    this.input = input
    this.operations = operations
  }

  private compile() {
    const filters = []

    let video = "0:v"
    let audio = "0:a"
    let i = 0

    for (const o of this.operations) {
      if (o.type === "trim") {
        const v = "v" + i
        const a = "a" + i

        filters.push(
          `[${video}]trim=start=${o.start}:end=${o.end},setpts=PTS-STARTPTS[${v}]`
        )
        filters.push(
          `[${audio}]atrim=start=${o.start}:end=${o.end},asetpts=PTS-STARTPTS[${a}]`
        )

        video = v
        audio = a
        i += 1
      } else if (o.type === "resize") {
        const v = "v" + i

        filters.push(`[${video}]scale=iw*${o.scale}:ih*${o.scale}[${v}]`)

        video = v
        i += 1
      } else if (o.type === "crop") {
        const v = "v" + i

        const x = o.x !== undefined ? o.x : `(iw-${o.width})/2`
        const y = o.y !== undefined ? o.y : `(ih-${o.height})/2`

        filters.push(`[${video}]crop=${o.width}:${o.height}:${x}:${y}[${v}]`)

        video = v
        i += 1
      } else if (o.type === "text") {
        const v = "v" + i
        const parts = []

        const escaped = o.content
          .replace(/\\/g, "\\\\")
          .replace(/'/g, "\\'")
          .replace(/:/g, "\\:")

        parts.push(`text='${escaped}'`)

        if (o.position) {
          const calculations = { center: "x=(w-text_w)/2:y=(h-text_h)/2" }

          parts.push(
            typeof o.position === "string"
              ? calculations[o.position]
              : `x=${o.position.x}:y=${o.position.y}`
          )
        }

        if (o.size !== undefined) parts.push(`fontsize=${o.size}`)
        if (o.font) parts.push(`font=${o.font}`)
        if (o.color) parts.push(`fontcolor=${o.color}`)

        if (o.start !== undefined || o.end !== undefined) {
          let enable = `between(t,${o.start},${o.end})`

          if (o.start === undefined) {
            enable = `lte(t,${o.end})`
          } else if (o.end === undefined) {
            enable = `gte(t,${o.start})`
          }

          parts.push(`enable='${enable}'`)
        }

        filters.push(`[${video}]drawtext=${parts.join(":")}[${v}]`)

        video = v
        i += 1
      } else if (o.type === "speed") {
        const v = "v" + i
        const a = "a" + i

        filters.push(`[${video}]setpts=PTS/${o.factor}[${v}]`)

        const chain = []
        let remaining = o.factor

        while (remaining > 2.0) {
          chain.push("atempo=2.0")
          remaining /= 2.0
        }
        while (remaining < 0.5) {
          chain.push("atempo=0.5")
          remaining /= 0.5
        }

        chain.push(`atempo=${remaining}`)
        filters.push(`[${audio}]${chain.join(",")}[${a}]`)

        video = v
        audio = a
        i += 1
      } else if (o.type === "volume") {
        const a = "a" + i

        filters.push(`[${audio}]volume=${o.factor}[${a}]`)

        audio = a
        i += 1
      }
    }

    return {
      complex: filters.join(";"),
      video,
      audio,
    }
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

  crop(options: { width: number; height: number; x?: number; y?: number }) {
    return new Video(this.input, [
      ...this.operations,
      { type: "crop", ...options },
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

  speed(factor: number) {
    if (factor <= 0) {
      throw new Error("Speed factor must be positive")
    }

    return new Video(this.input, [
      ...this.operations,
      { type: "speed", factor },
    ])
  }

  volume(factor: number) {
    if (factor < 0) {
      throw new Error("Volume factor must be non-negative")
    }
    if (factor > 100) {
      throw new Error("Volume factor must not exceed 100")
    }
    if (!isFinite(factor)) {
      throw new Error("Volume factor must be a valid number")
    }

    return new Video(this.input, [
      ...this.operations,
      { type: "volume", factor },
    ])
  }

  export(output: string) {
    const { complex, video, audio } = this.compile()

    const args = ["-y"]
    args.push("-i", this.input)

    if (complex.length) {
      args.push("-filter_complex", complex)
      args.push("-map", `[${video}]`)
      args.push("-map", `[${audio}]`)
    }

    args.push(output)

    return new Promise<void>((resolve, reject) => {
      const p = spawn("ffmpeg", args, { stdio: "inherit" })

      p.once("error", reject)
      p.once("exit", (code) => {
        if (code === 0) resolve()
        else reject(new Error("Error"))
      })
    })
  }
}

export function video(input: string) {
  return new Video(input)
}
