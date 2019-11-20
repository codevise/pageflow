import createPageType from '../createPageType';
import * as pageActions from '../actions';

import {createStore} from 'redux';
import {connect} from 'react-redux';
import jQuery from 'jquery';

import sinon from 'sinon';

describe('createPageType', () => {
  describe('creates page type that', () => {
    it('renders given component on enhance', () => {
      const Component = function() {
        return (<div>Rendered component</div>);
      };
      const store = createStore(state => state);
      const pageType = createPageType({Component, store});
      const element = pageElement();

      pageType.enhance(element);

      expect(element.html()).to.include('Rendered component');
    });

    it('renders component in context of store', () => {
      const Component = connect(state => state)(function(props) {
        return (<div>{props.text}</div>);
      });
      const store = createStore(state => state, {text: 'Text from store'});
      const pageType = createPageType({Component, store});
      const element = pageElement();

      pageType.enhance(element);

      expect(element.html()).to.include('Text from store');
    });

    it('allows rendering into custom element', () => {
      const Component = function() {
        return (<div>Rendered component</div>);
      };
      const store = createStore(state => state);
      const pageType = createPageType({
        Component,
        store,

        selectTargetElement(pageElement) {
          return pageElement.find('span')[0];
        }
      });
      const element = pageElement({innerHTML: '<span></span>'});

      pageType.enhance(element);

      expect(element.find('span').html()).to.include('Rendered component');
    });

    [
      [pageActions.ENHANCE, 'enhance'],
      [pageActions.PAGE_DID_PRELOAD, 'preload'],
      [pageActions.PAGE_DID_PREPARE, 'prepare'],
      [pageActions.PAGE_SCHEDULE_UNPREPARE, 'unprepare'],
      [pageActions.PAGE_WILL_ACTIVATE, 'activating'],
      [pageActions.PAGE_DID_ACTIVATE, 'activated'],
      [pageActions.PAGE_WILL_DEACTIVATE, 'deactivating'],
      [pageActions.PAGE_DID_DEACTIVATE, 'deactivated'],
      [pageActions.PAGE_DID_RESIZE, 'resize'],
      [pageActions.CLEANUP, 'cleanup'],
    ].forEach(([actionType, hookName]) => {

      it(`dispatches ${actionType} on ${hookName} hook`, () => {
        const Component = function(props) { return <div />; };
        const reducer = sinon.spy();
        const store = createStore(reducer);
        const pageType = createPageType({Component, store});
        const element = pageElement();
        const configuration = {};
        const options = {};

        element.attr('id', '5');
        pageType[hookName].call(pageType, element, configuration, options);

        expect(reducer).to.have.been.calledWith(sinon.match.any,
                                                sinon.match({
                                                  type: actionType,
                                                  meta: {
                                                    collectionName: 'pages',
                                                    itemId: 5
                                                  }
                                                }));
      });
    });

    it('includes position in payload of PAGE_WILL_ACTIVATE action', () => {
      const Component = function(props) { return <div />; };
      const reducer = sinon.spy();
      const store = createStore(reducer);
      const pageType = createPageType({Component, store});
      const element = pageElement();
      const configuration = {};
      const options = {position: 'bottom'};

      element.attr('id', '5');
      pageType.activating(element, configuration, options);

      expect(reducer).to.have.been.calledWith(sinon.match.any,
                                              sinon.match({
                                                payload: {
                                                  position: 'bottom'
                                                }
                                              }));
    });

    it('unmounts component on cleanup', () => {
      const Component = function() {
        return (<div>Rendered component</div>);
      };
      const store = createStore(state => state);
      const pageType = createPageType({Component, store});
      const element = pageElement();

      pageType.enhance(element);
      pageType.cleanup(element);

      expect(element.html()).to.eql('');
    });
  });

  function pageElement({innerHTML} = {innerHTML: ''}) {
    const element = document.createElement('div');
    element.innerHTML = innerHTML;

    const result = jQuery(element);
    result.page = function() {};

    return result;
  }
});
