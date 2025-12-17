# Lavalier

A lightweight TypeScript library for programmatic video editing using FFmpeg.

## Features

- Simple, chainable API for video manipulation
- Trim videos to specific time ranges
- Resize videos with custom scaling
- Zero runtime dependencies
- Built on top of FFmpeg for reliable video processing

## Prerequisites

Lavalier requires [FFmpeg](https://ffmpeg.org/) to be installed on your system and available in your PATH.

### Installing FFmpeg

**macOS:**

```bash
brew install ffmpeg
```

**Ubuntu/Debian:**

```bash
sudo apt install ffmpeg
```

**Windows:**
Download from [ffmpeg.org](https://ffmpeg.org/download.html) or use:

```bash
choco install ffmpeg
```

## Installation

```bash
npm install lavalier
# or
bun add lavalier
# or
yarn add lavalier
```

## Usage

### Basic Example

```typescript
import { video } from "lavalier"

// Trim a video and resize it
await video("input.mp4")
  .trim(5, 30) // Extract seconds 5-30
  .resize(0.5) // Scale to 50% size
  .export("output.mp4")
```

### Trim Only

```typescript
import { video } from "lavalier"

// Extract a 10-second clip starting at 1 minute
await video("input.mp4").trim(60, 70).export("clip.mp4")
```

### Resize Only

```typescript
import { video } from "lavalier"

// Create a half-size version of the video
await video("input.mp4").resize(0.5).export("small.mp4")

// Double the video size
await video("input.mp4").resize(2.0).export("large.mp4")
```

### Chaining Multiple Operations

```typescript
import { video } from "lavalier"

// Operations are applied in order
await video("input.mp4")
  .trim(10, 60) // First, extract 10-60 seconds
  .resize(0.75) // Then, scale to 75% size
  .export("output.mp4")
```

## API

### `video(inputPath: string): Video`

Creates a new Video instance from an input file path.

**Parameters:**

- `inputPath` - Path to the input video file

**Returns:** A `Video` instance for chaining operations

### `Video.trim(start: number, end: number): Video`

Trims the video to a specific time range.

**Parameters:**

- `start` - Start time in seconds
- `end` - End time in seconds

**Returns:** A new `Video` instance with the trim operation added

### `Video.resize(scale: number): Video`

Resizes the video by a scaling factor.

**Parameters:**

- `scale` - Scaling multiplier (e.g., `0.5` for half size, `2.0` for double size)

**Returns:** A new `Video` instance with the resize operation added

### `Video.export(outputPath: string): Promise<void>`

Exports the video with all applied operations to an output file.

**Parameters:**

- `outputPath` - Path where the output video will be saved

**Returns:** A Promise that resolves when the export is complete

## How It Works

Lavalier uses a builder pattern to chain video operations together. When you call `export()`, it:

1. Compiles all operations into FFmpeg's `filter_complex` syntax
2. Spawns an FFmpeg process with the appropriate arguments
3. Processes the video according to your specifications
4. Saves the result to the output path

All video processing is handled by FFmpeg, ensuring reliable and high-quality results.

## License

MIT License - Copyright 2025 Nathaniel Davis

See [LICENSE](LICENSE) for details.
