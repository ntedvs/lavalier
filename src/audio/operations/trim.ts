import { Context } from "."

export type Trim = {
  type: "trim"
  start: number
  end: number
}

export function trim(operation: Trim, context: Context) {
  const { filters, labels } = context
  const audio = labels.allocate()

  filters.push(
    `[${labels.audio}]atrim=start=${operation.start}:end=${operation.end},asetpts=PTS-STARTPTS[${audio}]`
  )

  labels.audio = audio
}
