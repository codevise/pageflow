import Backbone from 'backbone';
import I18n from 'i18n-js';
import Marionette from 'backbone.marionette';
import _ from 'underscore';

import {inputView} from 'pageflow/ui';

import {editor} from '../../base';

import {BackgroundPositioningView} from '../BackgroundPositioningView';
import {DropDownButtonView} from '../DropDownButtonView';
import {FileSettingsDialogView} from '../FileSettingsDialogView';
import {FileThumbnailView} from '../FileThumbnailView';

import {state} from '$state';

/**
 * Input view to reference a file.
 *
 * @class
 */
export const FileInputView = Marionette.ItemView.extend({
  mixins: [inputView],

  template: () => `
    <label>
      <span class="name"></span>
      <span class="inline_help"></span>
    </label>
    <div class="file_thumbnail"></div>
    <div class="file_name"></div>

    <a href=""
       class="unset"
       title="${I18n.t('pageflow.ui.templates.inputs.file_input.reset')}">
    </a>
    <a href=""
       class="choose"
       title="${I18n.t('pageflow.ui.templates.inputs.file_input.edit')}">
    </a>
  `,

  className: 'file_input',

  ui: {
    fileName: '.file_name',
    thumbnail: '.file_thumbnail'
  },

  events: {
    'click .choose': function() {
      editor.selectFile(
        {
          name: this.options.collection.name,
          filter: this.options.filter
        },
        this.options.fileSelectionHandler || 'pageConfiguration',
        _.extend({
          id: this.model.getRoutableId ? this.model.getRoutableId() : this.model.id,
          attributeName: this.options.propertyName,
          returnToTab: this.options.parentTab
        }, this.options.fileSelectionHandlerOptions || {})
      );

      return false;
    },

    'click .unset': function() {
      this.model.unsetReference(this.options.propertyName);
      return false;
    }
  },

  initialize: function() {
    this.options = _.extend({
      positioning: true,
      textTrackFiles: state.textTrackFiles
    }, this.options);

    if (typeof this.options.collection === 'string') {
      this.options.collection = state.entry.getFileCollection(
        editor.fileTypes.findByCollectionName(this.options.collection)
      );
    }

    this.textTrackMenuItems = new Backbone.Collection();
  },

  onRender: function() {
    this.update();
    this.listenTo(this.model, 'change:' + this.options.propertyName, this.update);

    var dropDownMenuItems = this._dropDownMenuItems();

    if (dropDownMenuItems.length) {
      this.appendSubview(new DropDownButtonView({
        items: dropDownMenuItems,
        ellipsisIcon: true,
        openOnClick: true
      }));
    }
  },

  update: function() {
    var file = this._getFile();

    this._listenToNestedTextTrackFiles(file);

    this.$el.toggleClass('is_unset', !file);
    this.ui.fileName.text(file ?
                          file.get('file_name') :
                          I18n.t('pageflow.ui.views.inputs.file_input_view.none'));

    this.subview(new FileThumbnailView({
      el: this.ui.thumbnail,
      model: file
    }));
  },

  _dropDownMenuItems: function() {
    var file = this._getFile(file);
    var items = new Backbone.Collection();

    if (this.options.defaultTextTrackFilePropertyName && file) {
      items.add({
        name: 'default_text_track',
        label: I18n.t('pageflow.editor.views.inputs.file_input.default_text_track'),
        items: this.textTrackMenuItems
      });
    }

    if (this.options.positioning && file && file.isPositionable()) {
      items.add(new FileInputView.EditBackgroundPositioningMenuItem({
        name: 'edit_background_positioning',
        label: I18n.t('pageflow.editor.views.inputs.file_input.edit_background_positioning')
      }, {
        inputModel: this.model,
        propertyName: this.options.propertyName,
        filesCollection: this.options.collection
      }));
    }

    if (file) {
      _.each(this.options.dropDownMenuItems, item => {
        items.add(this._createCustomMenuItem(file, item));
      });

      items.add(new FileInputView.EditFileSettingsMenuItem({
        name: 'edit_file_settings',
        label: I18n.t('pageflow.editor.views.inputs.file_input.edit_file_settings')
      }, {
        file: file,
      }));
    }

    return items;
  },

  _createCustomMenuItem(file, item) {
    const options = {
      inputModel: this.model,
      propertyName: this.options.propertyName,
      file
    };

    if (typeof item === 'function') {
      return new item({}, options);
    }
    else {
      return new FileInputView.CustomMenuItem({
        name: item.name,
        label: item.label,
        checked: item.checked,
        items: item.items && new Backbone.Collection(item.items.map(item => this._createCustomMenuItem(file, item)))
      }, {
        ...options,
        selected: item.selected,
        items: item.items
      })
    }
  },

  _listenToNestedTextTrackFiles: function(file) {
    if (this.textTrackFiles) {
      this.stopListening(this.textTrackFiles);
      this.textTrackFiles = null;
    }

    if (file && this.options.defaultTextTrackFilePropertyName) {
      this.textTrackFiles = file.nestedFiles(this.options.textTrackFiles);

      this.listenTo(this.textTrackFiles, 'add remove', this._updateTextTrackMenuItems);
      this._updateTextTrackMenuItems();
    }
  },

  _updateTextTrackMenuItems: function update() {
    var models = [null].concat(this.textTrackFiles.toArray());

    this.textTrackMenuItems.set(models.map(function(textTrackFile) {
      return new FileInputView.DefaultTextTrackFileMenuItem({}, {
        textTrackFiles: this.textTrackFiles,
        textTrackFile: textTrackFile,
        inputModel: this.model,
        propertyName: this.options.defaultTextTrackFilePropertyName
      });
    }, this));
  },

  _getFile: function() {
    return this.model.getReference(this.options.propertyName, this.options.collection);
  }
});

