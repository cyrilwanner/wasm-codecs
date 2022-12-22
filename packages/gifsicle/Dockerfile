ARG EMSCRIPTEN_VERSION=3.1.28
FROM emscripten/emsdk:${EMSCRIPTEN_VERSION}

RUN apt-get update && \
  apt-get install -y \
    autoconf \
    libtool \
    libpng-dev \
    pkg-config && \
  rm -rf /var/lib/apt/lists/*

RUN curl https://codeload.github.com/kohler/gifsicle/zip/v1.92 -o /tmp/gifsicle.zip && \
  unzip /tmp/gifsicle.zip -d /lib && \
  mv /lib/gifsicle-1.92 /lib/gifsicle && \
  rm /tmp/gifsicle.zip

RUN cd /lib/gifsicle && \
  sed -i 's/CC="$CC -W -Wall"/CC="$CC -W -Wall -s ERROR_ON_UNDEFINED_SYMBOLS=0"/g' configure.ac && \
  ./bootstrap.sh && \
  emconfigure ./configure --disable-gifview && \
  emmake make
