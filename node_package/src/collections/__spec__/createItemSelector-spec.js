import createItemSelector from '../createItemSelector';

import {expect} from 'support/chai';

describe('createItemSelector', () => {
  describe('creates selector that', () => {
    it('can look up item by id', () => {
      const state = {
        posts: {
          4: {id: 4, title: 'Minor news'},
          5: {id: 5, title: 'Big news'}
        }
      };
      const selector = createItemSelector('posts');

      const result = selector({id: 5})(state);

      expect(result.title).to.eq('Big news');
    });

    it('throws descriptive error if collection is unknown', () => {
      const state = {
      };
      const selector = createItemSelector('ufos');

      expect(() => {
        selector({id: 5})(state);
      }).to.throw(/unknown collection/);
    });

    it('id can be a function taking state and props', () => {
      const state = {
        posts: {
          4: {id: 4, title: 'Minor news'},
          5: {id: 5, title: 'Big news'}
        },
        comments: {
          50: {id: 50, postId: 5}
        }
      };
      const selector = createItemSelector('posts');
      const props = {commentId: 50};
      const commentPostId = (s, p) => s.comments[p.commentId].postId;

      const result = selector({id: commentPostId})(state, props);

      expect(result.title).to.eq('Big news');
    });

    it('return undefined if no item with id exists', () => {
      const state = {
        posts: {}
      };
      const selector = createItemSelector('posts');

      const result = selector({id: 5})(state);

      expect(result).to.eq(undefined);
    });

    it('uses connected id from state if id is missing', () => {
      const state = {
        __posts_connectedId: 5,
        posts: {
          4: {id: 4, title: 'Minor news'},
          5: {id: 5, title: 'Big news'}
        }
      };
      const selector = createItemSelector('posts');

      const result = selector()(state);

      expect(result.title).to.eq('Big news');
    });

    it('can map value', () => {
      const state = {
        posts: {
          4: {id: 4, attributes: {title: 'Minor news'}}
        }
      };
      const selector = createItemSelector('posts');

      const result = selector({id: 4, map: post => post.attributes.title})(state);

      expect(result).to.eq('Minor news');
    });
  });
});
