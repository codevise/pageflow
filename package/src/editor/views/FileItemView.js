import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import I18n from 'i18n-js';

import {editor} from '../base';

import {DropDownButtonView} from './DropDownButtonView';
import {FileMetaDataOverlayView} from './FileMetaDataOverlayView';
import {FileSettingsDialogView} from './FileSettingsDialogView';
import {FileThumbnailView} from './FileThumbnailView';
import {MoveToFolderDialogView} from './MoveToFolderDialogView';
import {listHighlighting} from './mixins/listHighlighting';
import {loadable} from './mixins/loadable';
import {parentFolderLabel} from './mixins/parentFolderLabel';

import template from '../templates/fileItem.jst';

// Long enough to sweep past a file without its overlay showing up.
const OPEN_DELAY = 200;

export const FileItemView = Marionette.ItemView.extend({
  tagName: 'li',
  template,

  mixins: [loadable, listHighlighting, parentFolderLabel],

  ui: {
    fileName: '.file_name',
    checkBox: '.file_item-check_box',

    actions: '.actions',
    selectButton: '.select',
    settingsButton: '.settings',
    confirmButton: '.confirm',
    retryButton: '.retry',

    thumbnail: '.file_thumbnail',
    thumbnailButton: '.file_thumbnail_button'
  },

  events: {
    'click .select': 'select',

    'change .file_item-check_box': function() {
      this.options.listSelection.toggle(this.model);
    },

    'click .settings': function() {
      FileSettingsDialogView.open({
        model: this.model
      });
    },

    'click .confirm': 'confirm',

    'click .retry': 'retry',

    'mouseenter .file_thumbnail_button': 'openMetaData',

    'mouseleave .file_thumbnail_button': 'dismissMetaData',

    'click .file_thumbnail_button': 'toggleMetaDataLock'
  },

  initialize: function() {
    this.menuItems = this.createMenuItems();

    if (this.options.fileFolders) {
      this.listenTo(this.options.fileFolders, 'add remove change:id', this.updateMoveItem);
    }

    if (this.multiSelectable()) {
      this.listenTo(this.options.listSelection,
                    'add remove reset change:selecting',
                    this.updateSelected);
    }
  },

  createMenuItems: function() {
    var items = new Backbone.Collection([
      {
        name: 'move',
        label: I18n.t('pageflow.editor.templates.file_item.move')
      },
      {
        name: 'cancel',
        label: I18n.t('pageflow.editor.templates.file_item.cancel_upload')
      },
      {
        name: 'destroy',
        label: I18n.t('pageflow.editor.templates.file_item.destroy'),
        destructive: true
      }
    ]);

    items.findWhere({name: 'move'}).selected = () => this.move();
    items.findWhere({name: 'cancel'}).selected = () => this.cancel();
    items.findWhere({name: 'destroy'}).selected = () => this.destroy();

    return items;
  },

  menuItem: function(name) {
    return this.menuItems.findWhere({name: name});
  },

  modelEvents: {
    'change': 'update',
    'change:folder_perma_id': 'updateParentFolder'
  },

  parentFolderPermaId: function() {
    return this.model.get('folder_perma_id');
  },

  serializeData: function() {
    return {
      selectable: !!this.options.selectionHandler,
      multiSelectable: this.multiSelectable()
    };
  },

  // Picking a single file is the point of selection mode, so checking
  // files for a bulk action would only get in the way.
  multiSelectable: function() {
    return !this.options.selectionHandler && !!this.options.listSelection;
  },

  onRender: function() {
    this.$el.toggleClass('selectable', !!this.options.selectionHandler);

    this.update();
    this.updateSelected();
    this.setupAriaAttributes();

    this.subview(new FileThumbnailView({
      el: this.ui.thumbnail,
      model: this.model
    }));

    this.renderActionsDropDown();
  },

  // Built on first use. Rendering an overlay for every row would make
  // long file lists slow to display.
  //
  // Rendered next to the editor's menus so the overlay is not clipped
  // by the scrolling files list. Stays inside the item if there is no
  // container to portal into.
  metaDataOverlay: function() {
    if (!this.metaDataOverlayView) {
      this.metaDataOverlayView = this.subview(new FileMetaDataOverlayView({
        model: this.model,
        metaDataAttributes: this.options.metaDataAttributes,
        reference: this.ui.thumbnailButton[0]
      }));

      this.metaDataOverlayView.el.id = this.metaDataOverlayId();
      this.ui.thumbnailButton.attr('aria-controls', this.metaDataOverlayId());

      this.$el.append(this.metaDataOverlayView.el);
      this.metaDataOverlayView.$el.appendTo('#editor_menu_container');

      this.listenTo(this.metaDataOverlayView, 'toggle', this.updateExpanded);
    }

    return this.metaDataOverlayView;
  },

  metaDataOverlayId: function() {
    return 'file-details-' + this.model.cid;
  },

  // Selecting a file is the only action offered in selection mode.
  renderActionsDropDown: function() {
    if (this.options.selectionHandler) {
      return;
    }

    this.ui.actions.append(this.subview(new DropDownButtonView({
      items: this.menuItems,
      title: I18n.t('pageflow.editor.templates.file_item.actions'),
      alignMenu: 'right',
      ellipsisIcon: true,
      borderless: true,
      openOnClick: true
    })).el);
  },

  update: function() {
    if (this.isClosed) {
      return;
    }

    this.$el.attr('data-id', this.model.id);
    this.ui.fileName.text(this.model.title());

    this.ui.settingsButton.toggle(!this.model.isNew());

    this.menuItem('cancel').set('hidden', !this.model.isUploading());
    this.menuItem('destroy').set('hidden', this.model.isUploading());

    this.updateMoveItem();

    this.ui.confirmButton.toggle(this.model.isConfirmable());
    this.ui.retryButton.toggle(this.model.isRetryable());

    this.updateToggleLabel();
  },

  // The file name is the label of the check box, so the check box has to
  // be disabled while files are not being checked. Clicking a name would
  // otherwise check the file even though no check box is displayed.
  updateSelected: function() {
    if (!this.multiSelectable() || this.isClosed) {
      return;
    }

    var selected = this.options.listSelection.includes(this.model);

    this.ui.checkBox.prop('checked', selected);
    this.ui.checkBox.prop('disabled', !this.options.listSelection.isSelecting());
    this.$el.toggleClass('is_selected', selected);
  },

  // Only folders which have been created can hold a file, so an entry
  // whose only folder is still being named has nothing to move into.
  updateMoveItem: function() {
    var folders = this.options.fileFolders;

    var movable = !this.model.isNew() && !!folders && folders.some(function(folder) {
      return !folder.isNew();
    });

    this.menuItem('move').set('hidden', !movable);
  },

  // Moving the pointer across the list would otherwise flash the
  // overlays of all files on the way. Once one of them is open, moving
  // on to the next file is deliberate enough to skip the delay.
  openMetaData: function() {
    if (FileMetaDataOverlayView.currentlyOpen) {
      return this.metaDataOverlay().openUnlessPinned();
    }

    this.openMetaDataTimeout = setTimeout(() => {
      this.metaDataOverlay().openUnlessPinned();
    }, OPEN_DELAY);
  },

  dismissMetaData: function() {
    clearTimeout(this.openMetaDataTimeout);
    this.metaDataOverlayView?.scheduleDismiss();
  },

  // Picking the file is the point of selection mode, so the thumbnail
  // does the same as the rest of the row. Pinning the overlay would
  // only get in the way of moving on to the next file.
  toggleMetaDataLock: function() {
    clearTimeout(this.openMetaDataTimeout);

    if (this.options.selectionHandler) {
      return this.select();
    }

    this.metaDataOverlay().toggleLock();
  },

  updateExpanded: function() {
    this.$el.toggleClass('expanded', this.metaDataOverlayView.isOpen());
    this.updateToggleLabel();
  },

  setupAriaAttributes: function() {
    var fileNameId = 'file-name-' + this.model.cid;
    var selectId = 'file-select-' + this.model.cid;

    // The select button covers the whole row, so its label has to name
    // the file it selects.
    this.ui.fileName.attr('id', fileNameId);
    this.ui.selectButton.attr('id', selectId);
    this.ui.selectButton.attr('aria-labelledby', selectId + ' ' + fileNameId);
  },

  // No title attribute, since hovering the thumbnail is what opens the
  // overlay in the first place. A tooltip about hiding details would
  // appear on top of the details it talks about.
  updateToggleLabel: function() {
    var isExpanded = this.$el.hasClass('expanded');
    var label = I18n.t(isExpanded ?
                       'pageflow.editor.templates.file_item.collapse_details' :
                       'pageflow.editor.templates.file_item.expand_details');

    this.ui.thumbnailButton.attr('aria-expanded', isExpanded.toString());
    this.ui.thumbnailButton.attr('aria-label', label);
  },

  move: function() {
    MoveToFolderDialogView.open({
      models: [this.model],
      fileFolders: this.options.fileFolders
    });
  },

  destroy: function() {
    if (window.confirm(I18n.t('pageflow.editor.views.file_item_view.confirm_destroy'))) {
      this.model.destroy();
    }
  },

  cancel: function() {
    this.model.cancelUpload();
  },

  confirm: function() {
    editor.navigate('/confirmable_files?type=' + this.model.modelName + '&id=' + this.model.id, {trigger: true});
  },

  retry: function() {
    this.model.retry();
  },

  select: function() {
    var result = this.options.selectionHandler.call(this.model);

    if (result !== false) {
      editor.navigate(this.options.selectionHandler.getReferer(), {trigger: true});
    }

    return false;
  },

  onClose: function() {
    Marionette.ItemView.prototype.onClose.call(this);

    clearTimeout(this.openMetaDataTimeout);
  }
});