FileInputView.EditBackgroundPositioningMenuItem = Backbone.Model.extend({
  initialize: function(attributes, options) {
    this.options = options;
  },

  selected: function() {
    BackgroundPositioningView.open({
      model: this.options.inputModel,
      propertyName: this.options.propertyName,
      filesCollection: this.options.filesCollection
    });
  }
});

FileInputView.CustomMenuItem = Backbone.Model.extend({
  initialize: function(attributes, options) {
    this.options = options;
  },

  selected: function() {
    this.options.selected({
      inputModel: this.options.inputModel,
      propertyName: this.options.propertyName,
      file: this.options.file
    });
  }
});

FileInputView.EditFileSettingsMenuItem = Backbone.Model.extend({
  initialize: function(attributes, options) {
    this.options = options;
  },

  selected: function() {
    FileSettingsDialogView.open({
      model: this.options.file
    });
  }
});

FileInputView.DefaultTextTrackFileMenuItem = Backbone.Model.extend({
  initialize: function(attributes, options) {
    this.options = options;

    this.listenTo(this.options.inputModel, 'change:' + this.options.propertyName, this.update);

    if (this.options.textTrackFile) {
      this.listenTo(this.options.textTrackFile, 'change:configuration', this.update);
    }

    this.update();
  },

  update: function() {
    this.set('kind', 'radio');
    this.set('checked', this.options.textTrackFile == this.getDefaultTextTrackFile());
    this.set('name', this.options.textTrackFile ? null : 'no_default_text_track');
    this.set('label', this.options.textTrackFile ?
             this.options.textTrackFile.displayLabel() :
             this.options.textTrackFiles.length ?
             I18n.t('pageflow.editor.views.inputs.file_input.auto_default_text_track') :
             I18n.t('pageflow.editor.views.inputs.file_input.no_default_text_track'));
  },

  selected: function() {
    if (this.options.textTrackFile) {
      this.options.inputModel.setReference(this.options.propertyName, this.options.textTrackFile);
    }
    else {
      this.options.inputModel.unsetReference(this.options.propertyName);
    }
  },

  getDefaultTextTrackFile: function() {
    return this.options.inputModel.getReference(
      this.options.propertyName,
      this.options.textTrackFiles
    );
  }
});
