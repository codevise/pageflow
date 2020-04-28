import Backbone from 'backbone';
import {ForeignKeySubsetCollection} from 'pageflow/editor';

import * as support from '$support';

describe('ForeignKeySubsetCollection', () => {
  let testContext;

  beforeEach(() => testContext = {});

  support.useFakeXhr(() => testContext);

  it('filters models with matching foreign key from parent collection', () => {
    const post = new Backbone.Model({id: 5});
    const comments = new Backbone.Collection([
      {id: 1, postId: 5},
      {id: 2, postId: 3},
      {id: 3, postId: 5}
    ]);
    const postComments = new ForeignKeySubsetCollection({
      parentModel: post,
      parent: comments,
      foreignKeyAttribute: 'postId'
    });

    expect(postComments.pluck('id')).toEqual([1, 3]);
  });

  it('is empty if parent model is new', () => {
    const post = new Backbone.Model();
    const comments = new Backbone.Collection([
      {id: 1},
      {id: 2, postId: 3}
    ]);
    const postComments = new ForeignKeySubsetCollection({
      parentModel: post,
      parent: comments,
      foreignKeyAttribute: 'postId'
    });

    expect(postComments.length).toBe(0);
  });

  it('sorts by position', () => {
    const post = new Backbone.Model({id: 5});
    const comments = new Backbone.Collection([
      {id: 1, postId: 5, position: 3},
      {id: 2, postId: 3, position: 1},
      {id: 3, postId: 5, position: 1}
    ]);
    const postComments = new ForeignKeySubsetCollection({
      parentModel: post,
      parent: comments,
      foreignKeyAttribute: 'postId'
    });

    expect(postComments.pluck('id')).toEqual([3, 1]);
  });

  it('sets foreign key when adding models', () => {
    const post = new Backbone.Model({id: 5});
    const comments = new Backbone.Collection([], {
      comparator: 'position'
    });
    const postComments = new ForeignKeySubsetCollection({
      parentModel: post,
      parent: comments,
      foreignKeyAttribute: 'postId'
    });

    postComments.add({id: 4});

    expect(postComments.first().get('postId')).toBe(5);
  });

  it('clears when parent model is destroyed', () => {
    const post = new Backbone.Model({id: 5}, {urlRoot: '/posts'});
    const comments = new Backbone.Collection([
      {id: 1, postId: 5, position: 3}
    ]);
    const postComments = new ForeignKeySubsetCollection({
      parentModel: post,
      parent: comments,
      foreignKeyAttribute: 'postId'
    });

    post.destroy();

    expect(postComments.length).toBe(0);
  });

  it('constructs url from parent model url', () => {
    const post = new Backbone.Model({id: 5}, {urlRoot: '/posts'});
    const comments = new Backbone.Collection([], {url: '/comments'});
    const postComments = new ForeignKeySubsetCollection({
      parentModel: post,
      parent: comments,
      foreignKeyAttribute: 'postId'
    });

    expect(postComments.url()).toBe('/posts/5/comments');
  });

  it('prefers urlSuffix of parent collection', () => {
    const post = new Backbone.Model({id: 5}, {urlRoot: '/editor/posts'});
    const comments = new (Backbone.Collection.extend({
      url: () => '/editor/comments',
      urlSuffix: () => '/comments'
    }))();
    const postComments = new ForeignKeySubsetCollection({
      parentModel: post,
      parent: comments,
      foreignKeyAttribute: 'postId'
    });

    expect(postComments.url()).toBe('/editor/posts/5/comments');
  });

  it('supports setting reference to parent model', () => {
    const post = new Backbone.Model({id: 5});
    const comments = new Backbone.Collection([
      {id: 1, postId: 5}
    ], {comparator: 'position'});
    const postComments = new ForeignKeySubsetCollection({
      parentModel: post,
      parent: comments,
      foreignKeyAttribute: 'postId',
      parentReferenceAttribute: 'post'
    });

    postComments.add({id: 2})

    expect(postComments.first().post).toBe(post);
    expect(postComments.last().post).toBe(post);
  });

  it('removes reference to parent model when model is removed from collection', () => {
    const post = new Backbone.Model({id: 5});
    const comments = new Backbone.Collection([
      {id: 1, postId: 5}
    ], {comparator: 'position'});
    const postComments = new ForeignKeySubsetCollection({
      parentModel: post,
      parent: comments,
      foreignKeyAttribute: 'postId',
      parentReferenceAttribute: 'post'
    });

    postComments.remove(1);

    expect(comments.first().post).not.toBe(post);
  });

  it('auto consolidates positions on remove by default', () => {
    const post = new Backbone.Model({id: 5}, {urlRoot: '/posts'});
    const comments = new Backbone.Collection([
      {id: 1, postId: 5, position: 0},
      {id: 2, postId: 5, position: 1}
    ], {comparator: 'position'});
    const postComments = new ForeignKeySubsetCollection({
      parentModel: post,
      parent: comments,
      foreignKeyAttribute: 'postId',
      parentReferenceAttribute: 'post'
    });

    postComments.remove(1);

    expect(postComments.first().get('position')).toBe(0);
  });

  it('supports deactivating autoConsolidatePositions', () => {
    const post = new Backbone.Model({id: 5}, {urlRoot: '/posts'});
    const comments = new Backbone.Collection([
      {id: 1, postId: 5, position: 0},
      {id: 2, postId: 5, position: 1}
    ], {comparator: 'position'});
    const postComments = new ForeignKeySubsetCollection({
      parentModel: post,
      parent: comments,
      foreignKeyAttribute: 'postId',
      parentReferenceAttribute: 'post',
      autoConsolidatePositions: false
    });

    postComments.remove(1);

    expect(postComments.first().get('position')).toBe(1);
  });
});
