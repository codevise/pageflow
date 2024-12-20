import React from 'react';

import {ExternalLinkList} from 'contentElements/externalLinkList/frontend/ExternalLinkList';
import linkStyles from 'contentElements/externalLinkList/frontend/ExternalLink.module.css';

import {renderInContentElement} from 'pageflow-scrolled/testHelpers';
import {screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect'

describe('ExternalLinkList', () => {
  it('sets selected item id in transient state in editor', async () => {
    const configuration = {
      links: [
        {
          id: 1,
          title: 'Some link',
          url: 'https://example.com/'
        },
        {
          id: 2,
          title: 'Other link',
          url: 'https://example.com/other'
        }
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
    await user.click(screen.getByRole('link', {name: 'Some link'}));

    expect(setTransientState).toHaveBeenCalledWith({selectedItemId: 1})
  });

  it('applies selected style to clicked item if element selected', async () => {
    const configuration = {
      links: [
        {
          id: 1,
          title: 'Some link',
          url: 'https://example.com/'
        },
        {
          id: 2,
          title: 'Other link',
          url: 'https://example.com/other'
        }
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
    await user.click(screen.getByRole('link', {name: 'Some link'}));

    expect(container.querySelector(`.${linkStyles.selected}`)).not.toBeNull();
  });

  it('does not apply selected style to clicked item if element not selected', async () => {
    const configuration = {
      links: [
        {
          id: 1,
          title: 'Some link',
          url: 'https://example.com/'
        },
        {
          id: 2,
          title: 'Other link',
          url: 'https://example.com/other'
        }
      ]
    };
    const setTransientState = jest.fn();

    const user = userEvent.setup();
    const {container} = renderInContentElement(
      <ExternalLinkList configuration={configuration} sectionProps={{}} />,
      {
        editorState: {isEditable: true, setTransientState}
      }
    );
    await user.click(screen.getByRole('link', {name: 'Some link'}));

    expect(container.querySelector(`.${linkStyles.selected}`)).toBeNull();
  });
});
