/*global IScroll*/
(function($) {
  /**
   * Wrapper widget around iScroll adding special bump events which
   * are triggered when scrolling to the very top or very bottom
   * (called boundary posititon below).
   */
  $.widget('pageflow.scroller', {
    dragThreshold: 50,
    maxXDelta: 50,
    doubleBumpThreshold: 500,

    _create: function() {
      this.iscroll = new IScroll(this.element[0], {
        mouseWheel: true,
        bounce: false,
        keyBindings: true,
        probeType: 2,
        preventDefault: false
      });

      this.iscroll.disable();

      this._initMousewheelBump('up');
      this._initMousewheelBump('down');
      this._initKeyboardBump('up');
      this._initKeyboardBump('down');
      this._initDragGestureBump();
      this._initNearBottomEvents();
      this._initNearTopEvents();
      this._initMoveEvents();
    },

    enable: function() {
      this.iscroll.enable();
      this.iscroll.refresh();
    },

    resetPosition: function(options) {
      options = options || {};

      if (options.position === 'bottom') {
        this.iscroll.scrollTo(0, this.iscroll.maxScrollY, 0);
      }
      else {
        this.iscroll.scrollTo(0, 0, 0);
      }
    },

    refresh: function() {
      this.iscroll.refresh();
    },

    afterAnimationHook: function() {
      this._triggerNearBottomEvents();
    },

    disable: function() {
      this.iscroll.disable();
    },

    positionY: function() {
      return this.iscroll.y;
    },

    _initMoveEvents: function() {
      this.iscroll.on('mousewheelup', _.bind(this._triggerMoveEvent, this));
      this.iscroll.on('mousewheeldown', _.bind(this._triggerMoveEvent, this));
      this.iscroll.on('afterkeyboard', _.bind(this._triggerMoveEvent, this));
    },

    _triggerMoveEvent: function() {
      this._trigger('move');
    },

    _initNearBottomEvents: function() {
      this.iscroll.on('scroll', _.bind(this._triggerNearBottomEvents, this));
      this.iscroll.on('scrollEnd', _.bind(this._triggerNearBottomEvents, this));
      this.iscroll.on('afterkeyboard', _.bind(this._triggerNearBottomEvents, this));
    },

    _initNearTopEvents: function() {
      this.iscroll.on('scroll', _.bind(this._triggerNearTopEvents, this));
      this.iscroll.on('scrollEnd', _.bind(this._triggerNearTopEvents, this));
      this.iscroll.on('afterkeyboard', _.bind(this._triggerNearTopEvents, this));
    },

    _triggerNearBottomEvents: function() {
      if (this._atBoundary('down', {delta: 50})) {
        this._trigger('nearbottom');
      }
      else {
        this._trigger('notnearbottom');
      }
    },

    _triggerNearTopEvents: function() {
      if (this._atBoundary('up', {delta: 50})) {
        this._trigger('neartop');
      }
      else {
        this._trigger('notneartop');
      }
    },

    /**
     * Whenever the a mousewheel event is triggered, we test whether
     * the scroller is at the very top or at the very bottom. If so,
     * we trigger a hintdown or hintup event the first time the mouse
     * wheel turns and a bumpup or bumpdown event when the mouse wheel
     * is turned to times in a short period of time.
     */
    _initMousewheelBump: function(direction) {
      var firstBump = false;

      this.iscroll.on('mousewheel' + direction, _.bind(function() {
        if (!this._atBoundary(direction)) {
          return;
        }

        if (firstBump) {
          this._trigger('bump' + direction);
          firstBump = false;

          clearTimeout(this.waitForSecondBump);
        }
        else {
          this._trigger('hint' + direction);
          firstBump = true;

          this.waitForSecondBump = setTimeout(function() {
            firstBump = false;
          }, this.doubleBumpThreshold);
        }
      }, this));
    },

    /**
     * Trigger bumpup or bumpdown event when the a up/down key is
     * pressed while the scroller in boundary position.
     */
    _initKeyboardBump: function(direction) {
      this.iscroll.on('keyboard' + direction, _.bind(function(event) {
        if (this._atBoundary(direction)) {
          // Make sure other iScrolls which might be enabled by the
          // bump event do not process the keyboard event again.
          event.stopImmediatePropagation();
          this._trigger('bump' + direction);
        }
      }, this));

      this.iscroll.on('keyboardhint' + direction, _.bind(function() {
        if (this._atBoundary(direction)) {
          this._trigger('hint' + direction);
        }
      }, this));
    },

    /**
     * Trigger bumpup or bumpdown when the user drags the page from a
     * boundary position.
     */
    _initDragGestureBump: function() {
      var allowUp = false,
          allowDown = false,
          startX, startY;

      this.element.on('touchstart MSPointerDown', _.bind(function(event) {
        var point = event.originalEvent.touches ? event.originalEvent.touches[0] : event.originalEvent;
        startX = point.pageX;
        startY = point.pageY;

        if (!isNonTouchPointer(event)) {
          allowDown = this._atBoundary('down');
          allowUp = this._atBoundary('up');
        }
      }, this));

      this.element.on('touchmove MSPointerMove', _.bind(function(event) {
        var point = event.originalEvent.touches ? event.originalEvent.touches[0] : event.originalEvent;
        var deltaX = point.pageX - startX;
        var deltaY = point.pageY - startY;

        if (Math.abs(deltaX) > this.maxXDelta) {
          allowDown = allowUp = false;
        }

        if (allowUp && deltaY > this.dragThreshold) {
          this._trigger('bumpup');
          allowDown = allowUp = false;
        }
        else if (allowDown && deltaY < -this.dragThreshold) {
          this._trigger('bumpdown');
          allowDown = allowUp = false;
        }
      }, this));

      this.element.on('touchend MSPointerUp', _.bind(function(event) {
        if (allowUp) {
          this._trigger('hintup');
        }
        if (allowDown) {
          this._trigger('hintdown');
        }
      }, this));

      function isNonTouchPointer(event) {
        return (event.originalEvent.pointerType &&
                event.originalEvent.pointerType !== event.originalEvent.MSPOINTER_TYPE_TOUCH);
      }
    },

    /**
     * Checks whether the scroller is at the very top or very bottom.
     */
    _atBoundary: function(direction, options) {
      options = options || {};
      var delta = options.delta || 0;

      if (direction === 'up') {
        return (this.iscroll.y >= -delta);
      }
      else {
        return (this.iscroll.y <= this.iscroll.maxScrollY + delta);
      }
    }
  });
}(jQuery));