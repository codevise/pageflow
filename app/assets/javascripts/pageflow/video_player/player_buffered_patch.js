// look for maximal buffered time range instead of first
vjs.Player.prototype.buffered = function(){
  var buffered = this.techGet('buffered'),
      max = 0,
      start = 0,
      // Default end to 0 and store in values
      end = this.cache_.bufferEnd = this.cache_.bufferEnd || 0;

  if (buffered && buffered.length > 0) {
    for (var i = 0; i < buffered.length; i++) {
      if (getEnd(buffered, i) > max) {
        max = getEnd(buffered, i);
      }
    }

    if (max !== end) {
      end = max;
      // Storing values allows them be overridden by setBufferedFromProgress
      this.cache_.bufferEnd = max;
    }
  }

  return vjs.createTimeRange(start, end);

  function getEnd(buffered, i) {
    // Firefox 32 sometimes reports negative values as start and
    // end. If both are negative, treat difference as end time stamp.
    if (buffered.start(i) < 0 && buffered.end(i) < 0) {
      return buffered.end(i) - buffered.start(i);
    }
    else {
      return buffered.end(i);
    }
  }
};

// If end is after duration return buffered percent 0
vjs.Player.prototype.bufferedPercent = function(){
  // Sometimes duration is rounded to less digits than end causing end
  // to be just a little bit greater. Therefore round.
  if (this.duration() && Math.floor(this.buffered().end(0)) <= this.duration()) {
    return this.buffered().end(0) / this.duration();
  }
  else {
    return 0;
  }
};