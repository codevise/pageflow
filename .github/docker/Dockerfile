FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive
ENV LANG=C.UTF-8

# Build dependencies for Ruby and native gem extensions
RUN apt-get update && apt-get install -y --no-install-recommends \
      autoconf bison build-essential ca-certificates curl git gnupg \
      libffi-dev libgdbm-dev libmysqlclient-dev libncurses5-dev \
      libreadline-dev libssl-dev libyaml-dev software-properties-common \
      tzdata zlib1g-dev \
    && rm -rf /var/lib/apt/lists/*

# Ruby
ARG RUBY_VERSION=3.4.3
RUN curl -fsSL "https://cache.ruby-lang.org/pub/ruby/${RUBY_VERSION%.*}/ruby-${RUBY_VERSION}.tar.gz" | tar xz \
    && cd ruby-${RUBY_VERSION} \
    && ./configure --disable-install-doc \
    && make -j"$(nproc)" \
    && make install \
    && cd .. && rm -rf ruby-${RUBY_VERSION} \
    && gem update --system && gem install bundler

# Node.js 22
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Yarn
RUN corepack enable && corepack prepare yarn@1 --activate

# System packages for image processing and tests
RUN apt-get update && apt-get install -y --no-install-recommends \
      imagemagick \
      libvips-dev \
    && rm -rf /var/lib/apt/lists/*

# audiowaveform via PPA
RUN add-apt-repository -y ppa:chris-needham/ppa \
    && apt-get update \
    && apt-get install -y audiowaveform \
    && rm -rf /var/lib/apt/lists/*

# Google Chrome for JS integration tests
RUN curl -fsSL https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb -o /tmp/chrome.deb \
    && apt-get update && apt-get install -y /tmp/chrome.deb \
    && rm /tmp/chrome.deb && rm -rf /var/lib/apt/lists/*
