import InfoIcon from 'components/icons/Info';
import {Toggle} from './Toggle';

import React from 'react';

export class VendorList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.handleVendorInfoClick = this.onVendorInfoClick.bind(this);
  }

  onVendorInfoClick(vendorName) {
    this.setState({
      [vendorName]: !this.state[vendorName]
    });
  }

  render() {
    return (
      <div className="consent_vendor_list">
        {this.renderVendors()}
      </div>
    );
  }

  renderVendors() {
    if (!this.props.vendors.length) {
      return (
        <div className="consent_vendor_list-blank">
          {this.props.t('pageflow.public.consent_no_vendors')}
        </div>
      );
    }

    return this.props.vendors.map((vendor) => {
      const id = `consent_vendor_list-vendor_${vendor.name}`;

      return (
        <div key={id}
             className="consent_vendor_list-vendor">
          <label htmlFor={id}>
            {vendor.displayName}
          </label>
          <Toggle id={id}
                  className="consent_vendor_list-toggle"
                  defaultChecked={vendor.state === 'accepted'}
                  onChange={event => this.props.onVendorInputChange(vendor.name, event)} />
          <button className="consent_vendor_list-expand_vendor"
                  title={this.props.t('pageflow.public.consent_expand_vendor')}
                  onClick={() => this.handleVendorInfoClick(vendor.name)}>
            <InfoIcon width={20} height={20} />
          </button>
          {this.renderVendorDescription(vendor)}
        </div>
      );
    });
  }

  renderVendorDescription(vendor) {
    if (this.state[vendor.name]) {
      return (
        <p dangerouslySetInnerHTML={{__html: vendor.description}} />
      );
    }
    else {
      return null;
    }
  }
}
