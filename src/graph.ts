export type ClipGraph =
  | { readonly kind: "source"; readonly path: string }
  | {
      readonly kind: "trim"
      readonly input: ClipGraph
      readonly start: number
      readonly end: number
    }
  | { readonly kind: "concat"; readonly inputs: readonly ClipGraph[] }

export function source(path: string): ClipGraph {
  if (path.length === 0) {
    throw new Error("video input path must not be empty")
  }

  return { kind: "source", path }
}

export function trim(
  input: ClipGraph,
  options: { readonly start: number; readonly end: number },
): ClipGraph {
  const { start, end } = options

  if (!Number.isFinite(start) || !Number.isFinite(end)) {
    throw new Error("trim start and end must be finite numbers")
  }

  if (start < 0) {
    throw new Error("trim start must be greater than or equal to 0")
  }

  if (end <= start) {
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
