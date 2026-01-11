# Lavalier

Fluent, chainable API for video editing with FFmpeg.

```typescript
import { video } from "lavalier"

await video("input.mp4")
  .trim({ start: 5, end: 15 })
  .speed(1.5)
  .flip("horizontal")
  .text("Subscribe!", { position: "center", size: 64, color: "yellow" })
  .export("output.mp4")
```

## Installation

```bash
npm install lavalier
```

**Requirements:**

- Node.js 18+
- FFmpeg installed and available in PATH

## API

### `video(input)`

Creates a new video instance from an input file path. Returns a chainable `Video` object.

```typescript
const v = video("path/to/video.mp4")
```

### `.export(output)`

Renders the video with all applied operations. Returns a `Promise<void>` that resolves when encoding completes.

```typescript
await video("input.mp4").speed(2).export("output.mp4")
```

---

## Operations

All operations are chainable and return a new `Video` instance. Operations are applied in the order they are called.

### `.trim(options)`

Trims the video to a specific time range. Times are in seconds.

**Options:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `start` | `number` | Start time in seconds |
| `end` | `number` | End time in seconds |

At least one of `start` or `end` must be provided.

```typescript
// Keep first 10 seconds
video("input.mp4").trim({ end: 10 })

// Start at 5 seconds
video("input.mp4").trim({ start: 5 })

// Extract 5-15 second range
video("input.mp4").trim({ start: 5, end: 15 })
```

---

### `.speed(factor)`

Adjusts playback speed for both video and audio. Audio pitch is preserved.

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `factor` | `number` | Speed multiplier (e.g., `2` = 2x faster, `0.5` = half speed) |

```typescript
// Double speed
video("input.mp4").speed(2)

// Slow motion (half speed)
video("input.mp4").speed(0.5)

// Slight speedup
video("input.mp4").speed(1.25)
```

---

### `.volume(level)`

Adjusts audio volume level.

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `level` | `number` | Volume multiplier (e.g., `1` = unchanged, `0.5` = 50%, `2` = 200%) |

```typescript
// Reduce volume to 50%
video("input.mp4").volume(0.5)

// Double the volume
video("input.mp4").volume(2)

// Mute audio
video("input.mp4").volume(0)
```

---

### `.flip(direction)`

Flips the video horizontally or vertically.

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `direction` | `"horizontal" \| "vertical"` | Flip direction |

```typescript
// Mirror horizontally
video("input.mp4").flip("horizontal")

// Flip upside down
video("input.mp4").flip("vertical")
```

---

### `.crop(options)`

Crops the video to specified dimensions. Omitted dimensions default to the original size.

**Options:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `width` | `number` | Target width in pixels |
| `height` | `number` | Target height in pixels |
| `x` | `number` | Horizontal offset from left edge (default: `0`) |
| `y` | `number` | Vertical offset from top edge (default: `0`) |

At least one of `width` or `height` must be provided. If specifying both dimensions, `x` and `y` can optionally position the crop area.

```typescript
// Crop to 1280x720 from top-left
video("input.mp4").crop({ width: 1280, height: 720 })

// Crop width only, keep full height
video("input.mp4").crop({ width: 1000 })

// Crop with offset (extract center region)
video("input.mp4").crop({ width: 640, height: 480, x: 320, y: 240 })
```

---

### `.scale(factor)`

Scales the video dimensions by a factor.

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `factor` | `number` | Scale multiplier (e.g., `0.5` = half size, `2` = double size) |

```typescript
// Half the resolution
video("input.mp4").scale(0.5)

// Double the resolution
video("input.mp4").scale(2)
```

---

### `.text(content, options?)`

Adds a text overlay to the video.

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `content` | `string` | Text to display |
| `options` | `object` | Optional styling and positioning |

**Options:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `position` | `{ x?: number, y?: number } \| "center"` | Position in pixels or centered |
| `size` | `number` | Font size in pixels |
| `font` | `string` | Font family name |
| `color` | `string` | Font color (name or hex) |
| `start` | `number` | Show text starting at this time (seconds) |
| `end` | `number` | Hide text after this time (seconds) |

```typescript
// Centered white text
video("input.mp4").text("Hello World", {
  position: "center",
  size: 48,
  color: "white",
})

// Positioned text with custom font
video("input.mp4").text("Watermark", {
  position: { x: 20, y: 20 },
  size: 24,
  font: "Arial",
  color: "#ff0000",
})

// Text that appears from 5-10 seconds
video("input.mp4").text("Limited Time!", {
  position: "center",
  size: 36,
  start: 5,
  end: 10,
})

// Text that appears after 3 seconds
video("input.mp4").text("Subscribe", {
  position: { x: 100, y: 50 },
  start: 3,
})
```

---

## Chaining Operations

Operations can be chained in any order. Each operation returns a new immutable `Video` instance.

```typescript
await video("raw-footage.mp4")
  .trim({ start: 10, end: 60 }) // Extract 50 second clip
  .speed(1.5) // Speed up 1.5x
  .volume(0.8) // Reduce volume slightly
  .scale(0.5) // Half the resolution
  .crop({ width: 640, height: 640 }) // Square crop
  .flip("horizontal") // Mirror
  .text("My Video", {
    // Add title
    position: "center",
    size: 32,
    color: "white",
    end: 3,
  })
  .export("final.mp4")
```

## License

MIT
