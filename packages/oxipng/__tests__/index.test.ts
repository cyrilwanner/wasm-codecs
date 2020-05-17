import {
  initTestUtils,
  cleanup,
  writeTmpBuffer,
  getFileSize,
  getImageMetadata,
  getImage,
} from '@wasm-codecs/test-utils';
import encode from '../lib';

describe('oxipng', () => {
  beforeAll(() => {
    initTestUtils(__dirname);
  });

  // afterAll(cleanup);

  // test all image sizes
  ['tiny', 'small', 'medium', 'large'].forEach((size) => {
    it(`encodes a ${size} image`, async () => {
      jest.setTimeout(10000);

      const {
        data,
        info: { width, height },
      } = await getImage(`images/${size}.png`);
      const originalSize = getFileSize(`images/${size}.png`);
      const originalMetadata = await getImageMetadata(`images/${size}.png`);
      expect(originalMetadata.channels).toBe(4);

      const result = await encode(data);
      const encodedPath = writeTmpBuffer(result, `${size}.png`);
      const encodedSize = getFileSize(encodedPath);

      // expect the image size to be between 1/2 and 9/10 of the original image
      expect(encodedSize).toBeLessThan(originalSize * 0.9);
      expect(encodedSize).toBeGreaterThan(originalSize * 0.5);

      // check if the image is still a valid png image
      const metadata = await getImageMetadata(encodedPath);
      expect(metadata.format).toBe('png');
      expect(metadata.width).toBe(width);
      expect(metadata.height).toBe(height);
      expect(metadata.channels).toBe(4);
    });
  });

  it('respects level option', async () => {
    const {
      data,
      info: { width, height },
    } = await getImage('images/medium.png');
    const originalSize = getFileSize('images/medium.png');
    const originalMetadata = await getImageMetadata('images/medium.png');
    expect(originalMetadata.channels).toBe(4);

    const result = await encode(data, { level: 0 });
    const encodedPath = writeTmpBuffer(result, 'medium-lowlevel.png');
    const encodedSize = getFileSize(encodedPath);

    // expect the image size to be higher than 90% of the original
    expect(encodedSize).toBeGreaterThan(originalSize * 0.9);

    // check if the image is still a valid png image
    const metadata = await getImageMetadata(encodedPath);
    expect(metadata.format).toBe('png');
    expect(metadata.width).toBe(width);
    expect(metadata.height).toBe(height);
    expect(metadata.channels).toBe(4);
  });
});
