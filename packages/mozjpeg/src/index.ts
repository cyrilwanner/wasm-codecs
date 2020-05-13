import Module, { MozJPEGModule } from './mozjpeg';
import { defaultInputInfo, defaultEncodeOptions } from './options';
import { InputInfo, EncodeOptions } from './types';

let initPromise: Promise<void>;
let mozjpeg: MozJPEGModule;

/**
 * Initialize the mozjpeg module
 */
const initModule = (): Promise<void> => {
  if (!initPromise) {
    initPromise = new Promise((resolve) => {
      mozjpeg = Module();
      mozjpeg.onRuntimeInitialized = (): void => {
        resolve();
      };
    });
  }

  return initPromise;
};

/**
 * Encode a raw input image using MozJPEG
 *
 * @param {Buffer} image Raw image input buffer
 * @param {InputInfo} inputInfo Information about the input image
 * @param {EncodeOptions} encodeOptions Encoding options passed to MozJPEG
 * @returns {Buffer} Processed image buffer
 */
const encode = async (image: Buffer, inputInfo: InputInfo, encodeOptions: EncodeOptions = {}): Promise<Buffer> => {
  // merge default configs
  const filledInputInfo = { ...defaultInputInfo, ...inputInfo };
  const filledEncodeOptions = { ...defaultEncodeOptions, ...encodeOptions };

  if (filledInputInfo.width < 1 || filledInputInfo.height < 1) {
    throw new Error(`Invalid input image size: ${filledInputInfo.width}x${filledInputInfo.height}`);
  } else if (filledInputInfo.channels < 1 || filledInputInfo.channels > 4) {
    throw new Error(`Invalid input channels: ${filledInputInfo.channels}`);
  }

  // wait for the wasm module to be ready
  await initModule();

  // encode the image and get a pointer to the result
  const resultPointer = mozjpeg.encode(
    image,
    filledInputInfo.width,
    filledInputInfo.height,
    filledInputInfo.channels,
    filledEncodeOptions,
  );

  // copy the image from wasm into the js environment
  const result = mozjpeg.getImage(resultPointer);

  // free used memory
  mozjpeg.freeImage(resultPointer);

  return Buffer.from(result);
};

export default encode;
module.exports = encode;
