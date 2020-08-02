#!/bin/bash

set -e

cd /build

echo "Building wasm-codecs-gifsicle.."
emcc \
  /lib/gifsicle/src/clp.o \
  /lib/gifsicle/src/fmalloc.o \
  /lib/gifsicle/src/giffunc.o \
  /lib/gifsicle/src/gifread.o \
  /lib/gifsicle/src/gifunopt.o \
  /lib/gifsicle/src/merge.o \
  /lib/gifsicle/src/optimize.o \
  /lib/gifsicle/src/quantize.o \
  /lib/gifsicle/src/support.o \
  /lib/gifsicle/src/xform.o \
  /lib/gifsicle/src/gifsicle.o \
  /lib/gifsicle/src/gifwrite.o \
  -s MODULARIZE=1 \
  -s EXPORT_NAME=gifsicle \
  -s ALLOW_MEMORY_GROWTH=1 \
  -s ERROR_ON_UNDEFINED_SYMBOLS=0 \
  --pre-js lib/pre.js \
  -o ./lib/gifsicle.js
