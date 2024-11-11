import {useEditorGlobals, useFakeXhr} from 'support';
import '@testing-library/jest-dom/extend-expect';

describe('Cutoff', () => {
  useFakeXhr();

  const {createEntry} = useEditorGlobals();

  it('resets metadata configuration when deleting the cutoff section', () => {
    const entry = createEntry({
      metadata: {configuration: {cutoff_section_perma_id: 100}},
      sections: [
        {id: 1, permaId: 100},
        {id: 2, permaId: 101},
      ]
    });

    entry.sections.get(1).destroy();

    expect(entry.metadata.configuration.get('cutoff_section_perma_id')).toBeUndefined();
  });

  it('reports cutoff to be at section with matching perma id', () => {
    const entry = createEntry({
      metadata: {configuration: {cutoff_section_perma_id: 100}},
      sections: [
        {id: 1, permaId: 100},
        {id: 2, permaId: 101},
      ]
    });

    expect(entry.cutoff.isAtSection(entry.sections.get(1))).toEqual(true);
  });

  it('does not report cutoff to be at section with other perma id', () => {
    const entry = createEntry({
      metadata: {configuration: {cutoff_section_perma_id: 100}},
      sections: [
        {id: 1, permaId: 100},
        {id: 2, permaId: 101},
      ]
    });

    expect(entry.cutoff.isAtSection(entry.sections.get(2))).toEqual(false);
  });

  it('does not report cutoff to be at unsafed section when not set', () => {
    const entry = createEntry({
      sections: [
        {id: undefined , permaId: undefined}
      ]
    });

    expect(entry.cutoff.isAtSection(entry.sections.first())).toEqual(false);
  });
});
