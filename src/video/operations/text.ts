export type Text = {
  type: "text"
  content: string
  options?: {
    position?:
      | ({ x: number; y?: number } | { x?: number; y: number })
      | "center"
    size?: number
    font?: string
    color?: string
    start?: number
    end?: number
  }
}

export function text({ content, options = {} }: Text) {
  const parts = []

  const escaped = content
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "\\'")
    .replace(/:/g, "\\:")
  parts.push(`text='${escaped}'`)

  if (options.position) {
    const calculations = { center: "x=(w-text_w)/2:y=(h-text_h)/2" }

    if (typeof options.position === "string") {
      parts.push(calculations[options.position])
    } else {
      if (options.position.x) parts.push(`x=${options.position.x}`)
      if (options.position.y) parts.push(`y=${options.position.y}`)
    }
  }

  if (options.size !== undefined) parts.push(`fontsize=${options.size}`)
  if (options.font) parts.push(`font=${options.font}`)
  if (options.color) parts.push(`fontcolor=${options.color}`)

  if (options.start !== undefined || options.end !== undefined) {
    let enable = `between(t,${options.start},${options.end})`

    if (options.start === undefined) {
      enable = `lte(t,${options.end})`
    } else if (options.end === undefined) {
      enable = `gte(t,${options.start})`
    }

    parts.push(`enable='${enable}'`)
  }

  return { video: `drawtext=${parts.join(":")}` }
}
