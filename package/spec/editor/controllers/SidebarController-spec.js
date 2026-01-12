import Marionette from 'backbone.marionette';

import {editor, SidebarController} from 'pageflow/editor';

import * as support from '$support';

describe('SidebarController', () => {
  describe('#defaults', () => {
    it('renders editDefaultsView registered by entry type', () => {
      const EditDefaultsView = Marionette.View.extend();
      editor.registerEntryType('test', {
        editDefaultsView: EditDefaultsView
      });
      const entry = support.factories.entry();
      const region = fakeRegion();
      const controller = new SidebarController({region, entry});

      controller.defaults();

      expect(region.show).toHaveBeenCalledWith(expect.any(EditDefaultsView));
    });

    it('passes entry metadata as model', () => {
      const EditDefaultsView = Marionette.View.extend();
      editor.registerEntryType('test', {
        editDefaultsView: EditDefaultsView
      });
      const entry = support.factories.entry();
      const region = fakeRegion();
      const controller = new SidebarController({region, entry});

      controller.defaults();

      expect(region.show).toHaveBeenCalledWith(
        expect.objectContaining({model: entry.metadata})
      );
    });

    it('does not render if entry type has no editDefaultsView', () => {
      editor.registerEntryType('test', {});
      const entry = support.factories.entry();
      const region = fakeRegion();
      const controller = new SidebarController({region, entry});

      controller.defaults();

      expect(region.show).not.toHaveBeenCalled();
    });
  });

  function fakeRegion() {
    return {show: jest.fn()};
  }
});
