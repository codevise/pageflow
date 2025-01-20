import React from 'react';

import {ExternalLinkList} from 'contentElements/externalLinkList/frontend/ExternalLinkList';
import linkStyles from 'contentElements/externalLinkList/frontend/ExternalLink.module.css';

import {loadInlineEditingComponents} from 'frontend/inlineEditing';
import {renderInContentElement} from 'pageflow-scrolled/testHelpers';
import {screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect'

describe('ExternalLinkList', () => {
  beforeAll(loadInlineEditingComponents);

  it('sets selected item id in transient state in editor', async () => {
    const configuration = {
      itemLinks: {
        1: {href: 'https://example.com/'},
        2: {href: 'https://example.com/other'}
      },
      itemTexts: {
        1: {title: value('Some link')},
        2: {title: value('Other link')}
      },
      links: [
        {id: 1},
        {id: 2}
      ]
    };
    const setTransientState = jest.fn();

    const user = userEvent.setup();
    renderInContentElement(
      <ExternalLinkList configuration={configuration} sectionProps={{}} />,
      {
        editorState: {isEditable: true, isSelected: true, setTransientState}
      }
    );
    await user.click(screen.getByText('Some link').closest('li'));

    expect(setTransientState).toHaveBeenCalledWith({selectedItemId: 1})
  });

  it('applies selected style to clicked item if element selected', async () => {
    const configuration = {
      itemLinks: {
        1: {href: 'https://example.com/'},
        2: {href: 'https://example.com/other'}
      },
      itemTexts: {
        1: {title: value('Some link')},
        2: {title: value('Other link')}
      },
      links: [
        {id: 1},
        {id: 2}
      ]
    };
    const user = userEvent.setup();
    const {container} = renderInContentElement(
      <ExternalLinkList configuration={configuration} sectionProps={{}} />,
      {
        editorState: {isEditable: true, isSelected: true}
      }
    );
    await user.click(screen.getByText('Some link').closest('li'));

    expect(container.querySelector(`.${linkStyles.selected}`)).not.toBeNull();
  });

  it('does not apply selected style to clicked item if element not selected', async () => {
    const configuration = {
      itemLinks: {
        1: {href: 'https://example.com/'},
        2: {href: 'https://example.com/other'}
      },
      itemTexts: {
        1: {title: value('Some link')},
        2: {title: value('Other link')}
      },
      links: [
        {id: 1},
        {id: 2}
      ]
    };

    const user = userEvent.setup();
    const {container} = renderInContentElement(
      <ExternalLinkList configuration={configuration} sectionProps={{}} />,
      {
        editorState: {isEditable: true}
      }
    );
    await user.click(screen.getByText('Some link').closest('li'));

    expect(container.querySelector(`.${linkStyles.selected}`)).toBeNull();
  });

  it('resets selected item when clicking outside items', async () => {
    const configuration = {
      itemLinks: {
        1: {href: 'https://example.com/'},
        2: {href: 'https://example.com/other'}
      },
      itemTexts: {
        1: {title: value('Some link')},
        2: {title: value('Other link')}
      },
      links: [
        {id: 1},
        {id: 2}
      ]
    };
    const setTransientState = jest.fn();

    const user = userEvent.setup();
    const {container} = renderInContentElement(
      <ExternalLinkList configuration={configuration} sectionProps={{}} />,
      {
        editorState: {isEditable: true, isSelected: true, setTransientState}
      }
    );
    const link = screen.getByText('Some link').closest('li');

    await user.click(link);
    await user.click(link.closest('ul'));

    expect(container.querySelector(`.${linkStyles.selected}`)).toBeNull();
    expect(setTransientState).toHaveBeenCalledWith({selectedItemId: null})
  });

  it('supports highlighting item via command', () => {
    const configuration = {
      links: [
        {id: 1}
      ]
    };

    const {container, triggerEditorCommand} = renderInContentElement(
      <ExternalLinkList configuration={configuration} sectionProps={{}} />,
      {
        editorState: {isSelected: true, isEditable: true}
      }
    );
    triggerEditorCommand({type: 'HIGHLIGHT_ITEM', index: 0});

    expect(container.querySelector(`.${linkStyles.highlighted}`)).not.toBeNull();
  });

  it('supports resetting item highlight via command', () => {
    const configuration = {
      links: [
        {id: 1}
      ]
    };

    const {container, triggerEditorCommand} = renderInContentElement(
      <ExternalLinkList configuration={configuration} sectionProps={{}} />,
      {
        editorState: {isSelected: true, isEditable: true}
      }
    );

    triggerEditorCommand({type: 'HIGHLIGHT_ITEM', index: 0});
    triggerEditorCommand({type: 'RESET_ITEM_HIGHLIGHT'});

    expect(container.querySelector(`.${linkStyles.highlighted}`)).toBeNull();
  });

  it('supports setting selected item via command', () => {
    const configuration = {
      links: [
        {id: 1}
      ]
    };

    const {container, triggerEditorCommand} = renderInContentElement(
      <ExternalLinkList configuration={configuration} sectionProps={{}} />,
      {
        editorState: {isSelected: true, isEditable: true}
      }
    );
    triggerEditorCommand({type: 'SET_SELECTED_ITEM', index: 0});

    expect(container.querySelector(`.${linkStyles.selected}`)).not.toBeNull();
  });
});

function value(text) {
  return [{
    type: 'heading',
    children: [{text}],
  }];
}
