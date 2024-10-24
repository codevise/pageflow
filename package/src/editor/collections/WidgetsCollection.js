import Backbone from 'backbone';
import _ from 'underscore';

import {Widget} from '../models/Widget';
import {SubsetCollection} from './SubsetCollection';

export const WidgetsCollection = Backbone.Collection.extend({
  model: Widget,

  initialize: function(widgets, options) {
    this.widgetTypes = options.widgetTypes;

    this.listenTo(this, 'change:type_name change:configuration', function() {
      this.batchSave();
    });
  },

  url: function() {
    return '/editor/subjects/entries/' + this.subject.id + '/widgets';
  },

  batchSave: function(options) {
    var subject = this.subject;

    return Backbone.sync('patch', subject, _.extend(options || {}, {
      url: this.url() + '/batch',

      attrs: {
        widgets: this.map(function(widget) {
          return widget.toJSON();
        })
      },

      success: function(response) {
        subject.trigger('sync:widgets', subject, response, {});
      }
    }));
  },

  setupConfigurationEditorTabViewGroups(groups) {
    this.defineConfigurationEditorTabViewGroups(groups);
    this.listenTo(this, 'change:type_name', () =>
      this.defineConfigurationEditorTabViewGroups(groups)
    );
  },

  defineConfigurationEditorTabViewGroups(groups) {
    this.widgetTypes.defineStubConfigurationEditorTabViewGroups(groups);
    this.each(widget => widget.defineConfigurationEditorTabViewGroups(groups));
  },

  withInsertPoint(insertPoint) {
    return new SubsetCollection({
      parent: this,
      watchAttribute: 'type_name',
      filter: widget => (
        widget.widgetType() && widget.widgetType().insertPoint === insertPoint
      )
    });
  }
});
