import React from 'react';

import {Heading} from 'contentElements/heading/Heading';

import {renderInContentElement} from 'pageflow-scrolled/testHelpers';
import {contentElementWidths} from 'pageflow-scrolled/frontend';

import styles from 'contentElements/heading/Heading.module.css';

import '@testing-library/jest-dom/extend-expect';

describe('Heading', () => {
  function renderHeading({configuration, width, sectionProps} = {}) {
    return renderInContentElement(
      <Heading
        configuration={{
          value: [{type: 'heading', children: [{text: 'Test'}]}],
          ...configuration
        }}
        contentElementId={5}
        contentElementWidth={width || contentElementWidths.md}
        sectionProps={{sectionIndex: 1, ...sectionProps}}
      />, {
        editorState: {isEditable: false}
      }
    );
  }

  it('centers heading with width lg when constrainContentWidth is set', () => {
    const {container} = renderHeading({
      width: contentElementWidths.lg,
      sectionProps: {constrainContentWidth: true}
    });

    expect(container.querySelector('header')).toHaveClass(styles.centerConstrained);
  });

  it('does not center heading with width xl when constrainContentWidth is set', () => {
    const {container} = renderHeading({
      width: contentElementWidths.xl,
      sectionProps: {constrainContentWidth: true}
    });

    expect(container.querySelector('header')).not.toHaveClass(styles.centerConstrained);
  });
});
