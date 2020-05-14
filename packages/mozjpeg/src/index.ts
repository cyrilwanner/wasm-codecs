import Module, { MozJPEGModule } from './mozjpeg';
import { defaultInputInfo, defaultEncodeOptions } from './options';
import { InputInfo, EncodeOptions } from './types';
import { isGrayscale, ColorSpace } from './colorspace';

let mozjpeg: MozJPEGModule | null;
const queue: Array<() => void> = [];

/**
 * Initialize the mozjpeg module
 */
const initModule = (): Promise<void> => {
  return new Promise((resolve) => {
    // add a new job to the queue
    queue.push(() => {
      mozjpeg = Module();
      mozjpeg.onRuntimeInitialized = (): void => {
        resolve();
      };
    });

    // start it if there is no queue
    if (queue.length === 1) {
      queue[0]();
    }
  });
};

/**
 * Resets the mozjpeg module to avoid some wasm related problems
 * when optimizing many images after each other
 */
const resetModule = (): void => {
  mozjpeg = null;

  if (queue.length > 0) {
    // remove finished job
    queue.shift();

    // trigger next job
    if (queue.length > 0) {
      queue[0]();
    }
  }
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
  try {
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

    if (!mozjpeg) {
      throw new Error('MozJPEG Module could not be initialized');
    }

    // check if it is a grayscale image and preserve it if so
    if (
      typeof encodeOptions.colorSpace === 'undefined' &&
      (inputInfo.channels === 1 || isGrayscale(image, filledInputInfo.channels))
    ) {
      filledEncodeOptions.colorSpace = ColorSpace.GRAYSCALE;
    }

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
  } finally {
    resetModule();
  }
};

export default encode;
export { ColorSpace } from './colorspace';
export type { InputInfo, EncodeOptions } from './types';
module.exports = encode;
