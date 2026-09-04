import $ from 'jquery';
import Marionette from 'backbone.marionette';
import _ from 'underscore';
import {arrow, autoUpdate, computePosition, offset, shift, size} from '@floating-ui/dom';

import {CollectionView} from 'pageflow/ui';

import {FileMetaDataItemView} from './FileMetaDataItemView';
import {FileReferencesView} from './FileReferencesView';
import {FileStageItemView} from './FileStageItemView';
import {TextFileMetaDataItemValueView} from './TextFileMetaDataItemValueView';

import template from '../templates/fileMetaDataOverlay.jst';

const DISTANCE_FROM_THUMBNAIL = 8;
const DISTANCE_FROM_VIEWPORT_EDGE = 8;

// Long enough to move the pointer from the thumbnail across the gap
// into the overlay.
const DISMISS_DELAY = 300;

// Below this the preview no longer tells the file apart, so the content
// scrolls rather than scaling the preview away.
const MIN_PREVIEW_HEIGHT = 96;

export const FileMetaDataOverlayView = Marionette.ItemView.extend({
  template,
  className: 'file_meta_data_overlay',

  ui: {
    arrow: '.file_meta_data_overlay-arrow',
    content: '.file_meta_data_overlay-content',
    preview: '.file_meta_data_overlay-preview',
    stageItems: '.file_stage_items',
    metaData: 'tbody.attributes',
    fileReferences: '.file_meta_data_overlay-file_references',
    downloads: 'tbody.downloads',
    downloadLink: 'a.original'
  },

  events: {
    'mouseenter': 'cancelDismiss',
    'mouseleave': 'scheduleDismiss',

    // Editing happens in a dialog which the overlay would otherwise
    // linger in front of.
    'click .file_meta_data button.edit': 'dismiss'
  },

  modelEvents: {
    'change': 'update',
    'change:state': 'renderPreview'
  },

  initialize: function() {
    _.bindAll(this, 'handleOutsideClick');
  },

  onRender: function() {
    this.update();

    this.subview(new CollectionView({
      el: this.ui.stageItems,
      collection: this.model.currentStages,
      itemViewConstructor: FileStageItemView
    }));

    this.listenTo(this.model.currentStages, 'add remove', this.updateStages);
    this.updateStages();

    _.each(this.metaDataViews(), function(view) {
      this.ui.metaData.append(this.subview(view).el);
    }, this);

    if (this.options.fileReferences) {
      this.appendSubview(new FileReferencesView({
        model: this.model,
        fileReferences: this.options.fileReferences
      }), {to: this.ui.fileReferences});
    }
  },

  // Only exists while the overlay is open, so that videos of other
  // files do not keep loading and playing in the background. Rerendered
  // on state changes since files only get a preview once they have
  // finished processing.
  renderPreview: function() {
    this.closePreview();

    if (this.isClosed || !this.isOpen()) {
      return;
    }

    this.previewView = this.model.createPreviewView();

    if (this.previewView) {
      this.ui.preview.append(this.previewView.render().el);
    }

    this.ui.preview.toggle(!!this.previewView);
  },

  closePreview: function() {
    if (this.previewView) {
      this.previewView.close();
      this.previewView = null;
    }

    if (!this.isClosed) {
      this.ui.preview.hide();
    }
  },

  update: function() {
    if (this.isClosed) {
      return;
    }

    this.ui.downloadLink.attr('href', this.model.get('download_url'));
    this.ui.downloads.toggle(this.model.isUploaded() &&
                             !_.isEmpty(this.model.get('download_url')));
  },

  // The separator would otherwise linger once the file is done.
  updateStages: function() {
    this.ui.stageItems.toggle(!!this.model.currentStages.length);
  },

  metaDataViews: function() {
    var model = this.model;

    return _.map(this.options.metaDataAttributes, function(options) {
      if (typeof options === 'string') {
        options = {
          name: options,
          valueView: TextFileMetaDataItemValueView
        };
      }

      return new FileMetaDataItemView(_.extend({
        model: model
      }, options));
    });
  },

  isOpen: function() {
    return !!this.stopAutoUpdate;
  },

  isLocked: function() {
    return !!this.locked;
  },

  // Hovering another thumbnail must not take away an overlay which has
  // been pinned by clicking it.
  openUnlessPinned: function() {
    if (FileMetaDataOverlayView.currentlyOpen?.isLocked()) {
      return;
    }

    this.open();
  },

  // Only one overlay at a time, since they would otherwise pile up on
  // top of each other next to the list.
  open: function() {
    this.cancelDismiss();

    if (this.isOpen()) {
      return;
    }

    FileMetaDataOverlayView.currentlyOpen?.dismiss();
    FileMetaDataOverlayView.currentlyOpen = this;

    this.$el.addClass('is_open');
    this.stopAutoUpdate = autoUpdate(this.options.reference,
                                     this.el,
                                     this.position.bind(this));

    this.renderPreview();
    this.trigger('toggle');
  },

  // Hovering only opens the overlay for as long as the pointer stays on
  // the thumbnail or the overlay itself. Clicking pins it.
  toggleLock: function() {
    if (this.isLocked()) {
      this.unlock();
    }
    else {
      this.open();
      this.lock();
    }
  },

  lock: function() {
    this.locked = true;

    // Binding on the next tick keeps the very click which locked the
    // overlay from dismissing it again.
    this.bindOutsideClickTimeout = setTimeout(() => {
      $(document).on('click', this.handleOutsideClick);
    }, 0);
  },

  unlock: function() {
    this.locked = false;

    clearTimeout(this.bindOutsideClickTimeout);
    $(document).off('click', this.handleOutsideClick);
  },

  handleOutsideClick: function(event) {
    if (this.el.contains(event.target) ||
        this.options.reference.contains(event.target)) {
      return;
    }

    this.dismiss();
  },

  scheduleDismiss: function() {
    if (this.isLocked()) {
      return;
    }

    this.dismissTimeout = setTimeout(this.dismiss.bind(this), DISMISS_DELAY);
  },

  cancelDismiss: function() {
    clearTimeout(this.dismissTimeout);
  },

  dismiss: function() {
    this.cancelDismiss();
    this.unlock();

    if (!this.isOpen()) {
      return;
    }

    this.stopAutoUpdate();
    this.stopAutoUpdate = null;

    if (FileMetaDataOverlayView.currentlyOpen === this) {
      FileMetaDataOverlayView.currentlyOpen = null;
    }

    this.closePreview();
    this.$el.removeClass('is_open');
    this.trigger('toggle');
  },

  position: function() {
    return computePosition(this.options.reference, this.el, {
      placement: 'left',
      middleware: [
        offset(DISTANCE_FROM_THUMBNAIL),
        shift({padding: DISTANCE_FROM_VIEWPORT_EDGE}),
        size({
          padding: DISTANCE_FROM_VIEWPORT_EDGE,
          apply: this.applyAvailableHeight.bind(this)
        }),
        arrow({element: this.ui.arrow[0]})
      ]
    }).then(this.applyPosition.bind(this));
  },

  // Keeps the overlay inside the viewport next to short rows and on
  // short screens. Whatever the rest of the overlay does not need is
  // left for the preview to scale itself down into.
  applyAvailableHeight: function({availableHeight}) {
    if (this.isClosed) {
      return;
    }

    var content = this.ui.content[0];
    var borders = this.el.offsetHeight - content.offsetHeight;
    var available = Math.max(0, availableHeight - borders);
    var previewHeight = this.ui.preview.outerHeight(true) || 0;

    this.el.style.setProperty('--available-height', `${available}px`);
    this.el.style.setProperty(
      '--preview-max-height',
      `${Math.max(MIN_PREVIEW_HEIGHT,
                  available - (content.scrollHeight - previewHeight))}px`
    );
  },

  // Positioning is async, so the view can already be gone by the time
  // the position has been computed.
  applyPosition: function({x, y, middlewareData}) {
    if (this.isClosed) {
      return;
    }

    var arrowElement = this.ui.arrow[0];

    this.el.style.left = `${x}px`;
    this.el.style.top = `${y}px`;

    // Half of the arrow sticks out of the overlay to point at the
    // thumbnail.
    arrowElement.style.right = `${-arrowElement.offsetWidth / 2}px`;

    if (middlewareData.arrow?.y != null) {
      arrowElement.style.top = `${middlewareData.arrow.y}px`;
    }
  },

  onClose: function() {
    Marionette.ItemView.prototype.onClose.call(this);

    this.closePreview();
    this.dismiss();
  }
});
