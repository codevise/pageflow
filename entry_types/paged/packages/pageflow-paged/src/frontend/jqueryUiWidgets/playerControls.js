import $ from 'jquery';

$.widget('pageflow.playerControls', {
  _create: function() {
    var player = this.options.player;

    var playButton = this.element.find('.vjs-play-control');
    var progressHolder = this.element.find('.vjs-progress-holder');
    var playProgress = this.element.find('.vjs-play-progress');
    var currentTimeDisplay = this.element.find('.vjs-current-time-display');
    var durationDisplay = this.element.find('.vjs-duration-display');
    var progressHandler = this.element.find('.vjs-slider-handle');
    var smallTimestamp = durationDisplay.html().length === 5 && durationDisplay.html().charAt(0) === "0";

    if(smallTimestamp) {
      durationDisplay.html("0:00");
      currentTimeDisplay.html(currentTimeDisplay.html().substr(1));
    }
    else {
      durationDisplay.html("00:00");
    }

    player.on('timeupdate', function (position, duration) {
      var percent = duration > 0 ? (player.position / player.duration) * 100 : 0;

      if (!isNaN(position)) {
        if (player.duration < 600) {
          $(currentTimeDisplay).html(player.formatTime(position).substr(1));
          $(durationDisplay).html(player.formatTime(duration).substr(1));
        }
        else {
          $(currentTimeDisplay).html(player.formatTime(position));
          $(durationDisplay).html(player.formatTime(duration));
        }
      }

      var handlerLeft = ((progressHolder.width() - progressHandler.width()) * percent / 100);

      progressHandler.css({left: handlerLeft + 'px'});
      playProgress.css({width: percent + "%"});
    });

    player.on('play', function (position, duration) {
      $(playButton).removeClass('vjs-play');
      $(playButton).addClass('vjs-pause vjs-playing');
    });

    player.on('pause', function (position, duration) {
      $(playButton).removeClass('vjs-pause vjs-playing');
      $(playButton).addClass('vjs-play');
    });

    player.on('ended', function (position, duration) {
      $(playButton).removeClass('vjs-pause vjs-playing');
      $(playButton).addClass('vjs-play');
    });

    function togglePlay() {
      if (player.playing) {
        player.pause();
      }
      else {
        player.play();
      }
    }

    playButton.on({
      'mousedown touchstart': function() {
        $(this).addClass('pressed');
      },
      'mouseup touchend': function() {
        $(this).removeClass('pressed');
      },
      'click': function() {
        togglePlay();
      },
      'keypress': function(e) {
        if (e.which == 13) {
          var that = this;

          togglePlay();
          setTimeout(function() {
            $(that).focus();
          }, 20);
        }
      }
    });

    $(progressHolder).on('mousedown touchstart', function(event) {
      player.seek(getSeekPosition(event));

      $('body').on({
        'mousemove touchmove': onMouseMove,
        'mouseup touchend': onMouseUp
      });

      function onMouseMove(event) {
        player.seek(getSeekPosition(event));
      }

      function onMouseUp() {
        $('body').off({
          'mousemove touchmove': onMouseMove,
          'mouseup touchend': onMouseUp
        });
      }

      function getSeekPosition(event) {
        var position = getPointerPageX(event) - $(progressHolder).offset().left;
        var fraction = position / $(progressHolder).width();

        return Math.min(Math.max(fraction, 0), 1) * player.duration;
      }

      function getPointerPageX(event) {
        if (event.originalEvent.changedTouches) {
          return event.originalEvent.changedTouches[0].pageX;
        } else {
          return event.pageX;
        }
      }
    });
  }
});
