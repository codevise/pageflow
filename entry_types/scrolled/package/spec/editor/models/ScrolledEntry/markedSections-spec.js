import {useEditorGlobals} from 'support';

describe('ScrolledEntry#markedSections', () => {
  const {createEntry} = useEditorGlobals();

  it('is inactive by default', () => {
    const entry = createEntry({sections: [{id: 10}]});

    expect(entry.markedSections.isActive()).toBe(false);
  });

  it('can mark sections', () => {
    const entry = createEntry({sections: [{id: 10}]});

    entry.markedSections.toggle(entry.sections.get(10));

    expect(entry.markedSections.includes(entry.sections.get(10))).toBe(true);
  });

  it('drops removed sections', () => {
    const entry = createEntry({sections: [{id: 10}, {id: 11}]});
    entry.markedSections.add([entry.sections.get(10), entry.sections.get(11)]);

    entry.sections.remove(entry.sections.get(11));

    expect(entry.markedSections.models).toEqual([entry.sections.get(10)]);
  });
});
