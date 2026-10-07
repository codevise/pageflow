import Marionette from 'backbone.marionette';

import {FileDetailsView} from './FileDetailsView';

import template from '../templates/explorerFileDetails.jst';

export const ExplorerFileDetailsView = Marionette.View.extend({
  className: 'explorer_file_details',

  initialize: function() {
    this.listenTo(this.options.selection, 'change:file', this.update);
  },

  render: function() {
    this.update();
    return this;
  },

  update: function() {
    var file = this.options.selection.get('file');

    if (this.contentView) {
      this.contentView.close();
      this.contentView = null;
    }

    if (file) {
      this.contentView = new ContentView({model: file});
      this.appendSubview(this.contentView);
    }
  }
});

const ContentView = Marionette.ItemView.extend({
  template,

  ui: {
    name: '.explorer_file_details-name',
    details: '.explorer_file_details-details'
  },

  onRender: function() {
    this.ui.name.text(this.model.title());

    var detailsView = new FileDetailsView({
      model: this.model,
      metaDataAttributes: this.model.fileType().metaDataAttributes,
      readOnly: true
    });

    this.appendSubview(detailsView, {to: this.ui.details});
    detailsView.showPreview();
  }
});
