# Lavalier

Simple video editing in TypeScript.

## Install

```bash
npm install lavalier
```

**Important:** You need [FFmpeg](https://ffmpeg.org/) installed on your system. Lavalier is just a nice wrapper around it.

## Usage

```typescript
import { video } from "lavalier"

const clip = video("input.mp4")
  .trim(5, 10) // keep seconds 5-10
  .resize(0.5) // scale to 50%
  .text("hello world", {
    position: "center",
    size: 32,
    color: "0xFF0000", // red text
    start: 1, // appear at 1 second
    end: 8, // disappear at 8 seconds
  })

await clip.export("output.mp4")
```

That's it. Chain operations, then export.

## API

### `video(input: string)`

Creates a new video editor instance.

### `.trim(start: number, end: number)`

Trim video to a time range (in seconds). Keeps audio in sync.

### `.resize(scale: number)`

Scale video dimensions. `0.5` = half size, `2` = double size.

### `.crop(options)`

Crop video to a specific region.

**Options:**

- `width`: Width of cropped area in pixels (required)
- `height`: Height of cropped area in pixels (required)
- `x`: X position of crop area (optional, defaults to center)
- `y`: Y position of crop area (optional, defaults to center)

**Examples:**

```typescript
// Center crop to 1920x1080
.crop({ width: 1920, height: 1080 })

// Crop from top-left corner
.crop({ width: 640, height: 480, x: 0, y: 0 })

// Custom position
.crop({ width: 800, height: 600, x: 100, y: 50 })
```

### `.text(content: string, options?)`

Overlay text on the video.

**Options:**

- `position`: `{ x: number, y: number }` or `"center"` (optional)
- `size`: Font size in pixels (optional)
- `font`: Font name (optional)
- `color`: Color in hexadecimal format, e.g., `"0xFF0000"` for red (optional)
- `start`: Time in seconds when text should appear (optional)
- `end`: Time in seconds when text should disappear (optional)

### `.speed(factor: number)`

Change playback speed. `2` = double speed, `0.5` = half speed (slow motion). Keeps audio in sync.

```typescript
.speed(2)   // 2x faster
.speed(0.5) // slow motion
```

### `.export(output: string)`

Render the video with all operations applied. Returns a promise.

## Requirements

- Node.js 18+
- FFmpeg installed and available in your PATH

## License

MIT
