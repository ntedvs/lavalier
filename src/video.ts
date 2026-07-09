import { ffmpeg } from "./ffmpeg.js"
import {
  concat as concatGraph,
  crop as cropGraph,
  fps as fpsGraph,
  scale as scaleGraph,
  source,
  trim as trimGraph,
  volume as volumeGraph,
  type ClipGraph,
  type ScaleOptions,
  type TrimOptions,
} from "./graph.js"
import { plan } from "./planner.js"

class Video {
  readonly #graph: ClipGraph

  private constructor(graph: ClipGraph) {
    this.#graph = graph
  }

  static create(input: string): Video {
    return new Video(source(input))
  }

  trim(options: TrimOptions): Video {
    return new Video(trimGraph(this.#graph, options))
  }

  volume(level: number): Video {
    return new Video(volumeGraph(this.#graph, level))
  }

  fps(rate: number): Video {
    return new Video(fpsGraph(this.#graph, rate))
  }

  crop(options: {
    readonly x: number
    readonly y: number
    readonly width: number
    readonly height: number
  }): Video {
    return new Video(cropGraph(this.#graph, options))
  }

  scale(options: ScaleOptions): Video {
    return new Video(scaleGraph(this.#graph, options))
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
