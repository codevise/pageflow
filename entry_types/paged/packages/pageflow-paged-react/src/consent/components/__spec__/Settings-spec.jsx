import {Settings, vendorsFromQueryString} from '../Settings';

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

    expect(wrapper).toContainMatchingElement('button#consent_vendor_list-vendor_test');
    expect(wrapper).toHaveText('TeSt Provider');
  });

  it('supports requesting additional vendors via query string', () => {
    const consent = {
      relevantVendors: jest.fn().mockReturnValue([])
    };

    mount(
      <Settings queryString={'?lang=en&vendors=test'} consent={consent} t={() => {}} />
    );

    expect(consent.relevantVendors).toHaveBeenCalledWith({include: ['test']});
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
      wrapper.find('button#consent_vendor_list-vendor_test').props()['aria-checked']
    ).toEqual(true);
    expect(
      wrapper.find('button#consent_vendor_list-vendor_other').props()['aria-checked']
    ).toEqual(false);
  });

  it('denies consent for vendor when button is toggled to not be checked', () => {
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
    wrapper.find('button#consent_vendor_list-vendor_test').simulate('click');

    expect(consent.deny).toHaveBeenCalledWith('test');
  });

  it('accepts consent for vendor when button is toggled to be checked', () => {
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
    wrapper.find('button#consent_vendor_list-vendor_test').simulate('click');

    expect(consent.accept).toHaveBeenCalledWith('test');
  });
});

describe('vendorsFromQueryString', () => {
  it('supports parsing singe vendor', () => {
    const result = vendorsFromQueryString('?vendors=test-vendor');

    expect(result).toEqual(['test-vendor']);
  });

  it('supports parsing multiple vendors', () => {
    const result = vendorsFromQueryString('?vendors=vendor1,vendor2');

    expect(result).toEqual(['vendor1', 'vendor2']);
  });

  it('supports query strings with multiple params', () => {
    const result = vendorsFromQueryString('?lang=de&vendors=vendor1,vendor2&other=foo');

    expect(result).toEqual(['vendor1', 'vendor2']);
  });
});
