import type { ClipGraph } from "./graph.js"

type StreamPair = {
  readonly video: string
  readonly audio: string
}

type PlanContext = {
  inputIndex: number
  filterIndex: number
  inputs: string[]
  filters: string[]
}

export function plan(graph: ClipGraph, output: string): readonly string[] {
  if (output.length === 0) {
    throw new Error("export output path must not be empty")
  }

  const context: PlanContext = {
    inputIndex: 0,
    filterIndex: 0,
    inputs: [],
    filters: [],
  }

  const streams = planNode(graph, context)
  const inputArgs = context.inputs.flatMap((input) => ["-i", input])

  if (context.filters.length === 0) {
    return [...inputArgs, "-map", streams.video, "-map", streams.audio, "-c", "copy", output]
  }

  return [
    ...inputArgs,
    "-filter_complex",
    context.filters.join(";"),
    "-map",
    bracket(streams.video),
    "-map",
    bracket(streams.audio),
    "-c:v",
    "libx264",
    "-c:a",
    "aac",
    output,
  ]
}

function planNode(graph: ClipGraph, context: PlanContext): StreamPair {
  switch (graph.kind) {
    case "source": {
      const index = context.inputIndex
      context.inputIndex += 1
      context.inputs.push(graph.path)

      return {
        video: `${index}:v:0`,
        audio: `${index}:a:0`,
      }
    }

    case "trim": {
      const input = planNode(graph.input, context)
      const output = labels(context)
      const end = graph.end === undefined ? "" : `:end=${graph.end}`

      context.filters.push(
        `${bracket(input.video)}trim=start=${graph.start}${end},setpts=PTS-STARTPTS${bracket(output.video)}`,
        `${bracket(input.audio)}atrim=start=${graph.start}${end},asetpts=PTS-STARTPTS${bracket(output.audio)}`,
      )

      return output
    }

    case "volume": {
      const input = planNode(graph.input, context)
      const output = labels(context)

      context.filters.push(
        `${bracket(input.video)}null${bracket(output.video)}`,
        `${bracket(input.audio)}volume=${graph.level}${bracket(output.audio)}`,
      )

      return output
    }

    case "fps": {
      const input = planNode(graph.input, context)
      const output = labels(context)

      context.filters.push(
        `${bracket(input.video)}fps=${graph.rate}${bracket(output.video)}`,
        `${bracket(input.audio)}anull${bracket(output.audio)}`,
      )

      return output
    }

    case "crop": {
      const input = planNode(graph.input, context)
      const output = labels(context)

      context.filters.push(
        `${bracket(input.video)}crop=w=${graph.width}:h=${graph.height}:x=${graph.x}:y=${graph.y}${bracket(output.video)}`,
        `${bracket(input.audio)}anull${bracket(output.audio)}`,
      )

      return output
    }

    case "scale": {
      const input = planNode(graph.input, context)
      const output = labels(context)
      const width = graph.width ?? -2
      const height = graph.height ?? -2

      context.filters.push(
        `${bracket(input.video)}scale=w=${width}:h=${height}${bracket(output.video)}`,
        `${bracket(input.audio)}anull${bracket(output.audio)}`,
      )

      return output
    }

    case "concat": {
      const inputs = graph.inputs.map((input) => planNode(input, context))
      const output = labels(context)
      const streams = inputs
        .flatMap((input) => [bracket(input.video), bracket(input.audio)])
        .join("")

      context.filters.push(
        `${streams}concat=n=${inputs.length}:v=1:a=1${bracket(output.video)}${bracket(output.audio)}`,
      )

      return output
    }
  }
}

function labels(context: PlanContext): StreamPair {
  const value = context.filterIndex
  context.filterIndex += 1

  return {
    video: `v${value}`,
    audio: `a${value}`,
  }
}

function bracket(stream: string): string {
  return `[${stream}]`
}
