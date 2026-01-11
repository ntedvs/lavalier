export type Scale = {
  type: "scale"
  factor: number
}

export function scale({ factor }: Scale) {
  return { video: `scale=iw*${factor}:ih*${factor}` }
}
