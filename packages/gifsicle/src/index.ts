import Gifsicle from './gifsicle';
import { EncodeOptions } from './types';
import { defaultEncodeOptions } from './options';
import { stdout, stderr, flush } from './io';

const queue: Array<() => void> = [];

/**
 * Initialize the gifsicle module
 */
const initModule = (): Promise<void> => {
  return new Promise((resolve) => {
    // add a new job to the queue
    queue.push(resolve);

    // start it if there is no queue
    if (queue.length === 1) {
      queue[0]();
    }
  });
};

/**
 * Reset the gifsicle module
 */
const resetModule = (): void => {
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
 * Encode an input image using Gifsicle
 *
 * @async
 * @param {Buffer} image Image input buffer
 * @param {EncodeOptions} encodeOptions Encoding options passed to Gifsicle
 * @returns {Buffer} Processed image buffer
 */
const encode = async (image: Buffer, encodeOptions: EncodeOptions = {}): Promise<Buffer> => {
  await initModule();

  return new Promise((resolve, reject) => {
    // merge default options
    const filledEncodeOptions = { ...defaultEncodeOptions, ...encodeOptions };

    // build arguments
    const gifsicleArguments = [
      // ignore gifsicle warnings
      '--no-warnings',

      // remove application extensions from the input image
      '--no-app-extensions',

      // set optimization level
      `--optimize=${filledEncodeOptions.optimizationLevel}`,

      // turn on interlacing
      filledEncodeOptions.interlaced === true ? '--interlace' : false,

      // set number of colors
      typeof filledEncodeOptions.colors === 'number' ? `--colors=${filledEncodeOptions.colors}` : false,

      // resize image
      ...(filledEncodeOptions.width || filledEncodeOptions.height
        ? ['--resize', `${filledEncodeOptions.width || '_'}x${filledEncodeOptions.height || '_'}`]
        : []),

      // set input & output file names
      '-i',
      '/input.gif',
      '-o',
      '/output.gif',
    ].filter(Boolean);

    let resolved = false;

    Gifsicle({
      stdout,
      stderr,
      arguments: gifsicleArguments as string[],
      input: new Uint8Array(image.buffer),
      output: (res: Uint8Array) => {
        resolve(Buffer.from(res));
        resolved = true;
      },
    }).then(() => {
      flush();
      if (!resolved) {
        reject();
      }
      resetModule();
    });
  });
};

export default encode;
export type { EncodeOptions } from './types';
module.exports = encode;
