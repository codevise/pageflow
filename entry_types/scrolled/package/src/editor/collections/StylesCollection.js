import Backbone from 'backbone';
import {features} from 'pageflow/frontend';
import {Style} from '../models/Style';

export const StylesCollection = Backbone.Collection.extend({
  model: Style,

  initialize(models, options = {}) {
    this.types = options.types || {};
  },

  getUnusedStyles() {
    const styles = this;
    const unusedStyles = new Backbone.Collection(
      Object.keys(this.types)
        .filter(name => features.isEnabled('decoration_effects') ||
                        Style.getKind(name, this.types) !== 'decoration')
        .filter(name => !this.findWhere({name}))
        .map(name => ({name})),
      {
        comparator: style => Object.keys(this.types).indexOf(style.get('name')),

        model: Backbone.Model.extend({
          initialize({name}) {
            this.set('label', Style.getLabel(name, styles.types));
          },

          selected() {
            styles.add({name: this.get('name')}, {types: styles.types});
          }
        })
      }
    );

    this.listenTo(this, 'add', style =>
      unusedStyles.remove(unusedStyles.findWhere({name: style.get('name')}))
    );

    this.listenTo(this, 'remove', style =>
      unusedStyles.add({name: style.get('name')})
    );

    this.listenTo(unusedStyles, 'add remove', () =>
      updateSeparation(unusedStyles, this.types)
    );

    updateSeparation(unusedStyles, this.types);

    return unusedStyles;
  }
});

function updateSeparation(styles, types) {
  styles.reduce((previous, style) => {
    style.set('separated',
               previous &&
               Style.getKind(style.get('name'), types) !== Style.getKind(previous.get('name'), types));
    return style;
  }, null);
}
