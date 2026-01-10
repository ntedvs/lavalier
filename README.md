# Lavalier

A fluent, chainable API for programmatic video and audio editing using FFmpeg.

Lavalier wraps FFmpeg's filter_complex system in an intuitive, immutable interface. Chain operations together and export—Lavalier handles the FFmpeg command construction.

## Installation

```bash
npm install lavalier
```

**Prerequisites:** FFmpeg must be installed and available in your PATH.

```bash
# macOS
brew install ffmpeg

# Ubuntu/Debian
sudo apt install ffmpeg

# Windows (chocolatey)
choco install ffmpeg
```

## Quick Start

```typescript
import { video, audio } from "lavalier"

// Trim a video, speed it up, and add a watermark
await video("input.mp4")
  .trim(5, 15)
  .speed(1.5)
  .text("© 2024", { position: { x: 10, y: 10 }, color: "white" })
  .export("output.mp4")

// Extract and process audio
await audio("podcast.mp3").trim(0, 60).volume(1.2).export("intro.mp3")
```

## Video API

```typescript
import { video } from "lavalier"
```

### trim(start, end)

Extract a segment from the video.

```typescript
// Extract from 10s to 30s
video("input.mp4").trim(10, 30)

// Get the first 5 seconds
video("input.mp4").trim(0, 5)
```

| Parameter | Type     | Description           |
| --------- | -------- | --------------------- |
| `start`   | `number` | Start time in seconds |
| `end`     | `number` | End time in seconds   |

### resize(scale)

Scale the video dimensions.

```typescript
// Half size (50%)
video("input.mp4").resize(0.5)

// Double size (200%)
video("input.mp4").resize(2)

// Quarter size (25%)
video("input.mp4").resize(0.25)
```

| Parameter | Type     | Description                           |
| --------- | -------- | ------------------------------------- |
| `scale`   | `number` | Scale factor (0.5 = half, 2 = double) |

### crop(width, height, options?)

Crop the video to specified dimensions.

```typescript
// Crop to 1280x720 from top-left corner
video("input.mp4").crop(1280, 720)

// Crop to 500x500 at specific position
video("input.mp4").crop(500, 500, { x: 100, y: 50 })
```

| Parameter   | Type     | Description                        |
| ----------- | -------- | ---------------------------------- |
| `width`     | `number` | Target width in pixels             |
| `height`    | `number` | Target height in pixels            |
| `options.x` | `number` | (Optional) X offset from left edge |
| `options.y` | `number` | (Optional) Y offset from top edge  |

### speed(factor)

Adjust playback speed. Affects both video and audio.

```typescript
// 2x speed (video plays in half the time)
video("input.mp4").speed(2)

// Slow motion (0.5x)
video("input.mp4").speed(0.5)

// 1.5x speed
video("input.mp4").speed(1.5)
```

| Parameter | Type     | Description                                            |
| --------- | -------- | ------------------------------------------------------ |
| `factor`  | `number` | Speed multiplier (2 = twice as fast, 0.5 = half speed) |

### volume(factor)

Adjust audio volume level.

```typescript
// Reduce to 50% volume
video("input.mp4").volume(0.5)

// Boost to 150% volume
video("input.mp4").volume(1.5)

// Mute audio
video("input.mp4").volume(0)
```

| Parameter | Type     | Description                                            |
| --------- | -------- | ------------------------------------------------------ |
| `factor`  | `number` | Volume multiplier (0 = mute, 1 = original, 2 = double) |

### flip(direction)

Flip the video horizontally or vertically.

```typescript
// Mirror horizontally
video("input.mp4").flip("horizontal")

// Flip upside down
video("input.mp4").flip("vertical")
```

| Parameter   | Type                         | Description    |
| ----------- | ---------------------------- | -------------- |
| `direction` | `"horizontal" \| "vertical"` | Flip direction |

### text(content, options?)

Overlay text on the video.

```typescript
// Simple text in default position
video("input.mp4").text("Hello World")

// Centered text with styling
video("input.mp4").text("Subscribe!", {
  position: "center",
  size: 48,
  color: "yellow",
  font: "Arial",
})

// Positioned text with timing
video("input.mp4").text("Intro", {
  position: { x: 50, y: 50 },
  size: 32,
  color: "white",
  start: 0,
  end: 5,
})
```

| Parameter          | Type                                   | Description                            |
| ------------------ | -------------------------------------- | -------------------------------------- |
| `content`          | `string`                               | Text to display                        |
| `options.position` | `{ x: number, y: number } \| "center"` | (Optional) Text position               |
| `options.size`     | `number`                               | (Optional) Font size in pixels         |
| `options.font`     | `string`                               | (Optional) Font family name            |
| `options.color`    | `string`                               | (Optional) Text color                  |
| `options.start`    | `number`                               | (Optional) When to show text (seconds) |
| `options.end`      | `number`                               | (Optional) When to hide text (seconds) |

### export(output)

Render the video with all applied operations.

```typescript
await video("input.mp4").trim(0, 10).resize(0.5).export("output.mp4")
```

| Parameter | Type     | Description      |
| --------- | -------- | ---------------- |
| `output`  | `string` | Output file path |

**Returns:** `Promise<void>` - Resolves when export completes, rejects on error.

## Audio API

```typescript
import { audio } from "lavalier"
```

### trim(start, end)

Extract a segment from the audio.

```typescript
// Extract from 0s to 60s
audio("podcast.mp3").trim(0, 60)
```

| Parameter | Type     | Description           |
| --------- | -------- | --------------------- |
| `start`   | `number` | Start time in seconds |
| `end`     | `number` | End time in seconds   |

### speed(factor)

Adjust playback speed.

```typescript
// Speed up to 1.25x
audio("audiobook.mp3").speed(1.25)

// Slow down to 0.75x
audio("lecture.mp3").speed(0.75)
```

| Parameter | Type     | Description      |
| --------- | -------- | ---------------- |
| `factor`  | `number` | Speed multiplier |

### volume(factor)

Adjust volume level.

```typescript
// Normalize quiet audio
audio("quiet.mp3").volume(2)

// Reduce loud audio
audio("loud.mp3").volume(0.5)
```

| Parameter | Type     | Description       |
| --------- | -------- | ----------------- |
| `factor`  | `number` | Volume multiplier |

### export(output)

Render the audio with all applied operations.

```typescript
await audio("input.mp3").trim(0, 30).volume(1.2).export("output.mp3")
```

| Parameter | Type     | Description      |
| --------- | -------- | ---------------- |
| `output`  | `string` | Output file path |

**Returns:** `Promise<void>` - Resolves when export completes, rejects on error.

## Chaining Operations

Operations can be chained in any order. Each method returns a new immutable instance.

```typescript
// Complex video processing pipeline
await video("raw-footage.mp4")
  .trim(30, 90) // Extract 1 minute starting at 30s
  .crop(1920, 1080) // Crop to 1080p
  .resize(0.5) // Scale down to 960x540
  .speed(1.25) // Speed up slightly
  .volume(0.8) // Reduce audio slightly
  .flip("horizontal") // Mirror the video
  .text("PREVIEW", {
    // Add watermark
    position: "center",
    size: 72,
    color: "red",
  })
  .export("preview.mp4")
```

Since each operation returns a new instance, you can create branches:

```typescript
const base = video("input.mp4").trim(0, 10)

// Create multiple outputs from the same base
await base.resize(0.5).export("small.mp4")
await base.resize(2).export("large.mp4")
```

## Requirements

- Node.js 18+
- FFmpeg installed and available in PATH

## License

MIT
