# `@wasm-codecs/gifsicle` [![npm version](https://badgen.net/npm/v/@wasm-codecs/gifsicle)](https://www.npmjs.com/package/@wasm-codecs/gifsicle) [![license](https://badgen.net/github/license/cyrilwanner/wasm-codecs)](https://github.com/cyrilwanner/wasm-codecs/blob/master/LICENSE) [![downloads](https://badgen.net/npm/dt/@wasm-codecs/gifsicle)](https://www.npmjs.com/package/@wasm-codecs/gifsicle)

> Gifsicle WebAssembly Codec

## Table of contents

1. [Installation](#installation)
1. [Usage](#usage)
1. [API](#api)
1. [Examples](#examples)
1. [License](#license)

## Installation

```bash
npm install @wasm-codecs/gifsicle
```

**Requirements:**
- Node.js 10 or later

## Usage

```typescript
import encode from '@wasm-codecs/gifsicle';

(async () => {
  const encodedImage = await encode(image, encodeOptions);
})();
```

## API

### `encode(image, encodeOptions?): Buffer`

Returns a buffer containing the compressed image data.

##### `image: Buffer`

Buffer of a GIF image.

##### `encodeOptions?: EncodeOptions`

All encoding options are optional and fall back to the [default values](https://github.com/cyrilwanner/wasm-codecs/blob/master/packages/gifsicle/src/options.ts#L3-L6).

```typescript
type EncodeOptions = {
  optimizationLevel?: number;
  interlaced?: boolean;
  colors?: number;
  width?: number;
  height?: number;
}
```

## Examples

### Using Node.js

```typescript
import fs from 'fs';
import encode from '@wasm-codecs/gifsicle';

(async () => {
  // read input image as a buffer
  const data = fs.readFileSync('in.gif');

  // encode the image using @wasm-codecs/gifsicle
  const output = await encode(data);

  // save the image to the file system
  fs.writeFileSync('out.png', output);
})();
```

## License

Licensed under the [MIT](https://github.com/cyrilwanner/wasm-codecs/blob/master/LICENSE) license.

© Copyright Cyril Wanner
