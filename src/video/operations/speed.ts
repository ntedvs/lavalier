export type Speed = {
  type: "speed"
  factor: number
}

export function speed({ factor }: Speed) {
  const chain = []
  let remaining = factor

  while (remaining > 2.0) {
    chain.push("atempo=2.0")
    remaining /= 2.0
  }
  while (remaining < 0.5) {
    chain.push("atempo=0.5")
    remaining /= 0.5
  }

  chain.push(`atempo=${remaining}`)

  return {
    video: `setpts=PTS/${factor}`,
    audio: `${chain.join(",")}`,
  }
}
