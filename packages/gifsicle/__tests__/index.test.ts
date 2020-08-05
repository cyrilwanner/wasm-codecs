import {
  initTestUtils,
  cleanup,
  getImageFile,
  writeTmpBuffer,
  getFileSize,
  getImageMetadata,
} from '@wasm-codecs/test-utils';
import gifInfo from 'gif-info';
import encode from '../lib';

describe('gifsicle', () => {
  beforeAll(() => {
    initTestUtils(__dirname);
  });

  afterAll(() => cleanup());

  // test all image sizes
  ['tiny', 'small', 'medium', 'large'].forEach((size) => {
    it(`encodes a ${size} image`, async () => {
      const data = getImageFile(`images/${size}.gif`);
      const originalSize = getFileSize(`images/${size}.gif`);
      const originalMetadata = await getImageMetadata(`images/${size}.gif`);

      const result = await encode(data);
      const encodedPath = writeTmpBuffer(result, `${size}.gif`);
      const encodedSize = getFileSize(encodedPath);

      // expect the image size to be between 0.25 and 0.995 of the original image
      expect(encodedSize).toBeLessThan(originalSize * 0.995);
      expect(encodedSize).toBeGreaterThan(originalSize * 0.25);

      // check if the image is still a valid jpeg image
      const metadata = await getImageMetadata(encodedPath);
      expect(metadata.format).toBe('gif');
      expect(metadata.width).toBe(originalMetadata.width);
      expect(metadata.height).toBe(originalMetadata.height);
    });
  });

  it('respects optimization level option', async () => {
    const data = getImageFile('images/small.gif');

    // with level 1
    const resultLevel1 = await encode(data, { optimizationLevel: 1 });
    const pathLevel1 = writeTmpBuffer(resultLevel1, 'small-level1.gif');
    const sizeLevel1 = getFileSize(pathLevel1);

    // with level 3
    const resultLevel3 = await encode(data, { optimizationLevel: 3 });
    const pathLevel3 = writeTmpBuffer(resultLevel3, 'small-level3.gif');
    const sizeLevel3 = getFileSize(pathLevel3);

    expect(sizeLevel1).toBeGreaterThan(sizeLevel3);
  });

  it('resizes correctly with both sides given', async () => {
    const data = getImageFile('images/medium.gif');
    const result = await encode(data, { width: 20, height: 30 });
    const encodedPath = writeTmpBuffer(result, 'medium-20x30.gif');

    const metadata = await getImageMetadata(encodedPath);
    expect(metadata.format).toBe('gif');
    expect(metadata.width).toBe(20);
    expect(metadata.height).toBe(30);
  });

  it('resizes correctly with only width given', async () => {
    const data = getImageFile('images/medium.gif');
    const result = await encode(data, { width: 50 });
    const encodedPath = writeTmpBuffer(result, 'medium-50x_.gif');

    const metadata = await getImageMetadata(encodedPath);
    expect(metadata.format).toBe('gif');
    expect(metadata.width).toBe(50);
    expect(metadata.height).toBe(28);
  });

  it('resizes correctly with only height given', async () => {
    const data = getImageFile('images/medium.gif');
    const result = await encode(data, { height: 25 });
    const encodedPath = writeTmpBuffer(result, 'medium-_x25.gif');

    const metadata = await getImageMetadata(encodedPath);
    expect(metadata.format).toBe('gif');
    expect(metadata.width).toBe(44);
    expect(metadata.height).toBe(25);
  });

  it('respects colors option', async () => {
    const data = getImageFile('images/small.gif');
    const originalInfo = gifInfo(new Uint8Array(data).buffer);
    expect(originalInfo.globalPaletteSize).toBe(256);
    
    const result = await encode(data, { colors: 32 });
    writeTmpBuffer(result, `small-32colors.gif`);

    // check if new gif has only 32 colors
    const encodeInfo = gifInfo(new Uint8Array(result).buffer);
    expect(encodeInfo.globalPaletteSize).toBe(32);
  });
});
