import createItemSelector from '../createItemSelector';


describe('createItemSelector', () => {
  describe('creates selector that', () => {
    it('can look up item by id', () => {
      const state = {
        posts: {
          items: {
            4: {id: 4, title: 'Minor news'},
            5: {id: 5, title: 'Big news'}
          }
        }
      };
      const selector = createItemSelector('posts');

      const result = selector({id: 5})(state);

      expect(result.title).toBe('Big news');
    });

    it('throws descriptive error if collection is unknown', () => {
      const state = {};
      const selector = createItemSelector('ufos');

      expect(() => {
        selector({id: 5})(state);
      }).toThrowError(/unknown collection/);
    });

    it('id can be a function taking state and props', () => {
      const state = {
        posts: {
          items: {
            4: {id: 4, title: 'Minor news'},
            5: {id: 5, title: 'Big news'}
          }
        },
        comments: {
          items: {
            50: {id: 50, postId: 5}
          }
        }
      };
      const selector = createItemSelector('posts');
      const props = {commentId: 50};
      const commentPostId = (s, p) => s.comments.items[p.commentId].postId;

      const result = selector({id: commentPostId})(state, props);

      expect(result.title).toBe('Big news');
    });

    it('return undefined if no item with id exists', () => {
      const state = {
        posts: {
          items: {}
        }
      };
      const selector = createItemSelector('posts');

      const result = selector({id: 5})(state);

      expect(result).toBeUndefined();
    });

    it('uses connected id from state if id is missing', () => {
      const state = {
        __posts_connectedId: 5,
        posts: {
          items: {
            4: {id: 4, title: 'Minor news'},
            5: {id: 5, title: 'Big news'}
          }
        }
      };
      const selector = createItemSelector('posts');

      const result = selector()(state);

      expect(result.title).toBe('Big news');
    });

    describe('with namespace option', () => {
      it('can look up item by id in namespace', () => {
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
        const selector = createItemSelector('posts', {namespace: 'myNamespace'});

        const result = selector({id: 5})(state);

        expect(result.title).toBe('Big news');
      });

      it('throws descriptive error if namespace is unknown', () => {
        const state = {
        };
        const selector = createItemSelector('items', {namespace: 'ufos'});

        expect(() => {
          selector({id: 5})(state);
        }).toThrowError(/unknown namespace/);
      });
    });
  });
});
