# `@wasm-codecs/test-utils`

> Test utility functions for other @wasm-codecs packages

## Table of contents

1. [Installation](#installation)
1. [Usage](#usage)
1. [API](#api)
1. [License](#license)

## Installation

This is a private and unpublished package and can not be installed from the npm registry.

To add `@wasm-codecs/test-utils` to a new package within this repository, run the following command in the *root directory* of this monorepo:

```bash
npm run lerna add @wasm-codecs/test-utils -- --scope=@wasm-codecs/TARGET-CODEC-NAME
```

## Usage

```typescript
import { initTestUtils, cleanup } from '@wasm-codecs/test-utils';

describe('my test', () => {
  beforeAll(() => {
    initTestUtils(__dirname);
  );

  afterAll(cleanup);

  // ...
});
```

## API

### `initTestUtils(basePath): void`

Initializes the test utils by configuring internal paths.

##### `basePath: string`

Path to the test root.

### `cleanup(): void`

Cleans up tests by removing temporary files and directories.

### `async getImage(fileName): { data: Buffer; info: OutputInfo }`

Loads an image file and returns its buffer and information.

##### `fileName: string`

Name of the image file to load.

### `async getRawImage(fileName: string): { data: Buffer; info: OutputInfo }`

Loads an image file and returns its raw RGB data per pixel and information.

##### `fileName: string`

Name of the image file to load.

### `async getImageMetadata(fileName): Metadata`

Returns all available metadata of an image.

##### `fileName: string`

Name of the image file to load.

### `getFileSize(fileName: string): number`

Returns the size of a file in bytes.

##### `fileName: string`

Name of the image file to load.

### `writeTmpBuffer(data: Buffer, fileName: string): number`

Writes a buffer into a temporary file.

##### `data: Buffer`

Buffer to write.

##### `fileName: string`

Filename of the temporary file.

## License

Licensed under the [MIT](https://github.com/cyrilwanner/wasm-codecs/blob/master/LICENSE) license.

© Copyright Cyril Wanner
