import fs from 'fs';
import path from 'path';
import { initTestUtils, cleanup, getImage, getRawImage, getImageMetadata, getFileSize, writeTmpBuffer } from '../lib';

describe('test-utils', () => {
  beforeAll(() => {
    initTestUtils(__dirname);
  });

  afterAll(cleanup);

  it('loads an image', async () => {
    const { data, info } = await getImage('images/medium.jpg');

    expect(data).toBeInstanceOf(Buffer);
    expect(info.width).toBe(1920);
    expect(info.height).toBe(1080);
    expect(info.channels).toBe(3);
    expect(info.format).toBe('jpeg');
  });

  it('loads a raw image', async () => {
    const { data, info } = await getRawImage('images/medium.jpg');

    expect(data).toBeInstanceOf(Buffer);
    expect(info.width).toBe(1920);
    expect(info.height).toBe(1080);
    expect(info.channels).toBe(3);
    expect(info.format).toBe('raw');
  });

  it('loads metadata of an image', async () => {
    const metadata = await getImageMetadata('images/medium.jpg');

    expect(metadata.width).toBe(1920);
    expect(metadata.height).toBe(1080);
    expect(metadata.channels).toBe(3);
    expect(metadata.format).toBe('jpeg');
    expect(metadata.isProgressive).toBe(true);
  });

  it('returns the correct size of a file', () => {
    const size = getFileSize('images/medium.jpg');

    expect(size).toBe(603847);
  });

  it('writes a temp file', () => {
    const data = Buffer.from(new Uint8Array([0, 1, 2]));
    const tmpPath = writeTmpBuffer(data, 'tmp-test.jpg');

    expect(tmpPath).toBe('tmp/tmp-test.jpg');
    expect(fs.existsSync(path.resolve(__dirname, tmpPath))).toBe(true);
    expect(getFileSize(tmpPath)).toBe(3);
  });

  it('cleans up the temp directory', () => {
    const data = Buffer.from(new Uint8Array([0, 1, 2]));
    const tmpPath = writeTmpBuffer(data, 'tmp-test.jpg');

    expect(fs.existsSync(path.resolve(__dirname, 'tmp'))).toBe(true);
    expect(fs.existsSync(path.resolve(__dirname, tmpPath))).toBe(true);

    cleanup();

    expect(fs.existsSync(path.resolve(__dirname, tmpPath))).toBe(false);
    expect(fs.existsSync(path.resolve(__dirname, 'tmp'))).toBe(false);
  });
});
