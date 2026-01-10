import { Context } from "."

export type Crop = {
  type: "crop"
  width: number
  height: number
  x?: number
  y?: number
}

export function crop(operation: Crop, context: Context) {
  const { filters, labels } = context
  const { video } = labels.allocate(["video"])

  const x =
    operation.x !== undefined ? operation.x : `(iw-${operation.width})/2`
  const y =
    operation.y !== undefined ? operation.y : `(ih-${operation.height})/2`

  filters.push(
    `[${labels.video}]crop=${operation.width}:${operation.height}:${x}:${y}[${video}]`
  )

  labels.video = video
}
