import Backbone from 'backbone';
import {transientReferences} from 'pageflow/editor';

export const ExternalLinkModel = Backbone.Model.extend({
  modelName: 'ExternalLink',
  i18nKey: 'external_link',
  mixins: [transientReferences],

  thumbnailUrl: function () {
    const image = this.collection.entry.imageFiles.getByPermaId(this.get('thumbnail'));
    return image ? image.get('thumbnail_url') : '';
  },

  title: function() {
    return this.get('title');
  },
});
