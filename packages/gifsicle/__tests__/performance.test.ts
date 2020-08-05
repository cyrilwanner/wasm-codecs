import { initTestUtils, getImageFile, getFileSize, getImageMetadata } from '@wasm-codecs/test-utils';
import encode from '../lib';

describe('gifsicle performance', () => {
  beforeAll(() => {
    initTestUtils(__dirname);
  });

  it('encodes many images', async () => {
    jest.setTimeout(100000);
    process.setMaxListeners(0);

    const data = getImageFile('images/medium.gif');
    const originalSize = getFileSize('images/medium.gif');

    const promises = [];
    for (let i = 0; i < 15; i += 1) {
      promises.push(encode(data));
    }

    const results = await Promise.all(promises);
    let resultSize = -1;
    for (let i = 0; i < 15; i += 1) {
      expect(results[i].length).toBeLessThan(originalSize * 0.995);
      expect(results[i].length).toBeGreaterThan(originalSize * 0.25);

      if (resultSize < 0) {
        resultSize = results[i].length;
      } else {
        expect(resultSize).toBe(results[i].length);
      }
    }
  });
});
