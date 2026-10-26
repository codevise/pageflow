import React from 'react';

import {Heading} from 'contentElements/heading/Heading';

import {renderInContentElement} from 'pageflow-scrolled/testHelpers';
import {contentElementWidths} from 'pageflow-scrolled/frontend';

import styles from 'contentElements/heading/Heading.module.css';

import '@testing-library/jest-dom/extend-expect';
import {editableTextValue} from 'support';

describe('Heading', () => {
  function renderHeading({configuration, width, sectionProps, inlineEditing} = {}) {
    return renderInContentElement(
      <Heading
        configuration={{
          value: editableTextValue('Test', {type: 'heading'}),
          ...configuration
        }}
        contentElementId={5}
        contentElementWidth={width || contentElementWidths.md}
        sectionProps={{sectionIndex: 1, ...sectionProps}}
      />,
      {inlineEditing}
    );
  }

  it('does not render blank tagline and subtitle', () => {
    const {queryAllByRole} = renderHeading({
      configuration: {
        tagline: editableTextValue('', {type: 'heading'}),
        subtitle: editableTextValue('', {type: 'heading'})
      }
    });

    expect(queryAllByRole('doc-subtitle')).toHaveLength(0);
  });

  it('renders blank tagline and subtitle when selected', () => {
    const {queryAllByRole} = renderHeading({
      configuration: {
        tagline: editableTextValue('', {type: 'heading'}),
        subtitle: editableTextValue('', {type: 'heading'})
      },
      inlineEditing: {isSelected: true}
    });

    expect(queryAllByRole('doc-subtitle')).toHaveLength(2);
  });

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
