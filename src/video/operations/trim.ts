export type Trim = {
  type: "trim"
  options: { start: number; end?: number } | { start?: number; end: number }
}

export function trim({ options }: Trim) {
  const parts = []

  if (options.start !== undefined) parts.push(`start=${options.start}`)
  if (options.end !== undefined) parts.push(`end=${options.end}`)

  const params = parts.join(":")

  return {
    video: `trim=${params},setpts=PTS-STARTPTS`,
    audio: `atrim=${params},asetpts=PTS-STARTPTS`,
  }
}
