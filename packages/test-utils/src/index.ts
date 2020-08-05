import path from 'path';
import fs from 'fs';
import sharp, { OutputInfo, Metadata } from 'sharp';
import rimraf from 'rimraf';

const keepImageOutput = process.env.KEEP_IMAGE_OUTPUT === 'true';
let basePath: string;
let tmpFolder: string;

/**
 * Cleans up after the test
 */
export const cleanup = (force = false): void => {
  if (!keepImageOutput || force) {
    rimraf.sync(tmpFolder);
  }
};

/**
 * Initializes the test utils
 *
 * @param {string} nextBasePath Base path of the tests
 */
export const initTestUtils = (nextBasePath: string): void => {
  basePath = nextBasePath;
  tmpFolder = path.resolve(basePath, keepImageOutput ? 'out' : 'tmp');
  cleanup(true);
};

/**
 * Load image data from a file
 *
 * @param {string} fileName Image file name
 * @returns {Promise<{ data: Buffer; info: OutputInfo }>} Image data
 */
export const getImage = async (fileName: string): Promise<{ data: Buffer; info: OutputInfo }> => {
  return sharp(path.resolve(basePath, fileName)).toBuffer({ resolveWithObject: true });
};

/**
 * Load image data from a file without sharp
 *
 * @param {string} fileName Image file name
 * @returns {Buffer} Image data
 */
export const getImageFile = (fileName: string): Buffer => {
  return fs.readFileSync(path.resolve(basePath, fileName));
};

/**
 * Load raw image data from a file
 *
 * @param {string} fileName Image file name
 * @returns {Promise<{ data: Buffer; info: OutputInfo }} Raw image data
 */
export const getRawImage = async (fileName: string): Promise<{ data: Buffer; info: OutputInfo }> => {
  return sharp(path.resolve(basePath, fileName)).raw().toBuffer({ resolveWithObject: true });
};

/**
 * Load image metadata
 *
 * @param {string} fileName Image file name
 * @returns {Promise<Metadata>} Image metadata
 */
export const getImageMetadata = async (fileName: string): Promise<Metadata> => {
  return sharp(path.resolve(basePath, fileName)).metadata();
};

/**
 * Returns the size in bytes of a file
 *
 * @param {string} fileName File name
 * @returns {number} File size in bytes
 */
export const getFileSize = (fileName: string): number => {
  return fs.statSync(path.resolve(basePath, fileName)).size;
};

/**
 * Writes a buffer into a temporary file
 *
 * @param {Buffer} data Buffer to write
 * @param {string} fileName File name
 * @returns {string} Path of the temporary file
 */
export const writeTmpBuffer = (data: Buffer, fileName: string): string => {
  const outputPath = path.resolve(tmpFolder, fileName);

  if (!fs.existsSync(tmpFolder)) {
    fs.mkdirSync(tmpFolder);
  }

  fs.writeFileSync(outputPath, data);

  return `${keepImageOutput ? 'out' : 'tmp'}/${fileName}`;
};
