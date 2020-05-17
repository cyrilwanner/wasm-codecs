import { initTestUtils, getFileSize, getImageMetadata, cleanup, getImage } from '@wasm-codecs/test-utils';
import encode from '../lib';

describe('oxipng performance', () => {
  beforeAll(() => {
    initTestUtils(__dirname);
  });

  // afterAll(cleanup);

  it('encodes many images', async () => {
    jest.setTimeout(60000);
    process.setMaxListeners(0);

    const { data } = await getImage('images/small.png');
    const originalSize = getFileSize('images/small.png');
    const originalMetadata = await getImageMetadata('images/small.png');
    expect(originalMetadata.channels).toBe(4);

    const promises = [];
    for (let i = 0; i < 30; i += 1) {
      promises.push(encode(data));
    }

    const results = await Promise.all(promises);
    let resultSize = -1;
    for (let i = 0; i < 30; i += 1) {
      expect(results[i].length).toBeLessThan(originalSize * 0.9);
      expect(results[i].length).toBeGreaterThan(originalSize * 0.5);

      if (resultSize < 0) {
        resultSize = results[i].length;
      } else {
        expect(resultSize).toBe(results[i].length);
      }
    }
  });
});
