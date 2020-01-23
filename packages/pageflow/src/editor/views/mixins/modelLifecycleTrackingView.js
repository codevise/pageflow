import {editor} from '../../base';

/**
 * Mixin for Marionette Views that sets css class names according to
 * life cycle events of its model.
 *
 * @param {Object} options
 * @param {Object} options.classNames
 * @param {String} options.classNames.creating -
 *   Class name to add to root element while model is still being created.
 * @param {String} options.classNames.destroying -
 *   Class name to add to root element while model is being destroyed.
 * @param {String} options.classNames.failed -
 *   Class name to add to root element while model is in failed state.
 *   Model needs to include {@link failureTracking} mixin.
 * @param {String} options.classNames.failureMessage -
 *   Class name of the element that shall be updated with the failure
 *   message. Model needs to include {@link failureTracking} mixin.
 * @param {String} options.classNames.retryButton -
 *   Class name of the element that shall act as a retry button.
 */
export function modelLifecycleTrackingView({classNames}) {
  return {
    events: {
      [`click .${classNames.retryButton}`]: function() {
        editor.failures.retry();
        return false;
      }
    },

    initialize() {
      if (classNames.creating) {
        this.listenTo(this.model, 'change:id', function() {
          this.$el.removeClass(classNames.creating);
        });
      }

      if (classNames.destroying) {
        this.listenTo(this.model, 'destroying', function() {
          this.$el.addClass(classNames.destroying);
        });

        this.listenTo(this.model, 'error', function() {
          this.$el.removeClass(classNames.destroying);
        });
      }

      if (classNames.failed || classNames.failureMessage) {
        this.listenTo(this.model, 'change:failed', () => this.updateFailIndicator());
      }
    },

    render() {
      if (this.model.isNew()) {
        this.$el.addClass(classNames.creating);
      }

      if (this.model.isDestroying && this.model.isDestroying()) {
        this.$el.addClass(classNames.destroying);
      }

      this.updateFailIndicator();
    },

    updateFailIndicator: function() {
      if (classNames.failed) {
        this.$el.toggleClass(classNames.failed, this.model.isFailed());
      }

      if (classNames.failureMessage) {
        this.$el.find(`.${classNames.failureMessage}`).text(this.model.getFailureMessage());
      }
    }
  };
}
