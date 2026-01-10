export class Labels {
  private counter = 0
  audio = "0:a"

  allocate() {
    const audio = `a${this.counter}`
    this.counter++

    return audio
  }
}
