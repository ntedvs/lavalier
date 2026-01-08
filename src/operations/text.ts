import { Context } from "."

export type Text = {
  type: "text"
  content: string
  position?: { x: number; y: number } | "center"
  size?: number
  font?: string
  color?: string
  start?: number
  end?: number
}

export function text(operation: Text, context: Context) {
  const { filters, labels } = context
  const { video } = labels.allocate(["video"])

  const parts = []

  const escaped = operation.content
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "\\'")
    .replace(/:/g, "\\:")
  parts.push(`text='${escaped}'`)

  if (operation.position) {
    const calculations = { center: "x=(w-text_w)/2:y=(h-text_h)/2" }

    parts.push(
      typeof operation.position === "string"
        ? calculations[operation.position]
        : `x=${operation.position.x}:y=${operation.position.y}`
    )
  }

  if (operation.size !== undefined) parts.push(`fontsize=${operation.size}`)
  if (operation.font) parts.push(`font=${operation.font}`)
  if (operation.color) parts.push(`fontcolor=${operation.color}`)

  if (operation.start !== undefined || operation.end !== undefined) {
    let enable = `between(t,${operation.start},${operation.end})`

    if (operation.start === undefined) {
      enable = `lte(t,${operation.end})`
    } else if (operation.end === undefined) {
      enable = `gte(t,${operation.start})`
    }

    parts.push(`enable='${enable}'`)
  }

  filters.push(`[${labels.video}]drawtext=${parts.join(":")}[${video}]`)

  labels.video = video
}
