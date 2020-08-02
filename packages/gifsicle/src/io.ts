/* eslint-disable no-console */

let out = '';

/**
 * Process stdout stream
 *
 * @param {number} char Next char in stream
 */
export const stdout = (char: number): void => {
  out += String.fromCharCode(char);

  if (char === 10) {
    console.log(out);
    out = '';
  }
};

let err = '';

/**
 * Process stderr stream
 *
 * @param {number} char Next char in stream
 */
export const stderr = (char: number): void => {
  err += String.fromCharCode(char);

  if (char === 10) {
    console.error(err);
    err = '';
  }
};

/**
 * Flush remaining buffer
 */
export const flush = (): void => {
  if (out.length > 0) {
    console.log(out);
    out = '';
  }

  if (err.length > 0) {
    console.error(err);
    err = '';
  }
};
