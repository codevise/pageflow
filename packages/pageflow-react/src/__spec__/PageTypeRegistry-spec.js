import PageTypeRegistry from '../PageTypeRegistry';

import {expect} from 'support/chai';

describe('PageTypeRegistry', () => {
  describe('#register', () => {
    it('fails if no component is supplied', () => {
      const registry = new PageTypeRegistry();

      expect(() => {
        registry.register('background_image', {
        });
      }).to.throw(/Requires component option to be present/);
    });

    it('fails if reduxModules option is not an array', () => {
      const registry = new PageTypeRegistry();
      const component = function() {};

      expect(() => {
        registry.register('background_image', {
          component,
          reduxModules: {}
        });
      }).to.throw(/Expected reduxModules option to be an array/);
    });

    it('fails loudly if redux module is not an object', () => {
      const registry = new PageTypeRegistry();
      const component = function() {};

      expect(() => {
        registry.register('background_image', {
          component,

          reduxModules: [
            function() {}
          ]
        });
      }).to.throw(/Expected redux module to be object with name, reducers and saga properties/);
    });

    it('fails loudly if reducer property of a redux module is not an object', () => {
      const registry = new PageTypeRegistry();
      const component = function() {};

      expect(() => {
        registry.register('background_image', {
          component,

          reduxModules: [
            {
              name: 'media',
              reducers: function() {}
            }
          ]
        });
      }).to.throw(/Expected reducers property of media reduxModule to be object/);
    });

    it('fails loudly if redux module is an object with unexpected key', () => {
      const registry = new PageTypeRegistry();
      const component = function() {};

      expect(() => {
        registry.register('background_image', {
          component,

          reduxModules: [
            {
              redcers: {} // with typo
            }
          ]
        });
      }).to.throw(/Expected redux module to be object with name, reducers and saga properties/);
    });
  });

  describe('#register/#findByName', () => {
    it('supports component and name property', () => {
      const registry = new PageTypeRegistry();
      const component = function() {};

      registry.register('background_image', {
        component
      });
      const result = registry.findByName('background_image');

      expect(result.component).to.eq(component);
      expect(result.name).to.eq('background_image');
    });

    it('passes other properties on', () => {
      const registry = new PageTypeRegistry();
      const component = function() {};

      registry.register('background_image', {
        component,
        some: 'value'
      });
      const result = registry.findByName('background_image');

      expect(result.some).to.eq('value');
    });

    it('combines reducer from reduxModules', () => {
      const registry = new PageTypeRegistry();
      const component = function() {};

      registry.register('background_image', {
        component,

        reduxModules: [
          {
            reducers: {
              a: function() {
                return 'a';
              }
            }
          },
          {
            reducers: {
              b: function() {
                return 'b';
              },
              c: function() {
                return 'c';
              }
            }
          },
          {
            // no reducer key
          }
        ]
      });
      const reducer = registry.findByName('background_image').reducer;
      const result = reducer({}, 'ACTION');

      expect(result).to.eql({
        a: 'a',
        b: 'b',
        c: 'c'
      });
    });
  });

  it('does not set reducer if non are given', () => {
    const registry = new PageTypeRegistry();
    const component = function() {};

    registry.register('background_image', {
      component
    });
    const result = registry.findByName('background_image').reducer;

    expect(result).to.eq(undefined);
  });

  it('creates saga from reduxModules', () => {
    const registry = new PageTypeRegistry();
    const component = function() {};
    const saga1 = function*() { yield 1; };
    const saga2 = function*() { yield 2; };

    registry.register('background_image', {
      component,

      reduxModules: [
        {
          saga: saga1
        },
        {
          saga: saga2
        },
        {
          // no saga key
        }
      ]
    });
    const saga = registry.findByName('background_image').saga;
    const result = saga().next().value;

    expect(result.map(i => i.next().value)).to.eql([1, 2]);
  });

  describe('#reduce', () => {
    it('iterates over registered page types', () => {
      const registry = new PageTypeRegistry();
      const component1 = function() {};
      const component2 = function() {};

      registry.register('background_image', {
        component: component1
      });
      registry.register('video', {
        component: component2
      });
      const result = registry.reduce(
        (result, pageType) => result.concat(pageType.component),
        []
      );

      expect(result).to.eql([component1, component2]);
    });
  });

  describe('#forEach', () => {
    it('iterates over registered page types', () => {
      const registry = new PageTypeRegistry();
      const component1 = function() {};
      const component2 = function() {};

      registry.register('background_image', {
        component: component1
      });
      registry.register('video', {
        component: component2
      });
      const result = [];
      registry.forEach(pageType =>
        result.push(pageType.component)
      );

      expect(result).to.eql([component1, component2]);
    });
  });
});
