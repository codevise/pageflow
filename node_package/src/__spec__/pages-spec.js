import pagesModule, {createPageType, connectInPage} from '../pages';
import PageTypeRegistry from '../PageTypeRegistry';
import {enhance as pageEnhance, updatePageAttribute} from '../pages/actions';
import {pageAttribute, pageState, pageIsActive, pageIsPrepared} from '../pages/selectors';

import createStore from 'createStore';
import {combine} from 'utils';

import {call} from 'redux-saga/effects';

import Backbone from 'backbone';
import jQuery from 'jquery';

import {expect} from 'support/chai';
import sinon from 'sinon';

describe('pages', () => {
  const component = function() {
    return '';
  };

  it('exports redux module for pages collection', () => {
    const pageModel = new Backbone.Model({perma_id: 5, template: 'video'});
    pageModel.configuration = new Backbone.Model({title: 'First page'});
    const pages = new Backbone.Collection([pageModel]);
    const store = createStore([pagesModule], {pages});

    expect(pageAttribute('type', {id: 5})(store.getState())).to.eq('video');
    expect(pageAttribute('title', {id: 5})(store.getState())).to.eq('First page');
  });

  it('supports page type state reducers', () => {
    const pageTypes = new PageTypeRegistry();

    pageTypes.register('video', {
      component,
      reduxModules: [{
        reducers: {
          isPlaying(state = true, action) {
            return state;
          }
        }
      }]
    });

    const pageModel = new Backbone.Model({perma_id: 5, template: 'video'});
    pageModel.configuration = new Backbone.Model();
    const pages = new Backbone.Collection([pageModel]);
    const store = createStore([pagesModule], {pages, pageTypes});

    const result = pageState('isPlaying', {id: 5})(store.getState());

    expect(result).to.eq(true);
  });

  it('provides actions to update pages', () => {
    const pageModel = new Backbone.Model({perma_id: 5});
    pageModel.configuration = new Backbone.Model();
    const pages = new Backbone.Collection([pageModel]);
    const store = createStore([pagesModule], {pages});

    store.dispatch(updatePageAttribute({
      id: 5,
      name: 'title',
      value: 'Updated'
    }));

    expect(pageModel.configuration.get('title')).to.eq('Updated');
  });

  it('supports page type sagas', () => {
    const spy = sinon.spy();
    const pageTypes = new PageTypeRegistry();

    pageTypes.register('video', {
      component,
      reduxModules: [{
        saga: function*() {
          yield call(spy);
        }
      }]
    });

    const pageModel = new Backbone.Model({perma_id: 5, template: 'video'});
    pageModel.configuration = new Backbone.Model();
    const pages = new Backbone.Collection([pageModel]);
    const store = createStore([pagesModule], {pages, pageTypes});

    store.dispatch(pageEnhance({id: 5}));

    expect(spy).to.have.been.called;
  });

  describe('createPageType', () => {
    it('creates page type that keeps page state in sync', () => {
      const pageModel = new Backbone.Model({perma_id: 5});
      pageModel.configuration = new Backbone.Model();
      const pages = new Backbone.Collection([pageModel]);
      const store = createStore([pagesModule], {pages});
      const pageType = createPageType({Component: () => '', store});
      const element = pageElement({id: 5});

      pageType.activating(element, {}, {});
      pageType.activated(element, {}, {});

      const result = pageIsActive({id: 5})(store.getState());

      expect(result).to.eq(true);
    });
  });

  describe('connectInPage', () => {
    beforeEach('given a collection of pages', function() {
      const pageModel = new Backbone.Model({perma_id: 5, template: 'video'});
      pageModel.configuration = new Backbone.Model();

      this.pages = new Backbone.Collection([pageModel]);
    });

    describe('given a store synced with the collection', () => {
      beforeEach(function() {
        this.store = createStore([pagesModule], {pages: this.pages});
      });

      it('allows to use selectors which refer to the surrounding page', function() {
        const Component = function(props) {
          return (<span>{props.pageIsPrepared ? 'prepared' : '-'}</span>);
        };
        const ComponentConntectedToPage = connectInPage(combine({
          pageIsPrepared: pageIsPrepared()
        }))(Component);

        const pageType = createPageType({Component: ComponentConntectedToPage, store: this.store});
        const element = pageElement({id: 5});

        pageType.enhance(element);
        pageType.prepare(element);

        expect(element.text()).to.eq('prepared');
      });
    });

    describe('given a store with a page state reducer for the page type', () => {
      beforeEach(function() {
        const pageTypes = new PageTypeRegistry();
        pageTypes.register('video', {
          component,
          reduxModules: [{
            reducers: {
              toggled(state = false, action) {
                switch (action.type) {
                case 'TOGGLE':
                  return !state.toggled;
                default:
                  return state;
                }
              }
            }
          }]
        });

        this.store = createStore([pagesModule], {pages: this.pages, pageTypes});
      });

      it('allows to dispatch page actions for the surrounding page', function() {
        const Component = class extends React.Component {
          componentDidMount() {
            this.props.onMount();
          }

          render() {
            return (<span>{this.props.toggled ? 'toggled' : '-'}</span>);
          }
        };
        const ComponentConntectedToPage = connectInPage(
          combine({
            toggled: pageState('toggled')
          }),
          dispatch => ({
            onMount: () => dispatch({type: 'TOGGLE', meta: {collectionName: 'pages'}})
          })
        )(Component);

        const pageType = createPageType({Component: ComponentConntectedToPage, store: this.store});
        const element = pageElement({id: 5});

        pageType.enhance(element);

        expect(element.text()).to.eq('toggled');
      });
    });
  });

  function pageElement({id}) {
    const element = jQuery(document.createElement('div'));
    element.attr('id', id);
    element.page = function() {};

    return element;
  }
});
