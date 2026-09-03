import React from 'react';

import {ImageGallery} from 'contentElements/imageGallery/ImageGallery';
import styles from 'contentElements/imageGallery/ImageGallery.module.css';

import {renderInContentElement} from 'pageflow-scrolled/testHelpers';
import 'support/fakeIntersectionObserver';

describe('ImageGallery', () => {
  const seed = {
    imageFileUrlTemplates: {large: ':id_partition/image.webp'},
    imageFiles: [{id: 1, permaId: 100}, {id: 2, permaId: 101}]
  };

  const configuration = {
    items: [{id: 1, image: 100}, {id: 2, image: 101}]
  };

  function render() {
    const {container, triggerEditorCommand} = renderInContentElement(
      <ImageGallery configuration={configuration} contentElementId={1} />,
      {seed, inlineEditing: {isSelected: true}}
    );

    const scroller = container.querySelector(`.${styles.items}`);
    scroller.scrollTo = jest.fn();

    Array.from(scroller.children).forEach((child, index) =>
      Object.defineProperty(child, 'offsetLeft', {value: index * 300, configurable: true})
    );

    return {scroller, triggerEditorCommand};
  }

  it('scrolls to the item of a SET_CURRENT_ITEM command', () => {
    const {scroller, triggerEditorCommand} = render();

    triggerEditorCommand({type: 'SET_CURRENT_ITEM', index: 1});

    expect(scroller.scrollTo).toHaveBeenCalledWith(300, 0);
  });

  it('ignores a SET_CURRENT_ITEM command for an unknown item', () => {
    const {scroller, triggerEditorCommand} = render();

    triggerEditorCommand({type: 'SET_CURRENT_ITEM', index: 5});

    expect(scroller.scrollTo).not.toHaveBeenCalled();
  });
});
