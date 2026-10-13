import React from 'react';

import {LogoList} from 'contentElements/logoList/LogoList';
import styles from 'contentElements/logoList/LogoList.module.css';

import {renderInContentElement} from 'pageflow-scrolled/testHelpers';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect'

describe('LogoList editor selection', () => {
  const seed = {
    imageFileUrlTemplates: {medium: ':id_partition/medium/image.webp'},
    imageFiles: [{id: 1, permaId: 100}, {id: 2, permaId: 101}]
  };

  const items = [{id: 1, image: 100}, {id: 2, image: 101}];

  function renderLogoList(inlineEditing) {
    return renderInContentElement(
      <LogoList configuration={{items}} contentElementId={1} />,
      {seed, inlineEditing: {isSelected: true, ...inlineEditing}}
    );
  }

  it('sets selected item id in transient state', async () => {
    const setTransientState = jest.fn();
    const user = userEvent.setup();
    const {getAllByRole} = renderLogoList({transientState: setTransientState});

    await user.click(getAllByRole('listitem')[1]);

    expect(setTransientState).toHaveBeenCalledWith({selectedItemId: 2});
  });

  it('resets selected item id in transient state when clicking outside logos', async () => {
    const setTransientState = jest.fn();
    const user = userEvent.setup();
    const {getByRole} = renderLogoList({transientState: setTransientState});

    await user.click(getByRole('list'));

    expect(setTransientState).toHaveBeenCalledWith({selectedItemId: null});
  });

  it('supports setting selected item via command', () => {
    const {getAllByRole, triggerEditorCommand} = renderLogoList();

    triggerEditorCommand({type: 'SET_SELECTED_ITEM', index: 1});

    expect(getAllByRole('listitem')[0]).not.toHaveClass(styles.selected);
    expect(getAllByRole('listitem')[1]).toHaveClass(styles.selected);
  });

  it('supports resetting selected item via command', () => {
    const {container, triggerEditorCommand} = renderLogoList();

    triggerEditorCommand({type: 'SET_SELECTED_ITEM', index: 1});
    triggerEditorCommand({type: 'SET_SELECTED_ITEM', index: -1});

    expect(container.querySelector(`.${styles.selected}`)).toBeNull();
  });

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
