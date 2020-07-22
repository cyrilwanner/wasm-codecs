import { initTestUtils, getRawImage, getFileSize, getImageMetadata } from '@wasm-codecs/test-utils';
import encode from '../lib';

describe('mozjpeg performance', () => {
  beforeAll(() => {
    initTestUtils(__dirname);
  });

  it('encodes many images', async () => {
    jest.setTimeout(600000);
    process.setMaxListeners(0);

    const {
      data,
      info: { width, height, channels },
    } = await getRawImage('images/medium.jpg');
    const originalSize = getFileSize('images/medium.jpg');
    const originalMetadata = await getImageMetadata('images/medium.jpg');
    expect(originalMetadata.channels).toBe(3);

    const promises = [];
    for (let i = 0; i < 30; i += 1) {
      promises.push(encode(data, { width, height, channels }));
    }

    const results = await Promise.all(promises);
    let resultSize = -1;
    for (let i = 0; i < 30; i += 1) {
      expect(results[i].length).toBeLessThan(originalSize * 0.75);
      expect(results[i].length).toBeGreaterThan(originalSize * 0.25);

      if (resultSize < 0) {
        resultSize = results[i].length;
      } else {
        expect(resultSize).toBe(results[i].length);
      }
    }
  });
});
