import { Labels } from "../labels"
import { crop, Crop } from "./crop"
import { resize, Resize } from "./resize"
import { speed, Speed } from "./speed"
import { text, Text } from "./text"
import { trim, Trim } from "./trim"
import { volume, Volume } from "./volume"

export type Operation = Trim | Resize | Crop | Speed | Volume | Text
export type Context = { filters: string[]; labels: Labels }

export function compile(operation: Operation, context: Context) {
  switch (operation.type) {
    case "trim":
      return trim(operation, context)
    case "resize":
      return resize(operation, context)
    case "crop":
      return crop(operation, context)
    case "speed":
      return speed(operation, context)
    case "volume":
      return volume(operation, context)
    case "text":
      return text(operation, context)
  }
}
