import jQuery from 'jquery';
import IScroll from 'iscroll';
import _ from 'underscore';
import {state} from '../state';

(function($) {
  /**
   * Wrapper widget around iScroll adding special bump events which
   * are triggered when scrolling to the very top or very bottom
   * (called boundary posititon below).
   * @private
   */
  $.widget('pageflow.scroller', {
    dragThreshold: 50,
    maxXDelta: 50,
    maxYDelta: 50,
    doubleBumpThreshold: 500,

    _create: function() {
      this.eventListenerTarget = this.options.eventListenerTarget ?
        $(this.options.eventListenerTarget) :
        this.element;

      this.iscroll = new IScroll(this.element[0], _.extend({
        mouseWheel: true,
        bounce: false,
        keyBindings: true,
        probeType: 2,
        preventDefault: false,
        eventListenerTarget: this.eventListenerTarget[0]
      }, _.pick(this.options, 'freeScroll', 'scrollX', 'noMouseWheelScrollX')));

      this.iscroll.disable();

      if (state.entryData.getThemingOption('page_change_by_scrolling')) {
        this._initMousewheelBump('up');
        this._initMousewheelBump('down');
        this._initDragGestureBump();
      }

      this._initKeyboardBump('up');
      this._initKeyboardBump('down');
      this._initNearBottomEvents();
      this._initNearTopEvents();
      this._initMoveEvents();

      this._onScrollEndCallbacks = new $.Callbacks();
    },

    enable: function() {
      this.iscroll.enable();
      this.iscroll.refresh();
    },

    resetPosition: function(options) {
      options = options || {};

      this.iscroll.refresh();

      if (options.position === 'bottom') {
        this.iscroll.scrollTo(0, this.iscroll.maxScrollY, 0);
      }
      else {
        this.iscroll.scrollTo(0, 0, 0);
      }

      this._triggerBoundaryEvents();
    },

    scrollBy: function(deltaX, deltaY, time, easing) {
      this.scrollTo(
        this.iscroll.x + deltaX,
        this.iscroll.y + deltaY,
        time,
        easing
      );
    },

    scrollTo: function(x, y, time, easing) {
      this.iscroll.scrollTo(
        Math.max(Math.min(x, 0), this.iscroll.maxScrollX),
        Math.max(Math.min(y, 0), this.iscroll.maxScrollY),
        time,
        easing
      );
      this._onScrollEndCallbacks.fire();
    },

    refresh: function() {
      this.iscroll.refresh();
    },

    afterAnimationHook: function() {
      this._triggerBoundaryEvents();
    },

    disable: function() {
      this.iscroll.disable();
    },

    positionX: function() {
      return this.iscroll.x;
    },

    positionY: function() {
      return this.iscroll.y;
    },

    maxX: function() {
      return this.iscroll.maxScrollX;
    },

    maxY: function() {
      return this.iscroll.maxScrollY;
    },

    onScroll: function(callback) {
      this.iscroll.on('scroll', callback);
    },

    onScrollEnd: function(callback) {
      this.iscroll.on('scrollEnd', callback);
      this._onScrollEndCallbacks.add(callback);
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

    _triggerBoundaryEvents: function() {
      this._triggerNearTopEvents();
      this._triggerNearBottomEvents();
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

    // Whenever the a mousewheel event is triggered, we test whether
    // the scroller is at the very top or at the very bottom. If so,
    // we trigger a hintdown or hintup event the first time the mouse
    // wheel turns and a bumpup or bumpdown event when the mouse wheel
    // is turned to times in a short period of time.
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

    // Trigger bumpup or bumpdown event when the a up/down key is
    // pressed while the scroller in boundary position.
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

    // Trigger bumpup or bumpdown when the user drags the page from a
    // boundary position. Trigger bumpleft or bumpright if user drags
    // horizontally.
    _initDragGestureBump: function() {
      var allowUp = false,
          allowDown = false,
          allowLeft = false,
          allowRight = false,
          startX, startY;

      this.eventListenerTarget.on('touchstart MSPointerDown pointerdown', _.bind(function(event) {
        var point = event.originalEvent.touches ?
                    event.originalEvent.touches[0] : event.originalEvent;

        startX = point.pageX;
        startY = point.pageY;

        if (!this._isNonTouchPointer(event)) {
          allowDown = this._atBoundary('down');
          allowUp = this._atBoundary('up');
          allowLeft = true;
          allowRight = true;
        }
      }, this));

      this.eventListenerTarget.on('touchmove MSPointerMove pointermove', _.bind(function(event) {
        var point = event.originalEvent.touches ?
                    event.originalEvent.touches[0] : event.originalEvent;

        var deltaX = point.pageX - startX;
        var deltaY = point.pageY - startY;

        if (Math.abs(deltaX) > this.maxXDelta) {
          allowDown = allowUp = false;
        }

        if (Math.abs(deltaY) > this.maxYDelta) {
          allowLeft = allowRight = false;
        }

        if (allowUp && deltaY > this.dragThreshold) {
          this._trigger('bumpup');
          allowDown = allowUp = allowLeft = allowRight = false;
        }
        else if (allowDown && deltaY < -this.dragThreshold) {
          this._trigger('bumpdown');
          allowDown = allowUp = allowLeft = allowRight = false;
        }
        else if (allowLeft && deltaX > this.dragThreshold) {
          this._trigger('bumpleft');
          allowDown = allowUp = allowLeft = allowRight = false;
        }
        else if (allowRight && deltaX < -this.dragThreshold) {
          this._trigger('bumpright');
          allowDown = allowUp = allowLeft = allowRight =false;
        }
      }, this));

      this.eventListenerTarget.on('touchend MSPointerUp pointerup', _.bind(function(event) {
        var point = event.originalEvent.touches ?
                    event.originalEvent.changedTouches[0] : event.originalEvent;

        var deltaX = point.pageX - startX;
        var deltaY = point.pageY - startY;

        if (allowUp && deltaY > 0) {
          this._trigger('hintup');
        }
        else if (allowDown && deltaY < 0) {
          this._trigger('hintdown');
        }

        if (allowLeft && deltaX > 0) {
          this._trigger('hintleft');
        }
        else if (allowRight && deltaX < 0) {
          this._trigger('hintright');
        }
      }, this));
    },

    _isNonTouchPointer: function(event) {
      return event.originalEvent.pointerType &&
             event.originalEvent.pointerType !== event.originalEvent.MSPOINTER_TYPE_TOUCH &&
             event.originalEvent.pointerType !== 'touch';
    },

    // Checks whether the scroller is at the very top or very bottom.
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
