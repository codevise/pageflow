import Backbone from 'backbone';

export const InlineFileRightsMenuItem = Backbone.Model.extend({
  defaults: {
    name: 'hideInlineFileRights',
    label: 'Rechteangabe an dieser Stelle ausblenden',
    kind: 'checkBox'
  },

  initialize(attributes, {inputModel, propertyName, file}) {
    const flagPropertyName = propertyName === 'id' ?
                             'inlineRightsHidden' :
                             `${propertyName.replace('Id', '')}InlineRightsHidden`;

    const update = () => {
      this.set('hidden',
               !file.get('rights') ||
               file.configuration.get('rights_display') !== 'inline')
      this.set('checked', !!inputModel.get(flagPropertyName));
    }

    this.listenTo(inputModel, `change:${flagPropertyName}`, update);
    this.listenTo(file, 'change:rights', update);
    this.listenTo(file.configuration, `change:rights_display`, update);

    update();

    this.selected = () => {
      inputModel.set(flagPropertyName, !inputModel.get(flagPropertyName));
    }
  }
})
