import { Context } from "."

export type Volume = {
  type: "volume"
  factor: number
}

export function volume(operation: Volume, context: Context) {
  const { filters, labels } = context
  const { audio } = labels.allocate(["audio"])

  filters.push(`[${labels.audio}]volume=${operation.factor}[${audio}]`)

  labels.audio = audio
}
