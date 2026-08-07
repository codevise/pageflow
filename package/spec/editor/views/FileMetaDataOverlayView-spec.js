import {FileMetaDataItemValueView, FileMetaDataOverlayView} from 'pageflow/editor';

import * as support from '$support';
import {FileMetaDataTable, FileStageItem} from '$support/dominos/editor';
import {renderBackboneView as render} from 'pageflow/testHelpers';

describe('FileMetaDataOverlayView', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  // Which overlay is open is tracked across instances, so a pinned
  // overlay would otherwise leak into the next example.
  beforeEach(() => {
    FileMetaDataOverlayView.currentlyOpen = null;
  });

  support.useFakeTranslations({
    'pageflow.editor.templates.file_item.source': 'Source',
    'pageflow.editor.templates.file_item.download': 'Download'
  });

  function overlayView(file, options) {
    const reference = document.createElement('div');
    document.body.appendChild(reference);

    return new FileMetaDataOverlayView({
      model: file,
      reference,
      ...options
    });
  }

  it('renders meta data items', () => {
    const file = support.factories.file({dimension: '200x100px'});

    const view = overlayView(file, {metaDataAttributes: ['dimension']});

    render(view);

    expect(FileMetaDataTable.find(view).values())
      .toEqual(expect.arrayContaining(['200x100px']));
  });

  it('renders meta data items with custom view and options', () => {
    const file = support.factories.file({dimension: '200x100px'});

    const view = overlayView(file, {
      metaDataAttributes: [
        {
          name: 'dimension',
          valueView: FileMetaDataItemValueView.extend({
            getText: function() {
              return this.model.get(this.options.name) + this.options.suffix;
            }
          }),
          valueViewOptions: {
            suffix: '!!'
          }
        }
      ]
    });

    render(view);

    expect(FileMetaDataTable.find(view).values())
      .toEqual(expect.arrayContaining(['200x100px!!']));
  });

  it('links to download_url', () => {
    const file = support.factories.file({
      original_url: '/path/file.png',
      display_name: 'My File',
      state: 'processed'
    });

    const view = overlayView(file);

    const {getByRole} = render(view);

    expect(getByRole('link', {name: 'Download'}).getAttribute('href'))
      .toBe('/path/file.png?download=My%20File');
  });

  it('shows only the stage the file is waiting on', () => {
    const file = support.factories.file({id: 123, state: 'uploading'});

    const view = overlayView(file);

    render(view);

    expect(FileStageItem.findAll(view).length).toBe(1);
  });

  it('hides stages once the file is ready', () => {
    const file = support.factories.file({id: 123, state: 'processed'});

    const view = overlayView(file);

    render(view);

    expect(FileStageItem.findAll(view).length).toBe(0);
    expect(view.$el.find('.file_stage_items')).not.toBeVisible();
  });

  it('is closed initially', () => {
    const view = overlayView(support.factories.file({id: 123}));

    render(view);

    expect(view.isOpen()).toBe(false);
    expect(view.el).not.toHaveClass('is_open');
  });

  it('opens and dismisses', () => {
    const view = overlayView(support.factories.file({id: 123}));

    render(view);
    view.open();

    expect(view.isOpen()).toBe(true);
    expect(view.el).toHaveClass('is_open');

    view.dismiss();

    expect(view.isOpen()).toBe(false);
    expect(view.el).not.toHaveClass('is_open');
  });

  it('triggers toggle event when opened and dismissed', () => {
    const view = overlayView(support.factories.file({id: 123}));
    const listener = jest.fn();

    render(view);
    view.on('toggle', listener);
    view.open();
    view.dismiss();

    expect(listener).toHaveBeenCalledTimes(2);
  });

  it('dismisses previously opened overlay', () => {
    const view = overlayView(support.factories.file({id: 123}));
    const otherView = overlayView(support.factories.file({id: 456}));

    render(view);
    render(otherView);
    view.open();
    otherView.open();

    expect(view.isOpen()).toBe(false);
    expect(otherView.isOpen()).toBe(true);
  });

  it('dismisses when view is closed', () => {
    const view = overlayView(support.factories.file({id: 123}));

    render(view);
    view.open();
    view.close();

    expect(view.isOpen()).toBe(false);
  });

  describe('dismissing after a delay', () => {
    it('dismisses when nothing cancels it', () => {
      const view = overlayView(support.factories.file({id: 123}));

      render(view);
      view.open();
      view.scheduleDismiss();
      jest.runAllTimers();

      expect(view.isOpen()).toBe(false);
    });

    it('is cancelled by opening again', () => {
      const view = overlayView(support.factories.file({id: 123}));

      render(view);
      view.open();
      view.scheduleDismiss();
      view.open();
      jest.runAllTimers();

      expect(view.isOpen()).toBe(true);
    });

    it('does not happen while locked', () => {
      const view = overlayView(support.factories.file({id: 123}));

      render(view);
      view.toggleLock();
      view.scheduleDismiss();
      jest.runAllTimers();

      expect(view.isOpen()).toBe(true);
    });
  });

  describe('locking', () => {
    it('opens the overlay', () => {
      const view = overlayView(support.factories.file({id: 123}));

      render(view);
      view.toggleLock();

      expect(view.isOpen()).toBe(true);
      expect(view.isLocked()).toBe(true);
    });

    it('unlocks when toggled again', () => {
      const view = overlayView(support.factories.file({id: 123}));

      render(view);
      view.toggleLock();
      jest.runAllTimers();
      view.toggleLock();

      expect(view.isLocked()).toBe(false);
    });

    it('dismisses on click outside', () => {
      const view = overlayView(support.factories.file({id: 123}));

      render(view);
      view.toggleLock();
      jest.runAllTimers();
      document.body.click();

      expect(view.isOpen()).toBe(false);
      expect(view.isLocked()).toBe(false);
    });

    it('stays open on click inside', () => {
      const view = overlayView(support.factories.file({id: 123}));

      render(view);
      view.toggleLock();
      jest.runAllTimers();
      view.el.click();

      expect(view.isOpen()).toBe(true);
    });

    it('stays open on click on reference', () => {
      const view = overlayView(support.factories.file({id: 123}));

      render(view);
      view.toggleLock();
      jest.runAllTimers();
      view.options.reference.click();

      expect(view.isOpen()).toBe(true);
    });

    it('is not dismissed by opening another overlay on hover', () => {
      const view = overlayView(support.factories.file({id: 123}));
      const otherView = overlayView(support.factories.file({id: 456}));

      render(view);
      render(otherView);
      view.toggleLock();
      otherView.openUnlessPinned();

      expect(view.isOpen()).toBe(true);
      expect(otherView.isOpen()).toBe(false);
    });

    it('is dismissed by locking another overlay', () => {
      const view = overlayView(support.factories.file({id: 123}));
      const otherView = overlayView(support.factories.file({id: 456}));

      render(view);
      render(otherView);
      view.toggleLock();
      otherView.toggleLock();

      expect(view.isOpen()).toBe(false);
      expect(view.isLocked()).toBe(false);
      expect(otherView.isLocked()).toBe(true);
    });

    it('is dismissed by editing a meta data attribute', () => {
      // Opening the settings dialog is up to the value view.
      const ValueView = FileMetaDataItemValueView.extend({
        events: {},
        getText: () => 'value'
      });
      const view = overlayView(support.factories.file({id: 123}), {
        metaDataAttributes: [
          {
            name: 'rights',
            valueView: ValueView,
            valueViewOptions: {settingsDialogTabLink: 'general'}
          }
        ]
      });

      render(view);
      view.toggleLock();
      jest.runAllTimers();
      view.$el.find('.file_meta_data button.edit').trigger('click');

      expect(view.isOpen()).toBe(false);
      expect(view.isLocked()).toBe(false);
    });

    it('stops listening for outside clicks once dismissed', () => {
      const view = overlayView(support.factories.file({id: 123}));

      render(view);
      view.toggleLock();
      jest.runAllTimers();
      view.dismiss();
      view.open();
      document.body.click();

      expect(view.isOpen()).toBe(true);
    });
  });
});
