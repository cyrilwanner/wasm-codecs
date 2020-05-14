import { InputInfo, EncodeOptions } from './types';
import { ColorSpace } from './colorspace';

export const defaultInputInfo: Required<InputInfo> = {
  width: 0,
  height: 0,
  channels: 3,
};

export const defaultEncodeOptions: Required<EncodeOptions> = {
  quality: 75,
  baseline: false,
  arithmetic: false,
  progressive: true,
  optimizeCoding: true,
  smoothing: 0,
  colorSpace: ColorSpace.YCbCr,
  quantTable: 3,
  trellisMultipass: false,
  trellisOptZero: false,
  trellisOptTable: false,
  trellisLoops: 1,
  autoSubsample: true,
  chromaSubsample: 2,
  separateChromaQuality: false,
  chromaQuality: 75,
};
