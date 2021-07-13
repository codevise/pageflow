import {Settings} from '../Settings';

import {mount} from 'enzyme';

describe('Settings', () => {
  it('renders items for relevant vendors', () => {
    const consent = {
      relevantVendors() {
        return [{name: 'test', displayName: 'TeSt Provider'}];
      }
    };

    const wrapper = mount(
      <Settings consent={consent} t={() => {}} />
    );

    expect(wrapper).toContainMatchingElement('input#consent_vendor_list-vendor_test');
    expect(wrapper).toHaveText(' TeSt Provider');
  });

  it('checks item if accepted', () => {
    const consent = {
      relevantVendors() {
        return [
          {name: 'test', displayName: 'TeSt Provider', state: 'accepted'},
          {name: 'other', displayName: 'Other Provider', state: 'undecided'},
        ];
      }
    };

    const wrapper = mount(
      <Settings consent={consent} t={() => {}} />
    );

    expect(
      wrapper.find('input#consent_vendor_list-vendor_test').props().defaultChecked
    ).toEqual(true);
    expect(
      wrapper.find('input#consent_vendor_list-vendor_other').props().defaultChecked
    ).toEqual(false);
  });

  it('denies consent for vendor when input is toggled to not be checked', () => {
    const consent = {
      relevantVendors() {
        return [
          {name: 'test', displayName: 'TeSt Provider', state: 'accepted'}
        ];
      },

      deny: jest.fn()
    };

    const wrapper = mount(
      <Settings consent={consent} t={() => {}} />
    );
    wrapper.find('input#consent_vendor_list-vendor_test').simulate(
      'change',
      {target: {checked: false}}
    );

    expect(consent.deny).toHaveBeenCalledWith('test');
  });

  it('accepts consent for vendor when input is toggled to be checked', () => {
    const consent = {
      relevantVendors() {
        return [
          {name: 'test', displayName: 'TeSt Provider', state: 'undecided'}
        ];
      },

      accept: jest.fn()
    };

    const wrapper = mount(
      <Settings consent={consent} t={() => {}} />
    );
    wrapper.find('input#consent_vendor_list-vendor_test').simulate(
      'change',
      {target: {checked: true}}
    );

    expect(consent.accept).toHaveBeenCalledWith('test');
  });
});
