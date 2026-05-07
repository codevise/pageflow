import 'editor/config';

import {SideBarController} from 'editor/controllers/SideBarController';
import {CommentsView} from 'editor/views/CommentsView';
import {ContentElementCommentsView} from 'editor/views/ContentElementCommentsView';

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

  describe('#contentElementComments', () => {
    it('shows a ContentElementCommentsView in the region', () => {
      const entry = createEntry({
        contentElements: [{id: 1, permaId: 10, typeName: 'textBlock'}]
      });
      entry.reviewSession = factories.reviewSession();

      const region = {show: jest.fn()};
      const controller = new SideBarController({region, entry});

      controller.contentElementComments();

      const shown = region.show.mock.calls[0][0];
      expect(shown).toBeInstanceOf(ContentElementCommentsView);
    });
  });
});
