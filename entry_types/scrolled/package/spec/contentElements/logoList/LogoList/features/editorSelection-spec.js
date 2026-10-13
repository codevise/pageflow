import React from 'react';

import {LogoList} from 'contentElements/logoList/LogoList';
import styles from 'contentElements/logoList/LogoList.module.css';

import {renderInContentElement} from 'pageflow-scrolled/testHelpers';
import '@testing-library/jest-dom/extend-expect'

describe('LogoList editor selection', () => {
  const seed = {
    imageFileUrlTemplates: {medium: ':id_partition/medium/image.webp'},
    imageFiles: [{id: 1, permaId: 100}, {id: 2, permaId: 101}]
  };

  const items = [{id: 1, image: 100}, {id: 2, image: 101}];

  function renderLogoList() {
    return renderInContentElement(
      <LogoList configuration={{items}} contentElementId={1} />,
      {seed, inlineEditing: {isSelected: true}}
    );
  }

  it('supports highlighting item via command', () => {
    const {getAllByRole, triggerEditorCommand} = renderLogoList();

    triggerEditorCommand({type: 'HIGHLIGHT_ITEM', index: 1});

    expect(getAllByRole('listitem')[0]).not.toHaveClass(styles.highlighted);
    expect(getAllByRole('listitem')[1]).toHaveClass(styles.highlighted);
  });

  it('supports resetting item highlight via command', () => {
    const {container, triggerEditorCommand} = renderLogoList();

    triggerEditorCommand({type: 'HIGHLIGHT_ITEM', index: 1});
    triggerEditorCommand({type: 'RESET_ITEM_HIGHLIGHT'});

    expect(container.querySelector(`.${styles.highlighted}`)).toBeNull();
  });
});
