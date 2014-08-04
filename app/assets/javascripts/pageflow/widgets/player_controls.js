jQuery.widget('pageflow.playerControls', {
  _create: function() {
    var player = this.options.player;

    var playButton = this.element.find('.vjs-play-control');
    var progressHolder = this.element.find('.vjs-progress-holder');
    var playProgress = this.element.find('.vjs-play-progress');
    var currentTimeDisplay = this.element.find('.vjs-current-time-display');
    var durationDisplay = this.element.find('.vjs-duration-display');
    var progressHandler = this.element.find('.vjs-slider-handle');
    var seeking = false;
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

      $(progressHandler).css({left: percent + "%"});
      $(playProgress).css({width: percent + "%"});
    });

    player.on('play', function (position, duration) {
      $(playButton).removeClass('vjs-play');
      $(playButton).addClass('vjs-pause');
    });

    player.on('pause', function (position, duration) {
      $(playButton).removeClass('vjs-pause');
      $(playButton).addClass('vjs-play');
    });

    player.on('ended', function (position, duration) {
      $(playButton).removeClass('vjs-pause');
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
      var newProgress = (event.pageX - $(progressHolder).offset().left) / $(progressHolder).width();
      player.seek(newProgress * player.duration);

      $('body').on({
        'mousemove touchmove': onMouseMove,
        'mouseup touchend': onMouseUp
      });

      function onMouseMove(event) {
        var pageX;
        if(event.originalEvent.changedTouches || event.originalEvent.touches) {
          pageX = event.originalEvent.changedTouches[0].pageX || event.originalEvent.touches[0].pageX;
        } else {
          pageX = event.pageX;
        }
        var newProgress = (pageX - $(progressHolder).offset().left) / $(progressHolder).width();

        if (newProgress > 1) { newProgress = 1; }
        if (newProgress < 0) { newProgress = 0; }

        player.seek(newProgress * player.duration);
      }

      function onMouseUp() {
        $('body').off({
          'mousemove touchmove': onMouseMove,
          'mouseup touchend': onMouseUp
        });
      }
    });
  }
});