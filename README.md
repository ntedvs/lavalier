# Lavalier

A fluent, chainable API for programmatic video and audio editing using FFmpeg.

## Installation

```bash
bun add lavalier
```

## Requirements

[FFmpeg](https://ffmpeg.org/) must be installed and available in PATH.

## Usage

```typescript
import { video, audio } from "lavalier"

await video("input.mp4")
  .trim({ start: 5, end: 15 })
  .speed(2)
  .flip("horizontal")
  .text("Hello World", { position: "center", size: 48 })
  .export("output.mp4")

await audio("input.mp3")
  .trim({ start: 10, end: 30 })
  .speed(1.5)
  .volume(0.8)
  .export("output.mp3")
```

## API

### `video(input: string)`

Create a new video instance from an input file path.

### `audio(input: string)`

Create a new audio instance from an input file path. Supports `.trim()`, `.speed()`, `.volume()`, `.concat()`, and `.export()`.

### `.crop(options)`

Crop video dimensions.

```typescript
// Crop width only
.crop({ width: 1920 })

// Crop height only
.crop({ height: 1080 })

// Crop both with position
.crop({ width: 1920, height: 1080, x: 100, y: 50 })
```

### `.flip(direction)`

Flip video horizontally or vertically.

```typescript
.flip("horizontal")
.flip("vertical")
```

### `.scale(factor)`

Scale video by a factor.

```typescript
.scale(0.5)  // 50% size
.scale(2)    // 200% size
```

### `.speed(factor)`

Change playback speed. For video, affects both video and audio streams.

```typescript
.speed(2)    // 2x faster
.speed(0.5)  // 2x slower
```

### `.text(content, options?)`

Overlay text on video.

```typescript
.text("Hello World")

.text("Hello World", {
  position: "center",           // or { x: 100, y: 50 }
  size: 48,
  font: "Arial",
  color: "white",
  start: 2,                     // seconds
  end: 10
})
```

### `.trim(options)`

Trim duration.

```typescript
.trim({ start: 5, end: 15 })  // seconds
.trim({ start: 5 })            // from 5s to end
.trim({ end: 10 })             // from start to 10s
```

### `.volume(level)`

Adjust audio volume.

```typescript
.volume(0.5)  // 50% volume
.volume(2)    // 200% volume
```

### `.concat(video|audio)`

Concatenate another video or audio instance.

```typescript
const intro = video("intro.mp4")
const main = video("main.mp4")
await main.concat(intro).export("output.mp4")

const a1 = audio("a.mp3")
const a2 = audio("b.mp3")
await a1.concat(a2).export("combined.mp3")
```

### `.export(output: string)`

Execute the operation chain and export to output file. Returns a Promise.

## License

MIT
