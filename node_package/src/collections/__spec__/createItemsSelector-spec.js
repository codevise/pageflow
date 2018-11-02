import createItemsSelector from '../createItemsSelector';

import {expect} from 'support/chai';

describe('createItemsSelector', () => {
  describe('creates selector that', () => {
    it('can look up item collection', () => {
      const state = {
        posts: {
          items: {
            4: {id: 4, title: 'Minor news'},
            5: {id: 5, title: 'Big news'}
          }
        }
      };
      const selector = createItemsSelector('posts');

      const result = selector(state);

      expect(result).to.eq(state.posts.items);
    });

    it('return empty object if collection with name exists', () => {
      const state = {
        posts: {}
      };
      const selector = createItemsSelector('posts');

      const result = selector(state);

      expect(result).to.eql({});
    });

    describe('with namespace option', () => {
      it('can look up items in namespace', () => {
        const state = {
          myNamespace: {
            posts: {
              items: {
                4: {id: 4, title: 'Minor news'},
                5: {id: 5, title: 'Big news'}
              }
            }
          }
        };
        const selector = createItemsSelector('posts', {namespace: 'myNamespace'});

        const result = selector(state);

        expect(result).to.eq(state.myNamespace.posts.items);
      });

      it('throws descriptive error if namespace is unknown', () => {
        const state = {
        };
        const selector = createItemsSelector('items', {namespace: 'ufos'});

        expect(() => {
          selector(state);
        }).to.throw(/unknown namespace/);
      });
    });
  });
});
