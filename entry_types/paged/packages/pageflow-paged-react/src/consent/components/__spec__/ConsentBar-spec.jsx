import {ConsentBar} from '../ConsentBar';

import {shallow} from 'enzyme';

describe('ConsentBar', () => {
  it('renders inputs for vendors', () => {
    const vendors = [{name: 'the_vendor', displayName: 'The Vendor'}];
    const wrapper = shallow(
      <ConsentBar requestedVendors={vendors} visible={true} t={() => {}}/>
    );

    expect(wrapper).toContainMatchingElement('#consent_bar-vendor_the_vendor');
  });

  it('forwards input values as arguments to save', () => {
    const vendors = [
      {name: 'vendor_a', displayName: 'Vendor A'},
      {name: 'vendor_b', displayName: 'Vendor B'},
      {name: 'vendor_c', displayName: 'Vendor C'}
    ];
    const listener = jest.fn();

    const wrapper = shallow(
      <ConsentBar
        save={listener} requestedVendors={vendors} visible={true} t={() => {}}/>
    );

    wrapper.find('#consent_bar-vendor_vendor_b').simulate('change', {target: {checked: true}});
    wrapper.find('.consent_bar-save').simulate('click');

    expect(listener).toHaveBeenCalledWith({
      vendor_a: false,
      vendor_b: true,
      vendor_c: false
    });
  });
});
