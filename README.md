# lavalier

simple video editing in typescript.

## install

```bash
npm install lavalier
```

**important:** you need [ffmpeg](https://ffmpeg.org/) installed on your system. lavalier is just a nice wrapper around it.

## usage

```typescript
import { video } from "lavalier"

await video("input.mp4")
  .trim(5, 10) // keep seconds 5-10
  .resize(0.5) // scale to 50%
  .text("hello world", {
    position: "center",
    size: 32,
  })
  .export("output.mp4")
```

that's it. chain operations, then export.

## api

### `video(input: string)`

creates a new video editor instance.

### `.trim(start: number, end: number)`

trim video to a time range (in seconds). keeps audio in sync.

### `.resize(scale: number)`

scale video dimensions. `0.5` = half size, `2` = double size.

### `.text(content: string, options?)`

overlay text on the video.

**options:**

- `position`: `{ x: number, y: number }` or `"center"` (optional)
- `size`: font size in pixels (optional)
- `font`: font name (optional)

### `.export(output: string)`

render the video with all operations applied. returns a promise.

## requirements

- node.js 18+
- ffmpeg installed and available in your PATH

## license

MIT
