import createItemScopeConnector from '../createItemScopeConnector';
import createItemScopeProvider from '../createItemScopeProvider';

import {createStore} from 'redux';
import {Provider} from 'react-redux';

import sinon from 'sinon';
import {mount} from 'enzyme';

describe('createItemScopeConnector', () => {
  describe('creates connect function that', () => {
    it('sets item id from context in state passed to mapStateToProps', () => {
      const connectInItemScope = createItemScopeConnector('pages');
      const ItemScopeProvider = createItemScopeProvider('pages');

      const Component = function() { return (<div />); };
      const mapStateToProps = sinon.stub().returns({});
      const Connected = connectInItemScope(mapStateToProps)(Component);

      const store = createStore((state = {other: 'stuff'}) => state);

      mount(
        <Provider store={store}>
          <ItemScopeProvider itemId={5}>
            <Connected />
          </ItemScopeProvider>
        </Provider>
      );

      expect(mapStateToProps).to.have.been.calledWith(sinon.match({
        __pages_connectedId: 5,
        other: 'stuff'
      }));
    });

    it('supports mapStateToProps that returns a function', () => {
      const connectInItemScope = createItemScopeConnector('pages');
      const ItemScopeProvider = createItemScopeProvider('pages');

      const Component = function() { return (<div />); };
      const mapStateToProps = sinon.stub().returns({});
      const Connected = connectInItemScope(() => mapStateToProps)(Component);

      const store = createStore((state = {other: 'stuff'}) => state);

      mount(
        <Provider store={store}>
          <ItemScopeProvider itemId={5}>
            <Connected />
          </ItemScopeProvider>
        </Provider>
      );

      expect(mapStateToProps).to.have.been.calledWith(sinon.match({
        __pages_connectedId: 5,
        other: 'stuff'
      }));
    });

    it('does not call mapStateToProps again if it returned function', () => {
      const connectInItemScope = createItemScopeConnector('pages');
      const ItemScopeProvider = createItemScopeProvider('pages');

      const Component = function() { return (<div />); };
      const mapStateToPropsFactory = sinon.stub().returns(() => ({}));
      const Connected = connectInItemScope(mapStateToPropsFactory)(Component);

      const store = createStore((state = {other: 'stuff'}) => ({...state}));

      mount(
        <Provider store={store}>
          <ItemScopeProvider itemId={5}>
            <Connected />
          </ItemScopeProvider>
        </Provider>
      );
      store.dispatch({type: 'SOMETHING'});

      expect(mapStateToPropsFactory).to.have.been.calledOnce;
    });

    it('sets meta info of item actions', () => {
      const connectInItemScope = createItemScopeConnector('pages');
      const ItemScopeProvider = createItemScopeProvider('pages');

      const Component = class extends React.Component {
        render() { return (<div />); }

        componentDidMount() { this.props.onTrigger(); }
      };
      const Connected = connectInItemScope(
        null,
        dispatch => ({
          onTrigger: () => dispatch({type: 'PAGE_ACTION', meta: {collectionName: 'pages'}})
        })
      )(Component);
      const reducer = sinon.spy();
      const store = createStore(reducer);

      mount(
        <Provider store={store}>
          <ItemScopeProvider itemId={5}>
            <Connected />
          </ItemScopeProvider>
        </Provider>
      );

      expect(reducer).to.have.been.calledWith(undefined, sinon.match({
        type: 'PAGE_ACTION',
        meta: {
          collectionName: 'pages',
          itemId: 5
        }
      }));
    });

    it('sets meta info of item actions created by passed action creators', () => {
      const connectInItemScope = createItemScopeConnector('pages');
      const ItemScopeProvider = createItemScopeProvider('pages');

      const Component = class extends React.Component {
        render() { return (<div />); }

        componentDidMount() { this.props.onTrigger(); }
      };
      const Connected = connectInItemScope(
        null,
        {
          onTrigger: () => ({type: 'PAGE_ACTION', meta: {collectionName: 'pages'}})
        }
      )(Component);
      const reducer = sinon.spy();
      const store = createStore(reducer);

      mount(
        <Provider store={store}>
          <ItemScopeProvider itemId={5}>
            <Connected />
          </ItemScopeProvider>
        </Provider>
      );

      expect(reducer).to.have.been.calledWith(undefined, sinon.match({
        type: 'PAGE_ACTION',
        meta: {
          collectionName: 'pages',
          itemId: 5
        }
      }));
    });

    it('does not overwrite itemId', () => {
      const connectInItemScope = createItemScopeConnector('pages');
      const ItemScopeProvider = createItemScopeProvider('pages');

      const Component = class extends React.Component {
        render() { return (<div />); }

        trigger() { this.props.onTrigger(); }
      };
      const Connected = connectInItemScope(
        null,
        dispatch => ({
          onTrigger: dispatch({type: 'PAGE_ACTION', meta: {collectionName: 'pages', itemId: 34}})
        })
      )(Component);
      const reducer = sinon.spy();
      const store = createStore(reducer);

      mount(
        <Provider store={store}>
          <ItemScopeProvider pageId={5}>
            <Connected />
          </ItemScopeProvider>
        </Provider>
      );

      expect(reducer).to.have.been.calledWith(undefined, sinon.match({
        type: 'PAGE_ACTION',
        meta: {
          collectionName: 'pages',
          itemId: 34
        }
      }));
    });
  });
});
