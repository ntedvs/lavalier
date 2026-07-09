import { expect, test } from "bun:test"
import { concat, crop, flip, fps, rotate, scale, source, speed, trim, volume } from "./graph.js"
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

test("plans a trim with default start", () => {
  expect(plan(trim(source("input.mp4"), { end: 3 }), "out.mp4")).toEqual([
    "-i",
    "input.mp4",
    "-filter_complex",
    "[0:v:0]trim=start=0:end=3,setpts=PTS-STARTPTS[v0];[0:a:0]atrim=start=0:end=3,asetpts=PTS-STARTPTS[a0]",
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

test("plans a trim to the end", () => {
  expect(plan(trim(source("input.mp4"), { start: 3 }), "out.mp4")).toEqual([
    "-i",
    "input.mp4",
    "-filter_complex",
    "[0:v:0]trim=start=3,setpts=PTS-STARTPTS[v0];[0:a:0]atrim=start=3,asetpts=PTS-STARTPTS[a0]",
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

test("plans volume through the volume filter", () => {
  expect(plan(volume(source("input.mp4"), 0), "out.mp4")).toEqual([
    "-i",
    "input.mp4",
    "-filter_complex",
    "[0:v:0]null[v0];[0:a:0]volume=0[a0]",
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

test("plans fps through the fps filter", () => {
  expect(plan(fps(source("input.mp4"), 30), "out.mp4")).toEqual([
    "-i",
    "input.mp4",
    "-filter_complex",
    "[0:v:0]fps=30[v0];[0:a:0]anull[a0]",
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

test("plans rotate through transpose filters", () => {
  expect(plan(rotate(source("input.mp4"), 180), "out.mp4")).toEqual([
    "-i",
    "input.mp4",
    "-filter_complex",
    "[0:v:0]transpose=1,transpose=1[v0];[0:a:0]anull[a0]",
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

test("plans horizontal flip through hflip", () => {
  expect(plan(flip(source("input.mp4"), "horizontal"), "out.mp4")).toEqual([
    "-i",
    "input.mp4",
    "-filter_complex",
    "[0:v:0]hflip[v0];[0:a:0]anull[a0]",
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

test("plans vertical flip through vflip", () => {
  expect(plan(flip(source("input.mp4"), "vertical"), "out.mp4")).toEqual([
    "-i",
    "input.mp4",
    "-filter_complex",
    "[0:v:0]vflip[v0];[0:a:0]anull[a0]",
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

test("plans speed through setpts and atempo", () => {
  expect(plan(speed(source("input.mp4"), 2), "out.mp4")).toEqual([
    "-i",
    "input.mp4",
    "-filter_complex",
    "[0:v:0]setpts=PTS/2[v0];[0:a:0]atempo=2[a0]",
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

test("plans speed with chained atempo filters", () => {
  expect(plan(speed(source("input.mp4"), 4), "out.mp4")).toEqual([
    "-i",
    "input.mp4",
    "-filter_complex",
    "[0:v:0]setpts=PTS/4[v0];[0:a:0]atempo=2,atempo=2[a0]",
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

test("plans crop through the crop filter", () => {
  expect(
    plan(crop(source("input.mp4"), { x: 10, y: 20, width: 640, height: 360 }), "out.mp4"),
  ).toEqual([
    "-i",
    "input.mp4",
    "-filter_complex",
    "[0:v:0]crop=w=640:h=360:x=10:y=20[v0];[0:a:0]anull[a0]",
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

test("plans scale with exact dimensions", () => {
  expect(plan(scale(source("input.mp4"), { width: 1280, height: 720 }), "out.mp4")).toEqual([
    "-i",
    "input.mp4",
    "-filter_complex",
    "[0:v:0]scale=w=1280:h=720[v0];[0:a:0]anull[a0]",
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

test("plans scale with width and preserved aspect ratio", () => {
  expect(plan(scale(source("input.mp4"), { width: 1280 }), "out.mp4")).toEqual([
    "-i",
    "input.mp4",
    "-filter_complex",
    "[0:v:0]scale=w=1280:h=-2[v0];[0:a:0]anull[a0]",
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

test("plans scale with height and preserved aspect ratio", () => {
  expect(plan(scale(source("input.mp4"), { height: 720 }), "out.mp4")).toEqual([
    "-i",
    "input.mp4",
    "-filter_complex",
    "[0:v:0]scale=w=-2:h=720[v0];[0:a:0]anull[a0]",
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
