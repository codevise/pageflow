import {FragmentThumbnailView} from 'editor/views/FragmentThumbnailView';
import {Fragment} from 'editor/models/Fragment';
import {ScrolledEntry} from 'editor/models/ScrolledEntry';

import {renderBackboneView} from 'pageflow/testHelpers';
import {factories, normalizeSeed} from 'support';
import 'support/fakeResizeObserver';

describe('FragmentThumbnailView', () => {
  function createFragment() {
    return new Fragment({
      sections: [{permaId: 1000}],
      collections: normalizeSeed({
        sections: [{id: 10, permaId: 1000, chapterId: 1}],
        contentElements: [{
          sectionId: 10,
          typeName: 'heading',
          configuration: {children: 'Fragment heading'}
        }]
      }).collections
    });
  }

  function createEntry() {
    return factories.entry(ScrolledEntry, {}, {entryTypeSeed: normalizeSeed()});
  }

  it('renders first section of fragment', () => {
    const view = new FragmentThumbnailView({model: createFragment(), entry: createEntry()});

    renderBackboneView(view);

    expect(view.el.querySelector('[data-section-thumbnail]')).not.toBeNull();
  });

  it('renders fragment with appearance of given section', () => {
    const entry = factories.entry(ScrolledEntry, {}, {
      entryTypeSeed: normalizeSeed({sections: [{id: 1, configuration: {invert: true}}]})
    });
    const fragment = createFragment();
    jest.spyOn(fragment, 'seed');

    renderBackboneView(new FragmentThumbnailView({
      model: fragment,
      entry,
      section: entry.sections.get(1)
    }));

    expect(fragment.seed).toHaveBeenCalledWith(entry.scrolledSeed,
                                               {section: entry.sections.get(1)});
  });

  it('unmounts thumbnail when closed', () => {
    const view = new FragmentThumbnailView({model: createFragment(), entry: createEntry()});

    renderBackboneView(view);
    view.close();

    expect(view.el.querySelector('[data-section-thumbnail]')).toBeNull();
  });
});
