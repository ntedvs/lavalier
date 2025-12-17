import { spawn } from "child_process"

type Trim = { type: "trim"; start: number; end: number }
type Resize = { type: "resize"; scale: number }
type Text = {
  type: "text"
  content: string
  position: { x: number; y: number } | "center"
  size: number
}

type Operation = Trim | Resize | Text

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
      } else if (o.type === "text") {
        const v = "v" + i
        const calculations = { center: "x=(w-text_w)/2:y=(h-text_h)/2" }

        const part =
          typeof o.position === "string"
            ? calculations[o.position]
            : `x=${o.position.x}:y=${o.position.y}`

        filters.push(
          `[${video}]drawtext=text='${o.content}':${part}:fontsize=${o.size}:fontcolor=white[${v}]`
        )

        video = v
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

  text(
    content: string,
    options?: { position?: { x: number; y: number } | "center"; size?: number }
  ) {
    const position = options?.position ?? "center"
    const size = options?.size ?? 24

    return new Video(this.input, [
      ...this.operations,
      { type: "text", content, position, size },
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
