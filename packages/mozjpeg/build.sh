#!/bin/bash

set -e

cd /build

echo "Building wasm-codecs-mozjpeg.."
emcc \
  --bind \
  -s ALLOW_MEMORY_GROWTH=1 \
  -s MODULARIZE=1 \
  -s WASM=1 \
  -Oz \
  -flto \
  --llvm-lto 1 \
  -s FILESYSTEM=0 \
  -I /lib/mozjpeg \
  -s 'EXPORT_NAME="mozjpeg"' \
  -Werror \
  -Wno-deprecated-register \
  -Wno-writable-strings \
  -x c++ \
  -std=c++11 \
  -o ./lib/mozjpeg.js \
  ./src/mozjpeg.cpp \
  /lib/mozjpeg/rdswitch.c \
  /lib/mozjpeg/.libs/libjpeg.a
