import {
  initTestUtils,
  cleanup,
  getRawImage,
  writeTmpBuffer,
  getFileSize,
  getImageMetadata,
} from '@wasm-codecs/test-utils';
import encode from '../lib';
import { ColorSpace } from '../lib/colorspace';

describe('mozjpeg', () => {
  beforeAll(() => {
    initTestUtils(__dirname);
  });

  afterAll(() => cleanup());

  // test all image sizes
  ['tiny', 'small', 'medium', 'large'].forEach((size) => {
    it(`encodes a ${size} image`, async () => {
      jest.setTimeout(20000);

      const {
        data,
        info: { width, height, channels },
      } = await getRawImage(`images/${size}.jpg`);
      const originalSize = getFileSize(`images/${size}.jpg`);
      const originalMetadata = await getImageMetadata(`images/${size}.jpg`);
      expect(originalMetadata.channels).toBe(3);

      const result = await encode(data, { width, height, channels });
      const encodedPath = writeTmpBuffer(result, `${size}.jpg`);
      const encodedSize = getFileSize(encodedPath);

      // expect the image size to be between 1/4 and 3/4 of the original image
      expect(encodedSize).toBeLessThan(originalSize * 0.75);
      expect(encodedSize).toBeGreaterThan(originalSize * 0.25);

      // check if the image is still a valid jpeg image
      const metadata = await getImageMetadata(encodedPath);
      expect(metadata.format).toBe('jpeg');
      expect(metadata.width).toBe(width);
      expect(metadata.height).toBe(height);
      expect(metadata.channels).toBe(3);
      expect(metadata.isProgressive).toBe(true);
    });
  });

  it('encodes a grayscale image', async () => {
    const {
      data,
      info: { width, height, channels },
    } = await getRawImage('images/grayscale.jpg');
    const originalSize = getFileSize('images/grayscale.jpg');
    const originalMetadata = await getImageMetadata('images/grayscale.jpg');
    expect(originalMetadata.channels).toBe(1);

    const result = await encode(data, { width, height, channels });
    const encodedPath = writeTmpBuffer(result, 'grayscale.jpg');
    const encodedSize = getFileSize(encodedPath);

    // expect the image size to be between 1/4 and 3/4 of the original image
    expect(encodedSize).toBeLessThan(originalSize * 0.75);
    expect(encodedSize).toBeGreaterThan(originalSize * 0.25);

    // check if the image is still a valid jpeg image
    const metadata = await getImageMetadata(encodedPath);
    expect(metadata.format).toBe('jpeg');
    expect(metadata.width).toBe(width);
    expect(metadata.height).toBe(height);
    expect(metadata.channels).toBe(1);
  });

  it('respects quality option', async () => {
    const {
      data,
      info: { width, height, channels },
    } = await getRawImage('images/medium.jpg');
    const originalSize = getFileSize('images/medium.jpg');
    const originalMetadata = await getImageMetadata('images/medium.jpg');
    expect(originalMetadata.channels).toBe(3);

    const result = await encode(data, { width, height, channels }, { quality: 10 });
    const encodedPath = writeTmpBuffer(result, 'medium-lowquality.jpg');
    const encodedSize = getFileSize(encodedPath);

    // expect the image size to be lower than 10% of the original
    expect(encodedSize).toBeLessThan(originalSize * 0.1);
    expect(encodedSize).toBeGreaterThan(originalSize * 0.01);

    // check if the image is still a valid jpeg image
    const metadata = await getImageMetadata(encodedPath);
    expect(metadata.format).toBe('jpeg');
    expect(metadata.width).toBe(width);
    expect(metadata.height).toBe(height);
    expect(metadata.channels).toBe(3);
  });

  it('converts an image into grayscale', async () => {
    const {
      data,
      info: { width, height, channels },
    } = await getRawImage('images/medium.jpg');
    const originalSize = getFileSize('images/medium.jpg');
    const originalMetadata = await getImageMetadata('images/medium.jpg');
    expect(originalMetadata.channels).toBe(3);

    const result = await encode(data, { width, height, channels }, { colorSpace: ColorSpace.GRAYSCALE });
    const encodedPath = writeTmpBuffer(result, 'medium-grayscale.jpg');
    const encodedSize = getFileSize(encodedPath);

    // expect the image size to be between 1/4 and 3/4 of the original image
    expect(encodedSize).toBeLessThan(originalSize * 0.75);
    expect(encodedSize).toBeGreaterThan(originalSize * 0.25);

    // check if the image is still a valid jpeg image
    const metadata = await getImageMetadata(encodedPath);
    expect(metadata.format).toBe('jpeg');
    expect(metadata.width).toBe(width);
    expect(metadata.height).toBe(height);
    expect(metadata.channels).toBe(1);
  });

  it('uses baseline if progressive is disabled', async () => {
    const {
      data,
      info: { width, height, channels },
    } = await getRawImage('images/medium.jpg');
    const originalSize = getFileSize('images/medium.jpg');
    const originalMetadata = await getImageMetadata('images/medium.jpg');
    expect(originalMetadata.channels).toBe(3);

    const result = await encode(data, { width, height, channels }, { progressive: false });
    const encodedPath = writeTmpBuffer(result, 'medium-baseline.jpg');
    const encodedSize = getFileSize(encodedPath);

    // expect the image size to be between 1/4 and 3/4 of the original image
    expect(encodedSize).toBeLessThan(originalSize * 0.75);
    expect(encodedSize).toBeGreaterThan(originalSize * 0.25);

    // check if the image is still a valid jpeg image
    const metadata = await getImageMetadata(encodedPath);
    expect(metadata.format).toBe('jpeg');
    expect(metadata.width).toBe(width);
    expect(metadata.height).toBe(height);
    expect(metadata.channels).toBe(3);
    expect(metadata.isProgressive).toBe(false);
  });
});
