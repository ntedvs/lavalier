export type Volume = {
  type: "volume"
  level: number
}

export function volume({ level }: Volume) {
  return `volume=${level}`
}
