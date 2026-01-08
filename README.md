# Lavalier

A fluent, chainable API for programmatic video editing using FFmpeg.

Lavalier provides a chainable API for video operations without dealing with FFmpeg command-line syntax. Chain operations together, call `.export()`, and it generates the filter graph for you.

## Installation

```bash
npm install lavalier
```

Requires FFmpeg:

```bash
# macOS
brew install ffmpeg

# Ubuntu/Debian
apt-get install ffmpeg

# Windows (chocolatey)
choco install ffmpeg
```

## Quick Start

```typescript
import { video } from "lavalier"

// Edit a video with a fluent API
await video("input.mp4")
  .trim(0, 10) // First 10 seconds
  .resize(0.5) // Half size
  .text("Hello World", {
    // Add text overlay
    position: "center",
    size: 48,
  })
  .export("output.mp4")
```

## API

### `video(inputPath: string)`

Creates a new video editing pipeline. Returns a `Video` instance with chainable methods.

### `.trim(start: number, end: number)`

Trim the video to a specific time range in seconds.

```typescript
video("input.mp4")
  .trim(5, 15) // Keep seconds 5-15
  .export("trimmed.mp4")
```

### `.resize(scale: number)`

Scale the video. `1.0` = original size, `0.5` = half size, `2.0` = double size.

```typescript
video("input.mp4")
  .resize(0.5) // 50% of original dimensions
  .export("smaller.mp4")
```

Aspect ratio is preserved automatically.

### `.crop(width: number, height: number, options?: { x?: number, y?: number })`

Crop the video to specific dimensions. Defaults to center crop if `x` and `y` aren't specified.

```typescript
// Center crop to 1920x1080
video("input.mp4").crop(1920, 1080).export("cropped.mp4")

// Crop from specific position
video("input.mp4").crop(1280, 720, { x: 100, y: 50 }).export("cropped.mp4")
```

### `.speed(factor: number)`

Adjust playback speed. `1.0` = normal, `0.5` = half speed (slow motion), `2.0` = double speed.

```typescript
video("input.mp4")
  .speed(2.0) // 2x speed
  .export("fast.mp4")
```

Adjusts both video and audio. Audio tempo is automatically chained for extreme speeds.

### `.volume(factor: number)`

Adjust audio volume. `1.0` = original, `0.5` = half volume, `2.0` = double volume.

```typescript
video("input.mp4")
  .volume(0.5) // Quieter
  .export("quiet.mp4")
```

### `.text(content: string, options?: TextOptions)`

Add text overlay to the video.

**Options:**

- `position: { x: number, y: number } | 'center'` - Where to place the text
- `size: number` - Font size in pixels
- `font: string` - Font name (must be available on your system)
- `color: string` - Text color (FFmpeg color format, e.g., 'white', 'black', '#FF0000')
- `start: number` - When to show text (seconds)
- `end: number` - When to hide text (seconds)

```typescript
// Centered text, whole video
video("input.mp4")
  .text("Hello World", {
    position: "center",
    size: 48,
    color: "white",
  })
  .export("with-text.mp4")

// Text at specific position and time range
video("input.mp4")
  .text("Chapter 1", {
    position: { x: 50, y: 50 },
    size: 36,
    font: "Arial",
    color: "yellow",
    start: 0,
    end: 5,
  })
  .export("with-timed-text.mp4")
```

### `.export(outputPath: string)`

Renders the video to a file. Returns a Promise that resolves when encoding completes.

## More Examples

### Create a highlight reel

```typescript
// Trim, speed up, add branding
await video("gameplay.mp4")
  .trim(120, 180) // Best 60 seconds
  .speed(1.5) // Slightly faster
  .text("EPIC MOMENT", {
    position: { x: 50, y: 50 },
    size: 72,
    color: "red",
    start: 0,
    end: 3,
  })
  .export("highlight.mp4")
```

### Make a social media clip

```typescript
// Square crop for Instagram, with caption
await video("full-video.mp4")
  .trim(10, 25) // 15-second clip
  .crop(1080, 1080) // Square crop
  .text("@yourhandle", {
    position: { x: 20, y: 1040 },
    size: 32,
    color: "white",
  })
  .export("instagram.mp4")
```

### Batch process multiple videos

```typescript
const files = ["video1.mp4", "video2.mp4", "video3.mp4"]

for (const file of files) {
  await video(file).resize(0.5).volume(0.8).export(`processed-${file}`)
}
```

### Chain everything together

```typescript
await video("raw-footage.mp4")
  .trim(30, 90) // 1 minute
  .crop(1920, 1080) // Standard HD
  .resize(0.75) // Smaller file
  .speed(1.25) // Slightly faster
  .volume(1.5) // Louder
  .text("Tutorial", {
    position: "center",
    size: 64,
    color: "white",
    start: 0,
    end: 3,
  })
  .export("final.mp4")
```

## How it works

Each operation adds to an FFmpeg filter graph. When you call `.export()`, Lavalier compiles the chain into a `-filter_complex` argument and spawns FFmpeg. Video/audio streams are tracked through labels so operations can be chained in any order.

## Requirements

- Node.js 18 or higher
- FFmpeg installed and available in your PATH
- TypeScript 5+ (if using TypeScript)

## License

MIT

## Contributing

Issues and PRs welcome.
