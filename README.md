# Lavalier

A video editing toolkit for TypeScript.

## Usage

```ts
import { video } from "lavalier"

await video("input.mp4")
  .trim({ start: 2, end: 8 })
  .scale({ width: 1280 })
  .fps(30)
  .rotate(90)
  .volume(0.8)
  .export("output.mp4")
```

Lavalier requires `ffmpeg` to be installed and available on your PATH.

## API

### `video(input)`

Create an editable video from an input path.

```ts
const clip = video("input.mp4")
```

### `trim(options)`

Trim by seconds. Provide `start`, `end`, or both.

```ts
video("input.mp4").trim({ end: 5 })
video("input.mp4").trim({ start: 10 })
video("input.mp4").trim({ start: 2, end: 8 })
```

If `start` is omitted, it defaults to `0`. If `end` is omitted, the clip runs to the end.

### `volume(level)`

Adjust audio volume. `1` keeps the original volume, `0.5` halves it, `2` doubles it, and `0` makes it silent.

```ts
video("input.mp4").volume(0)
```

### `fps(rate)`

Set the output frame rate.

```ts
video("input.mp4").fps(30)
```

### `rotate(degrees)`

Rotate the video frame. Degrees must be `90`, `180`, or `270`.

```ts
video("input.mp4").rotate(90)
```

### `flip(direction)`

Flip the video frame horizontally or vertically.

```ts
video("input.mp4").flip("horizontal")
video("input.mp4").flip("vertical")
```

### `speed(factor)`

Change playback speed. `2` is twice as fast, and `0.5` is half speed.

```ts
video("input.mp4").speed(2)
```

### `crop(options)`

Crop the video frame.

```ts
video("input.mp4").crop({ x: 10, y: 20, width: 640, height: 360 })
```

### `scale(options)`

Resize the video frame. Provide both dimensions for an exact resize, or one dimension to preserve aspect ratio.

```ts
video("input.mp4").scale({ width: 1280, height: 720 })
video("input.mp4").scale({ width: 1280 })
video("input.mp4").scale({ height: 720 })
```

### `concat(...videos)`

Append videos in order.

```ts
await video("intro.mp4").concat(video("main.mp4"), video("outro.mp4")).export("output.mp4")
```

### `export(output)`

Render the video to an output path.

```ts
await video("input.mp4").export("output.mp4")
```
