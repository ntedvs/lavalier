import { Context } from "."

export type Resize = {
  type: "resize"
  scale: number
}

export function resize(operation: Resize, context: Context) {
  const { filters, labels } = context
  const { video } = labels.allocate(["video"])

  filters.push(
    `[${labels.video}]scale=iw*${operation.scale}:ih*${operation.scale}[${video}]`
  )

  labels.video = video
}
