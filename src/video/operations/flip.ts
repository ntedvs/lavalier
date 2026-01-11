export type Flip = {
  type: "flip"
  direction: "horizontal" | "vertical"
}

export function flip({ direction }: Flip) {
  return { video: direction === "horizontal" ? "hflip" : "vflip" }
}
