export class Labels {
  private counter = 0
  video = "0:v"
  audio = "0:a"

  allocate(streams: ("video" | "audio")[]) {
    const result: Record<string, string> = {}

    for (const stream of streams) {
      if (stream === "video") {
        result.video = `v${this.counter}`
      } else {
        result.audio = `a${this.counter}`
      }
    }

    this.counter++
    return result
  }
}
