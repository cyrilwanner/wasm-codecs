FROM trzeci/emscripten:1.39.18-upstream

RUN apt-get update && \
  apt-get install -y \
    autoconf \
    libtool \
    libpng-dev \
    pkg-config && \
  rm -rf /var/lib/apt/lists/*

RUN curl https://codeload.github.com/mozilla/mozjpeg/zip/v3.3.1 -o /tmp/mozjpeg.zip && \
  unzip /tmp/mozjpeg.zip -d /lib && \
  mv /lib/mozjpeg-3.3.1 /lib/mozjpeg && \
  rm /tmp/mozjpeg.zip

RUN cd /lib/mozjpeg && \
  autoreconf -fiv && \
  emconfigure ./configure --without-simd && \
  emmake make libjpeg.la -j`nproc`
