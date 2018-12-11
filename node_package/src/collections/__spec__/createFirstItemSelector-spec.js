import createFirstItemSelector from '../createFirstItemSelector';

import {expect} from 'support/chai';

describe('createFirstItemSelector', () => {
  describe('creates selector that', () => {
    it('can look up first collection item', () => {
      const state = {
        posts: {
          order: [5, 4],
          items: {
            4: {id: 4, title: 'Minor news'},
            5: {id: 5, title: 'Big news'}
          }
        }
      };
      const selector = createFirstItemSelector('posts');

      const result = selector(state);

      expect(result.id).to.eq(5);
    });

    it('returns undefined for empty collection', () => {
      const state = {
        posts: {
          order: [],
          items: {}
        }
      };
      const selector = createFirstItemSelector('posts');

      const result = selector(state);

      expect(result).to.eq(undefined);
    });

    describe('with namespace option', () => {
      it('can look up first item in namespace', () => {
        const state = {
          myNamespace: {
            posts: {
              order: [4, 5],
              items: {
                4: {id: 4, title: 'Minor news'},
                5: {id: 5, title: 'Big news'}
              }
            }
          }
        };
        const selector = createFirstItemSelector('posts', {namespace: 'myNamespace'});

        const result = selector(state);

        expect(result.id).to.eq(4);
      });

      it('throws descriptive error if namespace is unknown', () => {
        const state = {
        };
        const selector = createFirstItemSelector('items', {namespace: 'ufos'});

        expect(() => {
          selector(state);
        }).to.throw(/unknown namespace/);
      });
    });
  });
});
