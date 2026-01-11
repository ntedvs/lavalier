export type Crop = {
  type: "crop"
  options:
    | { width: number; x?: number; height?: never; y?: never }
    | { height: number; y?: number; width?: never; x?: never }
    | { width: number; height: number; x?: number; y?: number }
}

export function crop({ options }: Crop) {
  const width = options.width ?? "iw"
  const height = options.height ?? "ih"

  let video = `crop=${width}:${height}`

  if (options.x !== undefined || options.y !== undefined) {
    const x = options.x ?? 0
    const y = options.y ?? 0

    video += `:${x}:${y}`
  }

  return { video }
}
