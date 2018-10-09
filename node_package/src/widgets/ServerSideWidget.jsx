import boot from 'boot';

import React from 'react';
import {Provider} from 'react-redux';

import {registry} from 'registerWidgetType';


export default class extends React.Component {
  componentWillMount() {
    this.store = boot({seed: this.props.resolverSeed});
    this.widgetComponent = registry.findByName(this.props.widgetTypeName).component;
  }

  render(props) {
    const WidgetComponent = this.widgetComponent;

    return (
      <Provider store={this.store}>
        <WidgetComponent />
      </Provider>
    );
  }
}
