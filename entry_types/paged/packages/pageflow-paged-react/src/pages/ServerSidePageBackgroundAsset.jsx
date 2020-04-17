import {createItemScopeProvider} from 'collections';
import boot from 'boot';

import React from 'react';
import {Provider} from 'react-redux';

import {PageBackgroundAsset} from 'media';

const PageProvider = createItemScopeProvider('pages');

export default class extends React.Component {
  componentWillMount() {
    this.store = boot({seed: this.props.resolverSeed});
  }

  render(props) {
    return (
      <Provider store={this.store}>
        <PageProvider itemId={this.props.pageId}>
          <PageBackgroundAsset />
        </PageProvider>
      </Provider>
    );
  }
}
