import {StylesCollection} from 'editor/collections/StylesCollection';
import {Style} from 'editor/models/Style';

import {useFakeTranslations} from 'pageflow/testHelpers';
import {features} from 'pageflow/frontend';

describe('StylesCollection', () => {
  const exampleTypes = {
    blur: {
      minValue: 0,
      maxValue: 100,
      defaultValue: 50,
      kind: 'filter'
    },
    brightness: {
      minValue: -100,
      maxValue: 100,
      defaultValue: -20,
      kind: 'filter'
    },
    frame: {
      kind: 'decoration',
      inputType: 'color',
      defaultValue: '#ffffff'
    },
    autoZoom: {
      minValue: 1,
      maxValue: 100,
      defaultValue: 50,
      kind: 'animation'
    },
    scrollParallax: {
      minValue: 0,
      maxValue: 100,
      defaultValue: 50,
      kind: 'animation'
    }
  };

  beforeEach(() => features.enabledFeatureNames = []);

  describe('#getUnusedStyles', () => {
    useFakeTranslations({
      'pageflow_scrolled.editor.backdrop_effects.blur.label': 'Blur',
      'pageflow_scrolled.editor.backdrop_effects.aspectRatio.label': 'Aspect Ratio'
    });

    it('sets label based on translation', () => {
      const styles = new StylesCollection([], {types: exampleTypes});

      const unusedStyles = styles.getUnusedStyles();

      expect(unusedStyles.pluck('label')).toContain('Blur');
    });

    it('allows getting unused styles', () => {
      const styles = new StylesCollection([{name: 'brightness', value: 50}], {types: exampleTypes});

      const unusedStyles = styles.getUnusedStyles();

      expect(unusedStyles.pluck('name')).toContain('blur');
      expect(unusedStyles.findWhere({name: 'brightness'}).get('hidden')).toEqual(true);
    });

    it('does not include decoration styles by default', () => {
      const styles = new StylesCollection([], {types: exampleTypes});

      const unusedStyles = styles.getUnusedStyles();

      expect(unusedStyles.pluck('name')).not.toContain('frame');
    });

    it('includes decoration styles if feature is enabled', () => {
      const styles = new StylesCollection([], {types: exampleTypes});
      features.enable('frontend', ['decoration_effects']);

      const unusedStyles = styles.getUnusedStyles();

      expect(unusedStyles.pluck('name')).toContain('frame');
    });

    it('selecting an unused style adds it to the collection', () => {
      const styles = new StylesCollection([], {types: exampleTypes});

      const unusedStyles = styles.getUnusedStyles();
      unusedStyles.first().selected();

      expect(styles.pluck('name')).toEqual(['blur']);
    });

    it('hides style when added to collection', () => {
      const styles = new StylesCollection([], {types: exampleTypes});

      const unusedStyles = styles.getUnusedStyles();
      unusedStyles.findWhere({name: 'brightness'}).selected();

      expect(unusedStyles.findWhere({name: 'brightness'}).get('hidden')).toEqual(true);
    });

    it('restores style once removed from collection', () => {
      const styles = new StylesCollection([{name: 'blur', value: 50}], {types: exampleTypes});

      const unusedStyles = styles.getUnusedStyles();
      styles.remove(styles.first());

      expect(unusedStyles.findWhere({name: 'blur'}).get('hidden')).toBeFalsy();
    });

    it('separates first animation style', () => {
      const styles = new StylesCollection([], {types: exampleTypes});

      const unusedStyles = styles.getUnusedStyles();

      expect(unusedStyles.findWhere({name: 'brightness'}).get('separated')).toEqual(false);
      expect(unusedStyles.findWhere({name: 'autoZoom'}).get('separated')).toEqual(true);
      expect(unusedStyles.findWhere({name: 'scrollParallax'}).get('separated')).toEqual(false);
    });

    it('updates separation when style is selected', () => {
      const styles = new StylesCollection([], {types: exampleTypes});

      const unusedStyles = styles.getUnusedStyles();
      unusedStyles.findWhere({name: 'autoZoom'}).selected();

      expect(unusedStyles.findWhere({name: 'brightness'}).get('separated')).toEqual(false);
      expect(unusedStyles.findWhere({name: 'scrollParallax'}).get('separated')).toEqual(true);
    });

    it('updates separation when style is removed', () => {
      const styles = new StylesCollection([{name: 'autoZoom', value: 50}], {types: exampleTypes});

      const unusedStyles = styles.getUnusedStyles();
      styles.remove(styles.first());

      expect(unusedStyles.findWhere({name: 'brightness'}).get('separated')).toEqual(false);
      expect(unusedStyles.findWhere({name: 'autoZoom'}).get('separated')).toEqual(true);
      expect(unusedStyles.findWhere({name: 'scrollParallax'}).get('separated')).toEqual(false);
    });

    describe('with nested items', () => {
      it('sets items property on unused style', () => {
        const styles = new StylesCollection([], {
          types: {
            aspectRatio: {
              items: [
                {
                  label: 'Square',
                  value: 'square'
                },
                {
                  label: 'Landscape',
                  value: 'landscape'
                }
              ]
            }
          }
        });

        const unusedStyles = styles.getUnusedStyles();

        expect(unusedStyles.pluck('label')).toEqual(['Aspect Ratio']);
        expect(unusedStyles.first().selected).toBeUndefined();
        expect(unusedStyles.first().get('items').pluck('label')).toEqual(['Square', 'Landscape']);
      });

      it('selecting an item adds a style to the collection', () => {
        const styles = new StylesCollection([], {
          types: {
            aspectRatio: {
              items: [
                {
                  label: 'Square',
                  value: 'square'
                },
                {
                  label: 'Landscape',
                  value: 'landscape'
                }
              ]
            }
          }
        });

        const unusedStyles = styles.getUnusedStyles();
        unusedStyles.first().get('items').first().selected();

        expect(styles.pluck('name')).toEqual(['aspectRatio']);
        expect(styles.first().label()).toEqual('Aspect Ratio: Square');
        expect(styles.first().get('value')).toEqual('square');
      });

      it('selecting an item removes previously selected item', () => {
        const styles = new StylesCollection([], {
          types: {
            aspectRatio: {
              items: [
                {
                  label: 'Square',
                  value: 'square'
                },
                {
                  label: 'Landscape',
                  value: 'landscape'
                }
              ]
            }
          }
        });

        const unusedStyles = styles.getUnusedStyles();
        unusedStyles.first().get('items').first().selected();
        unusedStyles.first().get('items').last().selected();

        expect(styles.pluck('name')).toEqual(['aspectRatio']);
        expect(styles.first().get('value')).toEqual('landscape');
      });

      it('selecting an item disables it instead of removing it', () => {
        const styles = new StylesCollection([], {
          types: {
            aspectRatio: {
              items: [
                {
                  label: 'Square',
                  value: 'square'
                },
                {
                  label: 'Landscape',
                  value: 'landscape'
                }
              ]
            }
          }
        });

        const unusedStyles = styles.getUnusedStyles();
        unusedStyles.first().get('items').first().selected();

        expect(unusedStyles.pluck('name')).toEqual(['aspectRatio']);
        expect(unusedStyles.first().get('items').first().get('disabled')).toEqual(true);
        expect(unusedStyles.first().get('items').last().get('disabled')).toEqual(false);
      });

      it('removing a style enabled the item', () => {
        const styles = new StylesCollection([], {
          types: {
            aspectRatio: {
              items: [
                {
                  label: 'Square',
                  value: 'square'
                },
                {
                  label: 'Landscape',
                  value: 'landscape'
                }
              ]
            }
          }
        });

        const unusedStyles = styles.getUnusedStyles();
        unusedStyles.first().get('items').first().selected();
        styles.remove(styles.first());

        expect(unusedStyles.pluck('name')).toEqual(['aspectRatio']);
        expect(unusedStyles.first().get('items').first().get('disabled')).toEqual(false);
        expect(unusedStyles.last().get('items').first().get('disabled')).toEqual(false);
      });
    });
  });

  describe('with effect types', () => {
    it('creates collection with effect style types', () => {
      const styles = new StylesCollection([{name: 'blur', value: 50}], {types: Style.effectTypes});

      expect(styles.pluck('name')).toEqual(['blur']);
      expect(styles.first().minValue()).toEqual(0);
      expect(styles.first().maxValue()).toEqual(100);
    });
  });
});
