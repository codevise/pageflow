import Backbone from 'backbone';

export const Theming = Backbone.Model.extend({
  modelName: 'theming',
  i18nKey: 'pageflow/theming',
  collectionName: 'themings'
});
