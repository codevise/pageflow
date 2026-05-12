import 'editor/config';

import {SideBarController} from 'editor/controllers/SideBarController';
import {ContentElementCommentsView} from 'editor/views/ContentElementCommentsView';

import {factories} from 'pageflow/testHelpers';
import {useEditorGlobals} from 'support';

describe('SideBarController', () => {
  const {createEntry} = useEditorGlobals();

  describe('#contentElementComments', () => {
    it('shows a ContentElementCommentsView without threadIds when no payload given', () => {
      const entry = createEntry({
        contentElements: [{id: 1, permaId: 10, typeName: 'textBlock'}]
      });
      entry.reviewSession = factories.reviewSession();

      const region = {show: jest.fn()};
      const controller = new SideBarController({region, entry});

      controller.contentElementComments(1);

      const shown = region.show.mock.calls[0][0];
      expect(shown).toBeInstanceOf(ContentElementCommentsView);
      expect(shown.options.threadIds).toBeUndefined();
    });

    it('decodes threadIds from the payload and passes it to the view', () => {
      const entry = createEntry({
        contentElements: [{id: 1, permaId: 10, typeName: 'textBlock'}]
      });
      entry.reviewSession = factories.reviewSession();

      const region = {show: jest.fn()};
      const controller = new SideBarController({region, entry});

      const payload = encodeURIComponent(JSON.stringify({threadIds: [3, 7]}));

      controller.contentElementComments(1, payload);

      const shown = region.show.mock.calls[0][0];
      expect(shown).toBeInstanceOf(ContentElementCommentsView);
      expect(shown.options.threadIds).toEqual([3, 7]);
    });
  });
});
