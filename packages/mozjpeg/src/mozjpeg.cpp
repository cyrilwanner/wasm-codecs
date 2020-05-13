#include <emscripten/bind.h>
#include <emscripten/val.h>
#include <stdlib.h>
#include <inttypes.h>
#include <stdio.h>
#include <setjmp.h>
#include <string.h>
#include "config.h"
#include "jpeglib.h"
#include "cdjpeg.h"

using namespace emscripten;

struct MozJPEGOptions {
  int quality;
  bool baseline;
  bool arithmetic;
  bool progressive;
  bool optimize_coding;
  int smoothing;
  int color_space;
  int quant_table;
  bool trellis_multipass;
  bool trellis_opt_zero;
  bool trellis_opt_table;
  int trellis_loops;
  bool auto_subsample;
  int chroma_subsample;
  bool separate_chroma_quality;
  int chroma_quality;
};

struct Result {
  unsigned long size;
  uint8_t *data;
};

int encode(std::string input, int image_width, int image_height, int input_channels, MozJPEGOptions options) {
  uint8_t *image = (uint8_t *) input.c_str();

  // initialize config variables
  struct jpeg_error_mgr jerr;
  struct jpeg_compress_struct cinfo;

  cinfo.err = jpeg_std_error(&jerr);

  // initialize compression object
  jpeg_create_compress(&cinfo);

  // set destination to memory
  struct Result *output = (struct Result *) malloc(sizeof(struct Result));
  jpeg_mem_dest(&cinfo, &(output->data), &(output->size));

  // set input image information
  cinfo.image_width = image_width;
  cinfo.image_height = image_height;
  cinfo.input_components = input_channels;

  if (input_channels == 1) {
    cinfo.in_color_space = JCS_GRAYSCALE;
  } else if (input_channels == 4) {
    cinfo.in_color_space = JCS_EXT_RGBA;
  } else {
    cinfo.in_color_space = JCS_RGB;
  }

  // set default compression parameters
  jpeg_set_defaults(&cinfo);

  // set options
  jpeg_set_colorspace(&cinfo, (J_COLOR_SPACE) options.color_space);

  if (options.quant_table != -1) {
    jpeg_c_set_int_param(&cinfo, JINT_BASE_QUANT_TBL_IDX, options.quant_table);
  }

  cinfo.optimize_coding = options.optimize_coding;

  if (options.arithmetic) {
    cinfo.arith_code = TRUE;
    cinfo.optimize_coding = FALSE;
  }

  cinfo.smoothing_factor = options.smoothing;

  jpeg_c_set_bool_param(&cinfo, JBOOLEAN_USE_SCANS_IN_TRELLIS, options.trellis_multipass);
  jpeg_c_set_bool_param(&cinfo, JBOOLEAN_TRELLIS_EOB_OPT, options.trellis_opt_zero);
  jpeg_c_set_bool_param(&cinfo, JBOOLEAN_TRELLIS_Q_OPT, options.trellis_opt_table);
  jpeg_c_set_int_param(&cinfo, JINT_TRELLIS_NUM_LOOPS, options.trellis_loops);

  std::string quality_str = std::to_string(options.quality);

  if (options.separate_chroma_quality && options.color_space == JCS_YCbCr) {
    quality_str += "," + std::to_string(options.chroma_quality);
  }

  char const *pqual = quality_str.c_str();

  set_quality_ratings(&cinfo, (char *)pqual, options.baseline);

  if (!options.auto_subsample && options.color_space == JCS_YCbCr) {
    cinfo.comp_info[0].h_samp_factor = options.chroma_subsample;
    cinfo.comp_info[0].v_samp_factor = options.chroma_subsample;
  }

  if (!options.baseline && options.progressive) {
    jpeg_simple_progression(&cinfo);
  } else {
    cinfo.num_scans = 0;
    cinfo.scan_info = NULL;
  }

  // start compressing
  jpeg_start_compress(&cinfo, TRUE);

  int row_stride = image_width * input_channels;
  JSAMPROW row_pointer[1];

  while (cinfo.next_scanline < cinfo.image_height) {
    row_pointer[0] = &image[cinfo.next_scanline * row_stride];
    jpeg_write_scanlines(&cinfo, row_pointer, 1);
  }

  // finish compressing
  jpeg_finish_compress(&cinfo);
  jpeg_destroy_compress(&cinfo);

  return (int) output;
};

val get_image(int pointer) {
  struct Result *output = (struct Result *) pointer;
  return val(typed_memory_view(output->size, output->data));
}

void free_image(int pointer) {
  struct Result *output = (struct Result *) pointer;
  free(output->data);
  free(output);
}

EMSCRIPTEN_BINDINGS(mozjpeg) {
  value_object<MozJPEGOptions>("MozJPEGOptions")
      .field("quality", &MozJPEGOptions::quality)
      .field("baseline", &MozJPEGOptions::baseline)
      .field("arithmetic", &MozJPEGOptions::arithmetic)
      .field("progressive", &MozJPEGOptions::progressive)
      .field("optimizeCoding", &MozJPEGOptions::optimize_coding)
      .field("smoothing", &MozJPEGOptions::smoothing)
      .field("colorSpace", &MozJPEGOptions::color_space)
      .field("quantTable", &MozJPEGOptions::quant_table)
      .field("trellisMultipass", &MozJPEGOptions::trellis_multipass)
      .field("trellisOptZero", &MozJPEGOptions::trellis_opt_zero)
      .field("trellisOptTable", &MozJPEGOptions::trellis_opt_table)
      .field("trellisLoops", &MozJPEGOptions::trellis_loops)
      .field("autoSubsample", &MozJPEGOptions::auto_subsample)
      .field("chromaSubsample", &MozJPEGOptions::chroma_subsample)
      .field("separateChromaQuality", &MozJPEGOptions::separate_chroma_quality)
      .field("chromaQuality", &MozJPEGOptions::chroma_quality);

  function("encode", &encode);
  function("getImage", &get_image);
  function("freeImage", &free_image);
}
