import { Context } from "."

export type Speed = {
  type: "speed"
  factor: number
}

export function speed(operation: Speed, context: Context) {
  const { filters, labels } = context
  const { video, audio } = labels.allocate(["video", "audio"])

  filters.push(`[${labels.video}]setpts=PTS/${operation.factor}[${video}]`)

  const chain = []
  let remaining = operation.factor

  while (remaining > 2.0) {
    chain.push("atempo=2.0")
    remaining /= 2.0
  }
  while (remaining < 0.5) {
    chain.push("atempo=0.5")
    remaining /= 0.5
  }

  chain.push(`atempo=${remaining}`)
  filters.push(`[${labels.audio}]${chain.join(",")}[${audio}]`)

  labels.video = video
  labels.audio = audio
}
