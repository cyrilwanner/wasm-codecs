export enum ColorSpace {
  UNKNOWN,
  GRAYSCALE,
  RGB,
  YCbCr,
  CMYK,
  YCCK,
}

/**
 * Checks if a raw input image is a grayscale image
 *
 * @param {Buffer} data Raw input image data
 * @param {number} channels Number of channels
 * @returns {boolean} Wheter the raw input image data is grayscale or not
 */
export const isGrayscale = (data: Buffer, channels: number): boolean => {
  for (let i = 0; i < data.length; i += channels) {
    for (let j = 1; j < channels && i + j < data.length; j += 1) {
      if (data[i] !== data[i + j]) {
        return false;
      }
    }
  }

  return true;
};
