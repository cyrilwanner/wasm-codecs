#!/bin/bash

set -e

cd /build

echo "Building wasm-codecs-oxipng.."
wasm-pack build --target nodejs --out-name oxipng
wasm-strip ./pkg/oxipng_bg.wasm

mv ./pkg/oxipng_bg.wasm ./lib/oxipng_bg.wasm
mv ./pkg/oxipng.js ./lib/oxipng.js
rm -rf ./pkg
