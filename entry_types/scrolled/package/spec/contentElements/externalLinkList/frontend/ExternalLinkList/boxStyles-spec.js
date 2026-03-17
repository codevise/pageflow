import React from 'react';

import {ExternalLinkList} from 'contentElements/externalLinkList/frontend/ExternalLinkList';

import {renderInContentElement} from 'pageflow-scrolled/testHelpers';
import '@testing-library/jest-dom/extend-expect'

describe('ExternalLinkList box styles', () => {
  it('sets box shadow custom property from configuration', () => {
    const {container} = renderInContentElement(
      <ExternalLinkList configuration={{boxShadow: 'md', links: []}}
                        sectionProps={{}} />
    );

    const list = container.querySelector('ul');
    expect(list.style.getPropertyValue('--content-element-box-shadow'))
      .toEqual('var(--theme-content-element-box-shadow-md)');
  });

  it('sets outline color custom property from configuration', () => {
    const {container} = renderInContentElement(
      <ExternalLinkList configuration={{outlineColor: '#ff0000', links: []}}
                        sectionProps={{}} />
    );

    const list = container.querySelector('ul');
    expect(list.style.getPropertyValue('--content-element-box-outline-color'))
      .toEqual('#ff0000');
  });

  it('does not set custom properties when not configured', () => {
    const {container} = renderInContentElement(
      <ExternalLinkList configuration={{links: []}}
                        sectionProps={{}} />
    );

    const list = container.querySelector('ul');
    expect(list.style.getPropertyValue('--content-element-box-shadow')).toEqual('');
    expect(list.style.getPropertyValue('--content-element-box-outline-color')).toEqual('');
  });
});
