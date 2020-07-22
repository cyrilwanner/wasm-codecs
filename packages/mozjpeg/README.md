# `@wasm-codecs/mozjpeg` [![npm version](https://badgen.net/npm/v/@wasm-codecs/mozjpeg)](https://www.npmjs.com/package/@wasm-codecs/mozjpeg) [![license](https://badgen.net/github/license/cyrilwanner/wasm-codecs)](https://github.com/cyrilwanner/wasm-codecs/blob/master/LICENSE) [![downloads](https://badgen.net/npm/dt/@wasm-codecs/mozjpeg)](https://www.npmjs.com/package/@wasm-codecs/mozjpeg)

> MozJPEG WebAssembly Codec

## Table of contents

1. [Installation](#installation)
1. [Usage](#usage)
1. [API](#api)
1. [Examples](#examples)
1. [License](#license)

## Installation

```bash
npm install @wasm-codecs/mozjpeg
```

**Requirements:**
- Node.js 10 or later

## Usage

```typescript
import encode from '@wasm-codecs/mozjpeg';

(async () => {
  const encodedImage = await encode(image, inputInfo, encodeOptions);
})();
```

## API

### `encode(image, inputInfo, encodeOptions?): Buffer`

Returns a buffer containing the compressed image data.

##### `image: Buffer`

A raw RGB image input buffer.

##### `inputInfo: InputInfo`

Those are required informations about the raw input image.
Channels specifies the amount of channels in the `image: Buffer` param and defaults to `3` (RGB).

```typescript
type InputInfo = {
  width: number;
  height: number;
  channels?: number;
}
```

##### `encodeOptions?: EncodeOptions`

All encoding options are optional and fall back to the [default values](https://github.com/cyrilwanner/wasm-codecs/blob/master/packages/mozjpeg/src/options.ts#L9-L26).

```typescript
type EncodeOptions = {
  quality?: number;
  baseline?: boolean;
  arithmetic?: boolean;
  progressive?: boolean;
  optimizeCoding?: boolean;
  smoothing?: number;
  colorSpace?: ColorSpace;
  quantTable?: number;
  trellisMultipass?: boolean;
  trellisOptZero?: boolean;
  trellisOptTable?: boolean;
  trellisLoops?: number;
  autoSubsample?: boolean;
  chromaSubsample?: number;
  separateChromaQuality?: boolean;
  chromaQuality?: number;
}
```

## Examples

### Using sharp in Node.js

```typescript
import fs from 'fs';
import sharp from 'sharp';
import encode from '@wasm-codecs/mozjpeg';

(async () => {
  // read input image and convert it to a raw buffer using sharp
  const {
    data,
    info: { width, height, channels },
  } = await sharp('in.jpg')
    .raw()
    .toBuffer({ resolveWithObject: true });

  // encode the image using @wasm-codecs/mozjpeg
  const output = await encode(data, { width, height, channels });

  // save the image to the file system
  fs.writeFileSync('out.jpg', output);
})();
```

## License

Licensed under the [MIT](https://github.com/cyrilwanner/wasm-codecs/blob/master/LICENSE) license.

© Copyright Cyril Wanner
