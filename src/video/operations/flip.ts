import { Context } from "."

export type Flip = {
  type: "flip"
  direction: "horizontal" | "vertical"
}

export function flip(operation: Flip, context: Context) {
  const { filters, labels } = context
  const { video } = labels.allocate(["video"])

  const direction = operation.direction === "horizontal" ? "hflip" : "vflip"
  filters.push(`[${labels.video}]${direction}[${video}]`)

  labels.video = video
}
