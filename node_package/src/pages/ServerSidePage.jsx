import {createItemScopeProvider} from 'collections';
import {registry as pageTypeRegistry} from 'registerPageType';
import boot from 'boot';

import React from 'react';
import {Provider} from 'react-redux';

const PageProvider = createItemScopeProvider('pages');

export default class extends React.Component {
  componentWillMount() {
    this.store = boot({seed: this.props.resolverSeed});
    this.pageComponent = pageTypeRegistry.findByName(this.props.pageType).component;
  }

  render(props) {
    const PageComponent = this.pageComponent;

    return (
      <Provider store={this.store}>
        <PageProvider itemId={this.props.pageId}>
          <PageComponent />
        </PageProvider>
      </Provider>
    );
  }
}
