import 'editor/config';

import {SideBarController} from 'editor/controllers/SideBarController';
import {ContentElementCommentsView} from 'editor/views/ContentElementCommentsView';

import {factories} from 'pageflow/testHelpers';
import {useEditorGlobals} from 'support';

describe('SideBarController', () => {
  const {createEntry} = useEditorGlobals();

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
