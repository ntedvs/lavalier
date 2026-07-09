export type ClipGraph =
  | { readonly kind: "source"; readonly path: string }
  | {
      readonly kind: "trim"
      readonly input: ClipGraph
      readonly start: number
      readonly end?: number
    }
  | { readonly kind: "volume"; readonly input: ClipGraph; readonly level: number }
  | { readonly kind: "fps"; readonly input: ClipGraph; readonly rate: number }
  | {
      readonly kind: "crop"
      readonly input: ClipGraph
      readonly x: number
      readonly y: number
      readonly width: number
      readonly height: number
    }
  | {
      readonly kind: "scale"
      readonly input: ClipGraph
      readonly width?: number
      readonly height?: number
    }
  | { readonly kind: "concat"; readonly inputs: readonly ClipGraph[] }

export type ScaleOptions =
  | { readonly width: number; readonly height?: number }
  | { readonly width?: number; readonly height: number }

export type TrimOptions =
  | { readonly start: number; readonly end?: number }
  | { readonly start?: number; readonly end: number }

export function source(path: string): ClipGraph {
  if (path.length === 0) {
    throw new Error("video input path must not be empty")
  }

  return { kind: "source", path }
}

export function trim(input: ClipGraph, options: TrimOptions): ClipGraph {
  const start = options.start ?? 0
  const { end } = options

  if (options.start === undefined && end === undefined) {
    throw new Error("trim requires start, end, or both")
  }

  if (!Number.isFinite(start)) {
    throw new Error("trim start must be a finite number")
  }

  if (end !== undefined && !Number.isFinite(end)) {
    throw new Error("trim end must be a finite number")
  }

  if (start < 0) {
    throw new Error("trim start must be greater than or equal to 0")
  }

  if (end !== undefined && end <= start) {
    throw new Error("trim end must be greater than trim start")
  }

  return { kind: "trim", input, start, end }
}

export function concat(inputs: readonly ClipGraph[]): ClipGraph {
  if (inputs.length < 2) {
    throw new Error("concat requires at least one additional video")
  }

  return { kind: "concat", inputs }
}

export function volume(input: ClipGraph, level: number): ClipGraph {
  if (!Number.isFinite(level)) {
    throw new Error("volume level must be a finite number")
  }

  if (level < 0) {
    throw new Error("volume level must be greater than or equal to 0")
  }

  return { kind: "volume", input, level }
}

export function fps(input: ClipGraph, rate: number): ClipGraph {
  if (!Number.isFinite(rate)) {
    throw new Error("fps rate must be a finite number")
  }

  if (rate <= 0) {
    throw new Error("fps rate must be greater than 0")
  }

  return { kind: "fps", input, rate }
}

export function crop(
  input: ClipGraph,
  options: {
    readonly x: number
    readonly y: number
    readonly width: number
    readonly height: number
  },
): ClipGraph {
  const { x, y, width, height } = options

  if (
    !Number.isFinite(x) ||
    !Number.isFinite(y) ||
    !Number.isFinite(width) ||
    !Number.isFinite(height)
  ) {
    throw new Error("crop x, y, width, and height must be finite numbers")
  }

  if (x < 0 || y < 0) {
    throw new Error("crop x and y must be greater than or equal to 0")
  }

  if (width <= 0 || height <= 0) {
    throw new Error("crop width and height must be greater than 0")
  }

  return { kind: "crop", input, x, y, width, height }
}

export function scale(input: ClipGraph, options: ScaleOptions): ClipGraph {
  const { width, height } = options

  if (width === undefined && height === undefined) {
    throw new Error("scale requires width, height, or both")
  }

  if (width !== undefined && (!Number.isInteger(width) || width <= 0)) {
    throw new Error("scale width must be a positive integer")
  }

  if (height !== undefined && (!Number.isInteger(height) || height <= 0)) {
    throw new Error("scale height must be a positive integer")
  }

  return { kind: "scale", input, width, height }
}
