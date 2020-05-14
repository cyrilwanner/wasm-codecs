import path from 'path';
import fs from 'fs';
import sharp, { OutputInfo, Metadata } from 'sharp';
import rimraf from 'rimraf';

const tmpFolder = path.resolve(__dirname, 'tmp');

/**
 * Load raw image data from a file
 *
 * @param {string} fileName Image file name
 * @returns {Promise<{ data: Buffer; info: OutputInfo }} Raw image data
 */
export const getRawImage = async (fileName: string): Promise<{ data: Buffer; info: OutputInfo }> => {
  return sharp(path.resolve(__dirname, fileName)).raw().toBuffer({ resolveWithObject: true });
};

/**
 * Load image metadata
 *
 * @param {string} fileName Image file name
 * @returns {Promise<Metadata>} Image metadata
 */
export const getImageMetadata = async (fileName: string): Promise<Metadata> => {
  return sharp(path.resolve(__dirname, fileName)).metadata();
};

/**
 * Returns the size in bytes of a file
 *
 * @param {string} fileName File name
 * @returns {number} File size in bytes
 */
export const getFileSize = (fileName: string): number => {
  return fs.statSync(path.resolve(__dirname, fileName)).size;
};

/**
 * Cleans up after the test
 */
export const cleanup = (): void => {
  rimraf.sync(tmpFolder);
};

/**
 * Writes a buffer into a temporary file
 *
 * @param {Buffer} data Buffer to write
 * @param {string} fileName File name
 * @returns {string} Path of the temporary file
 */
export const writeTmpBuffer = (data: Buffer, fileName: string): string => {
  const outputPath = path.resolve(__dirname, 'tmp', fileName);

  if (!fs.existsSync(tmpFolder)) {
    fs.mkdirSync(tmpFolder);
  }

  fs.writeFileSync(outputPath, data);

  return `tmp/${fileName}`;
};
