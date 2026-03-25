import React from 'react';

import {ExternalLinkList} from 'contentElements/externalLinkList/frontend/ExternalLinkList';

import {renderInContentElement} from 'pageflow-scrolled/testHelpers';
import '@testing-library/jest-dom/extend-expect'

import styles from 'frontend/Placeholder.module.css';

describe('ExternalLinkList placeholder', () => {
  it('renders placeholder in editor', () => {
    const {container} = renderInContentElement(
      <ExternalLinkList configuration={{links: [{id: 1}]}}
                        sectionProps={{}} />,
      {editorState: {isEditable: true}}
    );

    expect(container.querySelector(`.${styles.placeholder}`)).not.toBeNull();
  });

  it('does not render placeholder in published entry', () => {
    const {container} = renderInContentElement(
      <ExternalLinkList configuration={{links: [{id: 1}]}}
                        sectionProps={{}} />,
      {editorState: {isEditable: false}}
    );

    expect(container.querySelector(`.${styles.placeholder}`)).toBeNull();
  });
});
