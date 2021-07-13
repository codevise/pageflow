import {ConsentBar} from '../ConsentBar';

import {mount} from 'enzyme';

describe('ConsentBar', () => {
  it('renders inputs for vendors', () => {
    const vendors = [{name: 'the_vendor', displayName: 'The Vendor'}];
    const wrapper = mount(
      <ConsentBar requestedVendors={vendors} visible={true} t={() => {}}/>
    );

    wrapper.find('.consent_bar-configure').simulate('click');

    expect(wrapper).toContainMatchingElement('#consent_vendor_list-vendor_the_vendor');
  });

  it('forwards input values as arguments to save', () => {
    const vendors = [
      {name: 'vendor_a', displayName: 'Vendor A'},
      {name: 'vendor_b', displayName: 'Vendor B'},
      {name: 'vendor_c', displayName: 'Vendor C'}
    ];
    const listener = jest.fn();

    const wrapper = mount(
      <ConsentBar
        save={listener} requestedVendors={vendors} visible={true} t={() => {}}/>
    );

    wrapper.find('.consent_bar-configure').simulate('click');
    wrapper.find('button#consent_vendor_list-vendor_vendor_b').simulate('click');
    wrapper.find('.consent_bar-save').simulate('click');

    expect(listener).toHaveBeenCalledWith({
      vendor_a: false,
      vendor_b: true,
      vendor_c: false
    });
  });

  it('handles update of requestedVendors prop correctly', () => {
    const vendors = [
      {name: 'vendor_a', displayName: 'Vendor A'},
      {name: 'vendor_b', displayName: 'Vendor B'},
      {name: 'vendor_c', displayName: 'Vendor C'}
    ];
    const listener = jest.fn();

    const wrapper = mount(
      <ConsentBar
        save={listener} requestedVendors={[]} visible={false} t={() => {}}/>
    );

    wrapper.setProps({requestedVendors: vendors, visible: true});
    wrapper.find('.consent_bar-configure').simulate('click');
    wrapper.find('.consent_bar-save').simulate('click');

    expect(listener).toHaveBeenCalledWith({
      vendor_a: false,
      vendor_b: false,
      vendor_c: false
    });

  });
});
