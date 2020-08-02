export type GifsicleModule = EmscriptenModule & {
  input: Uint8Array;
  output: (res: Uint8Array) => void,
}

export default function(mozjpeg: {
  stdout?: (char: number) => void,
  stderr?: (char: number) => void,
  arguments?: string[],
  input: Uint8Array,
  output: (res: Uint8Array) => void,
}): Promise<Omit<GifsicleModule, 'then'>>;
