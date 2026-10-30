import 'editor/config';

import {SideBarController} from 'editor/controllers/SideBarController';
import {CommentsView} from 'editor/views/CommentsView';
import {CommentActivityView} from 'editor/views/CommentActivityView';
import {MultiSelectionView} from 'editor/views/MultiSelectionView';

import {factories} from 'pageflow/testHelpers';
import {useEditorGlobals} from 'support';

describe('SideBarController', () => {
  const {createEntry} = useEditorGlobals();

  describe('#comments', () => {
    it('shows a CommentsView in the region', () => {
      const entry = createEntry({});
      entry.reviewSession = factories.reviewSession();

      const region = {show: jest.fn()};
      const controller = new SideBarController({region, entry});

      controller.comments();

      const shown = region.show.mock.calls[0][0];
      expect(shown).toBeInstanceOf(CommentsView);
    });

    it('passes the tab arg as defaultTab to the CommentsView', () => {
      const entry = createEntry({});
      entry.reviewSession = factories.reviewSession();

      const region = {show: jest.fn()};
      const controller = new SideBarController({region, entry});

      controller.comments('selection');

      const shown = region.show.mock.calls[0][0];
      expect(shown.options.defaultTab).toBe('selection');
    });
  });

  describe('#multiSelection', () => {
    it('passes items and selection mode to MultiSelectionView', () => {
      const entry = createEntry({});

      const region = {show: jest.fn()};
      const controller = new SideBarController({region, entry});

      controller.multiSelection(encodeURIComponent(JSON.stringify({
        itemType: 'contentElement',
        items: [{id: 1}],
        selectionMode: true
      })));

      const shown = region.show.mock.calls[0][0];
      expect(shown).toBeInstanceOf(MultiSelectionView);
      expect(shown.options).toMatchObject({
        itemType: 'contentElement',
        items: [{id: 1}],
        selectionMode: true
      });
    });
  });

  describe('#commentActivity', () => {
    it('shows a CommentActivityView in the region', () => {
      const entry = createEntry({});
      entry.reviewSession = factories.reviewSession();

      const region = {show: jest.fn()};
      const controller = new SideBarController({region, entry});

      controller.commentActivity();

      const shown = region.show.mock.calls[0][0];
      expect(shown).toBeInstanceOf(CommentActivityView);
    });
  });
});
