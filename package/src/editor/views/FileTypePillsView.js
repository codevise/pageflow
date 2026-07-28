import $ from 'jquery';
import I18n from 'i18n-js';
import Marionette from 'backbone.marionette';

import template from '../templates/fileTypePills.jst';
import pillTemplate from '../templates/fileTypePill.jst';

export const FileTypePillsView = Marionette.ItemView.extend({
  template,
  className: 'file_type_pills',

  ui: {
    group: '.file_type_pills-group'
  },

  initialize: function() {
    this.options.fileTypes.forEach(function(fileType) {
      this.listenTo(filesOfType(this.options.entry, fileType), 'add remove', this.update);
    }, this);
  },

  onRender: function() {
    this.pillViews = this.options.fileTypes.map(function(fileType) {
      var pillView = new FileTypePillView({
        fileType: fileType,
        fileTypes: this.options.fileTypes,
        fileTypeSelection: this.options.fileTypeSelection,
        entry: this.options.entry
      });

      this.appendSubview(pillView, {to: this.ui.group});

      return pillView;
    }, this);

    this.handleDocumentKeyEvent = this.handleDocumentKeyEvent.bind(this);
    this.handleWindowBlur = this.handleWindowBlur.bind(this);

    $(document).on('keydown keyup', this.handleDocumentKeyEvent);
    $(window).on('blur', this.handleWindowBlur);

    this.update();
  },

  onClose: function() {
    Marionette.ItemView.prototype.onClose.call(this);

    $(document).off('keydown keyup', this.handleDocumentKeyEvent);
    $(window).off('blur', this.handleWindowBlur);
  },

  // Pills state which file types the list holds, which is of interest
  // even while files of only one type are present. Filtering by that
  // single type is pointless, though, so the hint about filtering only
  // shows up once there is more than one type to choose from.
  update: function() {
    var present = presentFileTypes(this.options.entry, this.options.fileTypes);

    this.$el.toggle(present.length > 0);

    this.ui.group.attr('title', present.length > 1 ? this.hint() : null);

    (this.pillViews || []).forEach(function(pillView) {
      pillView.update();
    });
  },

  hint: function() {
    return I18n.t('pageflow.editor.views.file_type_pills_view.hint');
  },

  handleDocumentKeyEvent: function(event) {
    this.toggleCombining(event.metaKey || event.ctrlKey);
  },

  // Releasing the modifier key outside of the window would go unnoticed.
  handleWindowBlur: function() {
    this.toggleCombining(false);
  },

  toggleCombining: function(combining) {
    this.pillViews.forEach(function(pillView) {
      pillView.toggleCombining(combining);
    });
  }
});

const FileTypePillView = Marionette.ItemView.extend({
  template: pillTemplate,
  tagName: 'button',
  className: 'file_type_pills-pill',

  attributes: {
    type: 'button'
  },

  events: {
    'click': function(event) {
      this.applyToSelection(event.metaKey || event.ctrlKey);
    },

    // Browsers do not activate buttons on enter while a modifier key is held.
    'keydown': function(event) {
      if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        this.applyToSelection(true);
      }
    }
  },

  initialize: function() {
    this.listenTo(this.options.fileTypeSelection, 'change:collectionNames', this.update);

    this.listenTo(this.options.entry,
                  'change:uploading_' + this.collectionName() + '_count',
                  this.update);

    this.listenTo(this.files(), 'add remove', this.update);
  },

  serializeData: function() {
    return {
      label: I18n.t('pageflow.editor.files.tabs.' + this.collectionName())
    };
  },

  onRender: function() {
    this.update();
  },

  update: function() {
    var onlyPresentType = this.isOnlyPresentType();

    // The pill of the only file type present states that the list holds
    // files of that type, which cannot be turned off.
    var selected = onlyPresentType ||
                   this.options.fileTypeSelection.isSelected(this.collectionName());

    this.$el.attr('aria-pressed', selected ? 'true' : 'false');
    this.$el.toggleClass('active', selected);
    this.$el.toggleClass('only_type', onlyPresentType);
    this.$el.toggleClass('only_active', this.isOnlyActive());
    this.$el.toggleClass('removable', this.isRemovable());
    this.$el.toggleClass('addable', this.isAddable());
    this.$el.toggleClass('spinner', this.uploadingCount() > 0);
    this.$el.toggle(this.files().length > 0);
  },

  toggleCombining: function(combining) {
    this.combining = combining;
    this.update();
  },

  applyToSelection: function(combining) {
    if (this.isOnlyPresentType()) {
      return;
    }

    if (combining) {
      this.options.fileTypeSelection.toggle(this.collectionName());
    }
    else {
      this.options.fileTypeSelection.selectOnly(this.collectionName());
    }
  },

  // Clicking a pill only removes its file type from the selection while
  // the modifier key is held. Otherwise it narrows the selection down to
  // that single type, unless it is selected on its own already.
  isRemovable: function() {
    if (this.isOnlyPresentType() ||
        !this.options.fileTypeSelection.isSelected(this.collectionName())) {
      return false;
    }

    return this.combining || this.isOnlyActive();
  },

  // Clicking a pill only adds its file type to the selection while the
  // modifier key is held. Otherwise it replaces the selection.
  isAddable: function() {
    return !!this.combining &&
           !this.isOnlyPresentType() &&
           !this.options.fileTypeSelection.isSelected(this.collectionName());
  },

  isOnlyActive: function() {
    return !this.isOnlyPresentType() &&
           this.options.fileTypeSelection.isOnlySelected(this.collectionName());
  },

  isOnlyPresentType: function() {
    var present = presentFileTypes(this.options.entry, this.options.fileTypes);

    return present.length === 1 && present[0] === this.options.fileType;
  },

  collectionName: function() {
    return this.options.fileType.collectionName;
  },

  uploadingCount: function() {
    return this.options.entry.get('uploading_' + this.collectionName() + '_count');
  },

  files: function() {
    return filesOfType(this.options.entry, this.options.fileType);
  }
});

function presentFileTypes(entry, fileTypes) {
  return fileTypes.filter(function(fileType) {
    return filesOfType(entry, fileType).length > 0;
  });
}

function filesOfType(entry, fileType) {
  return entry.getFileCollection(fileType);
}
