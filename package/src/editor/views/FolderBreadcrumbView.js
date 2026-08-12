import $ from 'jquery';
import Marionette from 'backbone.marionette';

import template from '../templates/folderBreadcrumb.jst';

export const FolderBreadcrumbView = Marionette.ItemView.extend({
  template,
  className: 'folder_breadcrumb',

  ui: {
    path: '.folder_breadcrumb-path'
  },

  events: {
    'click .folder_breadcrumb-parent': function(event) {
      this.options.onSelect($(event.currentTarget).data('folder'));
      return false;
    },

    'click .folder_breadcrumb-root': function() {
      this.options.onSelect(null);
      return false;
    }
  },

  modelEvents: {
    'change:name': 'render'
  },

  onRender: function() {
    this.options.fileFolders.ancestorsOf(this.model).forEach(function(folder) {
      this.appendSegment(this.parentSegment(folder));
    }, this);

    this.appendSegment(this.currentSegment());
  },

  // The folder icon of the root stands in for a segment of its own, so
  // every name is preceded by a separator.
  appendSegment: function(segment) {
    this.ui.path.append(this.separator()).append(segment);
  },

  separator: function() {
    return $('<span />', {
      'class': 'folder_breadcrumb-separator',
      'aria-hidden': 'true'
    });
  },

  parentSegment: function(folder) {
    return $('<button />', {
      'class': 'folder_breadcrumb-parent',
      type: 'button',
      text: folder.get('name')
    }).data('folder', folder);
  },

  currentSegment: function() {
    return $('<span />', {
      'class': 'folder_breadcrumb-current',
      text: this.model.get('name')
    });
  }
});
