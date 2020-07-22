export interface MozJPEGModule extends EmscriptenModule {
  encode(image: Buffer, imageWidth: number, imageHeight: number, inputChannels: number, outputOptions: any): number;
  getImage(imagePointer: number): Buffer;
  freeImage(imagePointer: number): void;
}

export default function(mozjpeg: { onRuntimeInitialized: () => void }): MozJPEGModule;
