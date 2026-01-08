import { Context } from "."

export type Trim = {
  type: "trim"
  start: number
  end: number
}

export function trim(operation: Trim, context: Context) {
  const { filters, labels } = context
  const { video, audio } = labels.allocate(["video", "audio"])

  filters.push(
    `[${labels.video}]trim=start=${operation.start}:end=${operation.end},setpts=PTS-STARTPTS[${video}]`
  )
  filters.push(
    `[${labels.audio}]atrim=start=${operation.start}:end=${operation.end},asetpts=PTS-STARTPTS[${audio}]`
  )

  labels.video = video
  labels.audio = audio
}
