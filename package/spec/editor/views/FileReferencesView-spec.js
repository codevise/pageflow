import {FileReferencesView} from 'pageflow/editor';

import * as support from '$support';

describe('FileReferencesView', () => {
  support.useFakeTranslations({
    'pageflow.editor.views.file_references.header': 'Referenced by'
  });

  const {setGlobals} = support.setupGlobals({});

  function render({places}) {
    setGlobals({entry: {fileReferences: () => ({placesFor: () => places})}});

    const view = new FileReferencesView({model: support.factories.imageFile()});

    view.render();

    return view;
  }

  it('renders an item per reference', () => {
    const view = render({
      places: [{label: 'Intro - Section 1', pictogram: 'section.svg', select() {}},
               {label: 'Intro - Image', pictogram: 'image.svg', select() {}}]
    });

    expect(view.$el.find('.file_references-label').map((index, el) => el.textContent).get())
      .toEqual(['Intro - Section 1', 'Intro - Image']);
  });

  it('renders detail of reference on a second line', () => {
    const view = render({
      places: [{label: 'Intro - Section 1', detail: 'Background image',
                pictogram: 'section.svg', select() {}}]
    });

    expect(view.$el.find('.file_references-detail').text()).toEqual('Background image');
  });

  it('omits second line for reference without detail', () => {
    const view = render({
      places: [{label: 'Intro - Section 1', pictogram: 'section.svg', select() {}}]
    });

    expect(view.$el.find('.file_references-detail').length).toEqual(0);
  });

  it('renders header inside separator', () => {
    const view = render({
      places: [{label: 'Intro - Section 1', pictogram: 'section.svg', select() {}}]
    });

    expect(view.$el.find('.file_references-separator .file_references-header').text().trim())
      .toEqual('Referenced by');
  });

  it('renders pictogram of reference', () => {
    const view = render({
      places: [{label: 'Intro - Image', pictogram: 'image.svg', select() {}}]
    });

    expect(view.$el.find('.file_references-pictogram').attr('style'))
      .toContain("url('image.svg')");
  });

  it('selects the referencing model on click', () => {
    const select = jest.fn();
    const view = render({places: [{label: 'Intro - Image', pictogram: 'i.svg', select}]});

    view.$el.find('.file_references-item').first().click();

    expect(select).toHaveBeenCalled();
  });

  it('is hidden if file is not referenced', () => {
    const view = render({places: []});

    expect(view.$el.is(':hidden')).toEqual(true);
  });
});
