#!/bin/bash

set -e

echo "Building wasm-codec-mozjpeg.."
cd /build
rm -rf ./lib
mkdir ./lib
emcc \
  --bind \
  -s ALLOW_MEMORY_GROWTH=1 \
  -s MODULARIZE=1 \
  -s WASM=1 \
  -I /lib/mozjpeg \
  -s 'EXPORT_NAME="mozjpeg"' \
  -s NODERAWFS=1 \
  -Wno-deprecated-register \
  -Wno-writable-strings \
  -o ./lib/mozjpeg.js \
  -x c++ \
  -std=c++11 \
  ./src/mozjpeg.cpp \
  /lib/mozjpeg/rdswitch.c \
  /lib/mozjpeg/.libs/libjpeg.a
