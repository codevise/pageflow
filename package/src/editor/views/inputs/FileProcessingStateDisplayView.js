import Marionette from 'backbone.marionette';

import {CollectionView, inputView} from 'pageflow/ui';

import {editor} from '../../base';

import {FileStageItemView} from '../FileStageItemView';

import {state} from '$state';

export const FileProcessingStateDisplayView = Marionette.View.extend({
  className: 'file_processing_state_display',

  mixins: [inputView],

  initialize: function() {
    if (typeof this.options.collection === 'string') {
      this.options.collection = state.entry.getFileCollection(
        editor.fileTypes.findByCollectionName(this.options.collection)
      );
    }

    this.listenTo(this.model, 'change:' + this.options.propertyName, this._update);
  },

  render: function() {
    this._update();
    return this;
  },

  _update: function() {
    if (this.fileStagesView) {
      this.stopListening(this.file.currentStages);

      this.fileStagesView.close();
      this.fileStagesView = null;
    }

    this.file = this._getFile();

    if (this.file) {
      this.listenTo(this.file.currentStages, 'add remove', this._updateClassNames);

      this.fileStagesView = new CollectionView({
        tagName: 'ul',
        collection: this.file.currentStages,
        itemViewConstructor: FileStageItemView,
        itemViewOptions: {
          standAlone: true
        }
      });

      this.appendSubview(this.fileStagesView);
    }

    this._updateClassNames();
  },

  _updateClassNames: function() {
    this.$el.toggleClass('file_processing_state_display-empty', !this._hasItems());
  },

  _hasItems: function() {
    return this.file && this.file.currentStages.length;
  },

  _getFile: function() {
    return this.model.getReference(this.options.propertyName, this.options.collection);
  }
});
