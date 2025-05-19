import {Configuration} from 'pageflow/editor';

export const ContentElementConfiguration = Configuration.extend({
  defaults: {},

  set(name, value, options) {
    const previousValue = this.get('position');

    Configuration.prototype.set.apply(this, arguments);

    if (name === 'position' && previousValue !== value) {
      const contentElement = this.parent;
      const section = contentElement.section;
      const currentBackdropContentElement = section.getBackdropContentElement();

      if (value === 'backdrop') {
        if (currentBackdropContentElement &&
            currentBackdropContentElement !== contentElement) {
          currentBackdropContentElement.configuration.set('position', 'inline');
        }

        section.configuration.set({
          previousBackdropType: section.configuration.get('backdropType'),
          backdropContentElement: contentElement.get('permaId'),
          backdropType: 'contentElement'
        });
      }
      else if (currentBackdropContentElement === contentElement &&
               section.configuration.get('backdropType') === 'contentElement') {
        section.configuration.set({
          backdropContentElement: null,
          backdropType: options?.keepBackdropType ?
                        'contentElement' :
                        section.configuration.get('previousBackdropType')
        });
      }
    }
  },

  getFilePosition: function(attribute, coord) {
    const cropPosition = this.get(this.filePositionProperty(attribute));
    return cropPosition ? cropPosition[coord] : 50;
  },

  setFilePosition: function(attribute, coord, value) {
    this.set(this.filePositionProperty(attribute), {
      ...this.get(this.filePositionProperty(attribute)),
      [coord]: value
    });
  },

  setFilePositions: function(attribute, x, y) {
    this.set(this.filePositionProperty(attribute), {x, y});
  },

  filePositionProperty: function(attribute) {
    if (attribute === 'id') {
      return 'cropPosition';
    }
    else {
      return attribute.replace(/Id$/, 'CropPosition');
    }
  },
});
