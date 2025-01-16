import Backbone from 'backbone';

import {
  ExternalLinkCollection
} from 'contentElements/externalLinkList/editor/models/ExternalLinkCollection';

import {factories, useEditorGlobals} from 'support';

describe('ExternalLinkCollection', () => {
  const {createEntry} = useEditorGlobals();

  describe('.addNewLink', () => {
    it('returns link for empty collection', () => {
      const contentElement = factories.contentElement();
      const itemsCollection = ExternalLinkCollection.forContentElement(contentElement);

      const item = itemsCollection.addNewLink();

      expect(item.id).toEqual(1);
    });

    it('generates uniq ids', () => {
      const contentElement = factories.contentElement({
        configuration: {
          links: [
            {id: 1},
            {id: 3},
          ]
        }
      });
      const itemsCollection = ExternalLinkCollection.forContentElement(contentElement);

      const item = itemsCollection.addNewLink();

      expect(item.id).toEqual(4);
    });
  });

  it('updates content element configuration when item is added', () => {
    const contentElement = factories.contentElement();
    const itemsCollection = ExternalLinkCollection.forContentElement(contentElement);

    itemsCollection.addNewLink();
    itemsCollection.addNewLink();

    expect(contentElement.configuration.get('links')).toEqual([
      {id: 1},
      {id: 2}
    ]);
  });

  it('updates content element configuration when item is removed', () => {
    const contentElement = factories.contentElement({
      configuration: {
        links: [
          {id: 1},
          {id: 2},
        ]
      }
    });
    const linksCollection = ExternalLinkCollection.forContentElement(contentElement);

    linksCollection.remove(1);

    expect(contentElement.configuration.get('links')).toEqual([
      {id: 2}
    ])
  });

  it('updates content element configuration when item changes', () => {
    const contentElement = factories.contentElement({
      configuration: {
        links: [
          {id: 1},
        ]
      }
    });
    const linksCollection = ExternalLinkCollection.forContentElement(contentElement);

    linksCollection.get(1).set('tooltipPosition', 'above');

    expect(contentElement.configuration.get('links')).toEqual([
      {id: 1, tooltipPosition: 'above'}
    ])
  });

  it('prunes tooltip texts and link when removing an element with single change event', () => {
    const contentElement = factories.contentElement({
      configuration: {
        links: [
          {id: 1},
          {id: 2},
        ],
        itemTexts: {
          1: {title: [{children: [{text: 'Title for item 1'}]}]},
          2: {title: [{children: [{text: 'Title for item 2'}]}]},
        },
        itemLinks: {
          1: {href: 'https://example.com'},
          2: {href: 'https://other.example.com'},
        }
      }
    });
    const itemsCollection = ExternalLinkCollection.forContentElement(contentElement);
    const listener = jest.fn();

    contentElement.on('change:configuration', listener);
    itemsCollection.remove(1);

    expect(contentElement.configuration.get('itemTexts')).toEqual({
      2: {title: [{children: [{text: 'Title for item 2'}]}]}
    });
    expect(contentElement.configuration.get('itemLinks')).toEqual({
      2: {href: 'https://other.example.com'},
    });
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('posts content element command on highlight', () => {
    const contentElement = factories.contentElement({
      id: 10,
      configuration: {
        links: [
          {id: 1},
        ]
      }
    });
    const itemsCollection = ExternalLinkCollection.forContentElement(contentElement);
    const listener = jest.fn();

    contentElement.on('postCommand', listener);
    itemsCollection.get(1).highlight();

    expect(listener).toHaveBeenCalledWith(10, {type: 'HIGHLIGHT_ITEM', index: 0});
  });

  it('posts content element command on resetHighlight', () => {
    const contentElement = factories.contentElement({
      id: 10,
      configuration: {
        links: [
          {id: 1},
        ]
      }
    });
    const itemsCollection = ExternalLinkCollection.forContentElement(contentElement);
    const listener = jest.fn();

    contentElement.on('postCommand', listener);
    itemsCollection.get(1).resetHighlight();

    expect(listener).toHaveBeenCalledWith(10, {type: 'RESET_ITEM_HIGHLIGHT'});
  });

  it('return empty title by default', () => {
    const contentElement = factories.contentElement({
      id: 10,
      configuration: {
        links: [
          {id: 1},
        ]
      }
    });
    const itemsCollection = ExternalLinkCollection.forContentElement(contentElement);

    expect(itemsCollection.get(1).title()).toBeUndefined();
  });

  it('extracts title from tooltip texts', () => {
    const contentElement = factories.contentElement({
      id: 10,
      configuration: {
        itemTexts: {
          1: {
            title: [{children: [{text: 'Some title'}]}]
          }
        },
        links: [
          {id: 1},
        ]
      }
    });
    const itemsCollection = ExternalLinkCollection.forContentElement(contentElement);

    expect(itemsCollection.get(1).title()).toEqual('Some title');
  });

  it('falls back to legacy title', () => {
    const contentElement = factories.contentElement({
      id: 10,
      configuration: {
        links: [
          {
            id: 1,
            title: 'Some title'
          },
        ]
      }
    });
    const itemsCollection = ExternalLinkCollection.forContentElement(contentElement);

    expect(itemsCollection.get(1).title()).toEqual('Some title');
  });

  it('falls back to legacy title even if other items already use editble text', () => {
    const contentElement = factories.contentElement({
      id: 10,
      configuration: {
        itemTexts: {
          2: {
            title: [{children: [{text: 'Other title'}]}]
          }
        },
        links: [
          {
            id: 1,
            title: 'Some title'
          },
          {
            id: 2
          }
        ]
      }
    });
    const itemsCollection = ExternalLinkCollection.forContentElement(contentElement);

    expect(itemsCollection.get(1).title()).toEqual('Some title');
  });

  it('prefers empty title over legacy title', () => {
    const contentElement = factories.contentElement({
      id: 10,
      configuration: {
        itemTexts: {
          1: {
            title: [{children: [{text: ''}]}]
          }
        },
        links: [
          {
            id: 1,
            title: 'Some title'
          },
        ]
      }
    });
    const itemsCollection = ExternalLinkCollection.forContentElement(contentElement);

    expect(itemsCollection.get(1).title()).toEqual('');
  });

  it('returns thumbnail alt text if text position is none', () => {
    const entry = createEntry({
      imageFiles: [
        {perma_id: 10, configuration: {alt: 'Some Logo'}},
      ],
      contentElements: [
        {
          id: 1,
          typeName: 'externalLinkList',
          configuration: {
            textPosition: 'none',
            itemTexts: {
              1: {
                title: [{children: [{text: 'Some invisible text'}]}]
              }
            },
            links: [
              {
                id: 1,
                thumbnail: 10
              },
            ]
          }
        }
      ]
    });
    const itemsCollection = ExternalLinkCollection.forContentElement(
      entry.contentElements.get(1),
      entry
    );

    expect(itemsCollection.get(1).title()).toEqual('Some Logo');
  });
});
