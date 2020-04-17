import $ from 'jquery';
import {assetUrls} from 'pageflow/frontend';

export const bandwidth = function() {
  var maxLoadTime = 5000;

  bandwidth.promise =   bandwidth.promise || new $.Deferred(function(deferred) {
    var smallFileUrl = assetUrls.smallBandwidthProbe + "?" + new Date().getTime(),
        largeFileUrl = assetUrls.largeBandwidthProbe + "?" + new Date().getTime(),
        smallFileSize = 165,
        largeFileSize = 1081010;

    $.when(timeFile(smallFileUrl), timeFile(largeFileUrl))
      .done(function(timeToLoadSmallFile, timeToLoadLargeFile) {
        var timeDelta = (timeToLoadLargeFile - timeToLoadSmallFile) / 1000;
        var bitsDelta = (largeFileSize - smallFileSize) * 8;

        timeDelta = Math.max(timeDelta, 0.01);

        deferred.resolve({
          durationInSeconds: timeDelta,
          speedInBps: (bitsDelta / timeDelta).toFixed(2)
        });
      })
      .fail(function() {
        deferred.resolve({
          durationInSeconds: Infinity,
          speedInBps: 0
        });
      });
  }).promise();

  return bandwidth.promise;

  function timeFile(url) {
    var startTime = new Date().getTime();

    return withTimeout(loadFile(url), maxLoadTime).pipe(function() {
      return new Date().getTime() - startTime;
    });
  }

  function loadFile(url, options) {
    return new $.Deferred(function(deferred) {
      var image = new Image();

      image.onload = deferred.resolve;
      image.onerror = deferred.reject;

      image.src = url;
    }).promise();
  }

  function withTimeout(promise, milliseconds) {
    return new $.Deferred(function(deferred) {
      var timeout = setTimeout(function() {
        deferred.reject();
      }, milliseconds);

      promise
        .always(function() {
          clearTimeout(timeout);
        })
        .then(deferred.resolve, deferred.reject);
    }).promise();
  }
};