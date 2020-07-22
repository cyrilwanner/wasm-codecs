# `@wasm-codecs/oxipng` [![npm version](https://badgen.net/npm/v/@wasm-codecs/oxipng)](https://www.npmjs.com/package/@wasm-codecs/oxipng) [![license](https://badgen.net/github/license/cyrilwanner/wasm-codecs)](https://github.com/cyrilwanner/wasm-codecs/blob/master/LICENSE) [![downloads](https://badgen.net/npm/dt/@wasm-codecs/oxipng)](https://www.npmjs.com/package/@wasm-codecs/oxipng)

> Oxipng WebAssembly Codec

## Table of contents

1. [Installation](#installation)
1. [Usage](#usage)
1. [API](#api)
1. [Examples](#examples)
1. [License](#license)

## Installation

```bash
npm install @wasm-codecs/oxipng
```

**Requirements:**
- Node.js 10 or later

## Usage

```typescript
import encode from '@wasm-codecs/oxipng';

(async () => {
  const encodedImage = await encode(image, encodeOptions);
})();
```

## API

### `encode(image, encodeOptions?): Buffer`

Returns a buffer containing the compressed image data.

##### `image: Buffer`

Buffer of a PNG image.

##### `encodeOptions?: EncodeOptions`

All encoding options are optional and fall back to the [default values](https://github.com/cyrilwanner/wasm-codecs/blob/master/packages/oxipng/src/options.ts#L3-L5).

```typescript
type EncodeOptions = {
  level?: number;
}
```

## Examples

### Using Node.js

```typescript
import fs from 'fs';
import encode from '@wasm-codecs/oxipng';

// read input image as a buffer
const data = fs.readFileSync('in.png');

// encode the image using @wasm-codecs/oxipng
const output = encode(data);

// save the image to the file system
fs.writeFileSync('out.png', output);
```

## License

Licensed under the [MIT](https://github.com/cyrilwanner/wasm-codecs/blob/master/LICENSE) license.

© Copyright Cyril Wanner
