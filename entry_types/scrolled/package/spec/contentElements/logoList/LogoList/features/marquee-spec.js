import React from 'react';

import {LogoList} from 'contentElements/logoList/LogoList';
import styles from 'contentElements/logoList/LogoList.module.css';

import {fireEvent} from '@testing-library/react';
import {renderInContentElement} from 'pageflow-scrolled/testHelpers';
import '@testing-library/jest-dom/extend-expect'

describe('LogoList marquee', () => {
  const seed = {
    imageFileUrlTemplates: {medium: ':id_partition/medium/image.webp'},
    imageFiles: [{id: 1, permaId: 100}, {id: 2, permaId: 101}]
  };

  const items = [{id: 1, image: 100}, {id: 2, image: 101}];

  function renderLogoList(configuration, options = {}) {
    const result = renderInContentElement(
      <LogoList configuration={configuration} contentElementId={1} />,
      {seed, ...options}
    );

    result.simulateScrollPosition('near viewport');

    return result;
  }

  it('renders single list by default', () => {
    const {container} = renderLogoList({items});

    expect(container.querySelectorAll('ul')).toHaveLength(1);
    expect(container.querySelector(`.${styles.marquee}`)).toBeNull();
  });

  it('renders inert duplicate list to loop logos', () => {
    const {container} = renderLogoList({items, marquee: true});
    const lists = container.querySelectorAll(`.${styles.marquee} ul`);

    expect(lists).toHaveLength(2);
    expect(lists[0]).not.toHaveAttribute('inert');
    expect(lists[1]).toHaveAttribute('inert');
  });

  it('passes logo count to animation duration', () => {
    const {container} = renderLogoList({items, marquee: true});

    expect(container.querySelector(`.${styles.marquee}`))
      .toHaveStyle('--logo-count: 2');
  });

  it('uses theme scale property for marquee speed', () => {
    const {container} = renderLogoList({items, marquee: true, marqueeSpeed: 'xl'});

    expect(container.querySelector(`.${styles.marquee}`))
      .toHaveStyle('--marquee-speed: var(--theme-logo-list-marquee-speed-xl)');
  });

  it('does not set marquee speed by default', () => {
    const {container} = renderLogoList({items, marquee: true});

    expect(container.querySelector(`.${styles.marquee}`)
                    .style.getPropertyValue('--marquee-speed')).toBe('');
  });

  it('scrolls focused logo into view', () => {
    const {container} = renderLogoList({
      items,
      marquee: true,
      itemLinks: {1: {href: 'https://example.com'}}
    });
    const link = container.querySelector('ul:not([inert]) a');
    link.scrollIntoView = jest.fn();

    fireEvent.focus(link);

    expect(link.scrollIntoView)
      .toHaveBeenCalledWith({block: 'nearest', inline: 'nearest'});
  });

  it('resets scroll position when focus leaves marquee', () => {
    const {container} = renderLogoList({
      items,
      marquee: true,
      itemLinks: {1: {href: 'https://example.com'}}
    });
    const marquee = container.querySelector(`.${styles.marquee}`);
    const link = container.querySelector('ul:not([inert]) a');
    link.scrollIntoView = jest.fn();
    marquee.scrollLeft = 100;

    fireEvent.blur(link, {relatedTarget: document.body});

    expect(marquee.scrollLeft).toBe(0);
  });

  it('keeps scroll position when focus moves to other logo', () => {
    const {container} = renderLogoList({
      items,
      marquee: true,
      itemLinks: {
        1: {href: 'https://example.com'},
        2: {href: 'https://example.com/other'}
      }
    });
    const marquee = container.querySelector(`.${styles.marquee}`);
    const [link, otherLink] = container.querySelectorAll('ul:not([inert]) a');
    marquee.scrollLeft = 100;

    fireEvent.blur(link, {relatedTarget: otherLink});

    expect(marquee.scrollLeft).toBe(100);
  });

  it('renders marquee while selected in editor during preview', () => {
    const {container, triggerEditorCommand} =
      renderLogoList({items, marquee: true}, {inlineEditing: {isSelected: true}});

    triggerEditorCommand({type: 'START_MARQUEE_PREVIEW'});

    expect(container.querySelector(`.${styles.marquee}`)).not.toBeNull();
  });

  it('renders static list again when preview stops', () => {
    const {container, triggerEditorCommand} =
      renderLogoList({items, marquee: true}, {inlineEditing: {isSelected: true}});

    triggerEditorCommand({type: 'START_MARQUEE_PREVIEW'});
    triggerEditorCommand({type: 'STOP_MARQUEE_PREVIEW'});

    expect(container.querySelector(`.${styles.marquee}`)).toBeNull();
  });

  it('renders static list while selected in editor', () => {
    const {container} = renderLogoList({items, marquee: true},
                                       {inlineEditing: {isSelected: true}});

    expect(container.querySelectorAll('ul')).toHaveLength(1);
    expect(container.querySelector(`.${styles.marquee}`)).toBeNull();
  });
});
