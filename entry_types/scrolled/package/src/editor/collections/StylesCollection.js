import Backbone from 'backbone';
import {features} from 'pageflow/frontend';
import {Style} from '../models/Style';

export const StylesCollection = Backbone.Collection.extend({
  model: Style,

  initialize(models, options = {}) {
    this.types = options.types || {};
  },

  getUnusedStyles() {
    const unusedStyles = new Backbone.Collection(
      Object
        .entries(this.types)
        .filter(
          ([name, styleType]) => (
            features.isEnabled('decoration_effects') ||
            Style.getKind(name, this.types) !== 'decoration'
          )
        )
        .map(([name]) => ({name})),
      {
        comparator: style => Object.keys(this.types).indexOf(style.get('name')),
        styles: this,
        model: UnusedStyle
      }
    );

    this.listenTo(unusedStyles, 'change:hidden', () =>
      updateSeparation(unusedStyles, this.types)
    );

    updateSeparation(unusedStyles, this.types);

    return unusedStyles;
  }
});

function updateSeparation(styles, types) {
  styles.where({hidden: false}).reduce((previous, style) => {
    style.set('separated',
               previous &&
               Style.getKind(style.get('name'), types) !== Style.getKind(previous.get('name'), types));
    return style;
  }, null);
}

const UnusedStyle = Backbone.Model.extend({
  initialize({name}, {styles}) {
    const {items} = styles.types[name];

    this.set('label', Style.getLabel(name, styles.types));

    if (items) {
      this.set('items', new Backbone.Collection(items, {
        model: UnusedStyleItem,
        styles,
        styleName: name,
      }));
    }
    else {
      this.selected = () => {
        styles.add({name: this.get('name')}, {types: styles.types});
      }
    }

    const update = () => {
      this.set({
        hidden: !!styles.findWhere({name: this.get('name')}) && !items
      });
    };

    this.listenTo(styles, 'add remove', update);
    update();
  }
});

const UnusedStyleItem = Backbone.Model.extend({
  initialize(attributes, {styles, styleName}) {
    this.styles = styles;
    this.styleName = styleName;

    const update = () => {
      this.set({
        disabled: styles.findWhere({name: styleName})?.get('value') === this.get('value')
      });
    };

    this.listenTo(styles, 'add remove', update);
    update();
  },

  selected() {
    this.styles.remove(this.styles.findWhere({name: this.styleName}));
    this.styles.add({name: this.styleName, value: this.get(('value'))}, {types: this.styles.types});
  }
});
