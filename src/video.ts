import { ffmpeg } from "./ffmpeg.js"
import { concat as concatGraph, source, trim as trimGraph, type ClipGraph } from "./graph.js"
import { plan } from "./planner.js"

class Video {
  readonly #graph: ClipGraph

  private constructor(graph: ClipGraph) {
    this.#graph = graph
  }

  static create(input: string): Video {
    return new Video(source(input))
  }

  trim(options: { readonly start: number; readonly end: number }): Video {
    return new Video(trimGraph(this.#graph, options))
  }

  concat(...videos: readonly Video[]): Video {
    return new Video(concatGraph([this.#graph, ...videos.map((video) => video.#graph)]))
  }

  async export(output: string): Promise<void> {
    await ffmpeg(plan(this.#graph, output))
  }
}

export function video(input: string): Video {
  return Video.create(input)
}
