import oxipng from './oxipng';
import { EncodeOptions } from './types';
import { defaultEncodeOptions } from './options';

/**
 * Encode a raw input image using oxipng
 *
 * @param {Buffer} image Raw image input buffer
 * @param {EncodeOptions} encodeOptions Encoding options passed to oxipng
 * @returns {Buffer} Processed image buffer
 */
const encode = (image: Buffer, encodeOptions: EncodeOptions = {}): Buffer => {
  // merge default configs
  const filledEncodeOptions = { ...defaultEncodeOptions, ...encodeOptions };

  const result = oxipng.encode(new Uint8Array(image), filledEncodeOptions.level);

  return Buffer.from(result);
};

export default encode;
module.exports = encode;
