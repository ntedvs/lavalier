import { video } from "./src"

video("input.mp4").fps(3).trim({ start: 0 }).export("x")
