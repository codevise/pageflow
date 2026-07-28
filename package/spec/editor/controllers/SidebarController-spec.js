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

  describe('#files', () => {
    it('passes requested file type name to files view', () => {
      const {controller, region} = setupFiles();

      controller.files('image_files', 'some_handler', '{}');

      expect(shownView(region).options).toMatchObject({
        fileTypeName: 'image_files',
        allowSelectingAny: false
      });
    });

    it('allows selecting any file type if no collection name is given', () => {
      const {controller, region} = setupFiles();

      controller.files(null, 'some_handler', '{}');

      expect(shownView(region).options).toMatchObject({
        fileTypeName: undefined,
        allowSelectingAny: true
      });
    });

    it('allows selecting any file type for default suffix', () => {
      const {controller, region} = setupFiles();

      controller.files('image_files:default', 'some_handler', '{}');

      expect(shownView(region).options).toMatchObject({
        fileTypeName: 'image_files',
        allowSelectingAny: true
      });
    });

    function setupFiles() {
      editor.registerFileSelectionHandler('some_handler', function() {});

      const entry = support.factories.entry();
      const region = fakeRegion();

      return {controller: new SidebarController({region, entry}), region};
    }

    function shownView(region) {
      return region.show.mock.calls[0][0];
    }
  });

  function fakeRegion() {
    return {show: jest.fn()};
  }
});
