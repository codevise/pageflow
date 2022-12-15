import Backbone from 'backbone';

export const Site = Backbone.Model.extend({
  modelName: 'site',
  i18nKey: 'pageflow/site',
  collectionName: 'sites'
});
