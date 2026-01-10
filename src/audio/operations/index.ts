import { Labels } from "../labels"
import { speed, Speed } from "./speed"
import { trim, Trim } from "./trim"
import { volume, Volume } from "./volume"

export type Operation = Trim | Speed | Volume
export type Context = { filters: string[]; labels: Labels }

export function compile(operation: Operation, context: Context) {
  switch (operation.type) {
    case "trim":
      return trim(operation, context)
    case "speed":
      return speed(operation, context)
    case "volume":
      return volume(operation, context)
  }
}
