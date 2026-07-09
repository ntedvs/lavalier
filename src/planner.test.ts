import { expect, test } from "bun:test"
import { concat, source, trim } from "./graph.js"
import { plan } from "./planner.js"

test("plans a trim through filter_complex", () => {
  expect(plan(trim(source("input.mp4"), { start: 1, end: 3 }), "out.mp4")).toEqual([
    "-i",
    "input.mp4",
    "-filter_complex",
    "[0:v:0]trim=start=1:end=3,setpts=PTS-STARTPTS[v0];[0:a:0]atrim=start=1:end=3,asetpts=PTS-STARTPTS[a0]",
    "-map",
    "[v0]",
    "-map",
    "[a0]",
    "-c:v",
    "libx264",
    "-c:a",
    "aac",
    "out.mp4",
  ])
})

test("plans a concat through the concat filter", () => {
  expect(plan(concat([source("a.mp4"), source("b.mp4")]), "out.mp4")).toEqual([
    "-i",
    "a.mp4",
    "-i",
    "b.mp4",
    "-filter_complex",
    "[0:v:0][0:a:0][1:v:0][1:a:0]concat=n=2:v=1:a=1[v0][a0]",
    "-map",
    "[v0]",
    "-map",
    "[a0]",
    "-c:v",
    "libx264",
    "-c:a",
    "aac",
    "out.mp4",
  ])
})
