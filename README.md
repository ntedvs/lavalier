# Lavalier

A video editing toolkit for TypeScript.

## Usage

```ts
import { video } from "lavalier"

await video("input.mp4").trim({ start: 0, end: 5 }).export("output.mp4")
```

Lavalier requires `ffmpeg` to be installed and available on your PATH.
