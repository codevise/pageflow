import {renderHookInEntry} from 'pageflow-scrolled/testHelpers';

import {review} from 'review/api';
import {useSubjectQuote} from 'review/subjectQuote';

describe('useSubjectQuote', () => {
  const seed = {
    sections: [{id: 1, permaId: 1}],
    contentElements: [
      {
        id: 1, permaId: 10, sectionId: 1, typeName: 'textBlock',
        configuration: {value: 'Some text'}
      },
      {id: 2, permaId: 11, sectionId: 1, typeName: 'image'},
      {
        id: 3, permaId: 12, sectionId: 1, typeName: 'heading',
        configuration: {value: 'A headline'}
      }
    ]
  };

  const subjectRange = {
    anchor: {path: [0, 0], offset: 0},
    focus: {path: [0, 0], offset: 4}
  };

  beforeEach(() => {
    review.contentElementTypes.register('textBlock', {
      extractQuote: (configuration, range) =>
        (range ? `${configuration.value}@${range.focus.offset}` : null)
    });

    review.contentElementTypes.register('heading', {
      extractQuote: configuration => configuration.value
    });
  });

  afterEach(() => {
    review.contentElementTypes.types = {};
  });

  function renderSubjectQuote(options) {
    return renderHookInEntry(() => useSubjectQuote(options), {seed});
  }

  it("passes configuration and range to the content element type's extractQuote", () => {
    const {result} = renderSubjectQuote({
      subjectType: 'ContentElement', subjectId: 10, subjectRange
    });

    expect(result.current).toEqual('Some text@4');
  });

  it('lets range-less types extract a quote without a subject range', () => {
    const {result} = renderSubjectQuote({
      subjectType: 'ContentElement', subjectId: 12
    });

    expect(result.current).toEqual('A headline');
  });

  it('lets ranged types skip subjects without a range', () => {
    const {result} = renderSubjectQuote({
      subjectType: 'ContentElement', subjectId: 10
    });

    expect(result.current).toBeNull();
  });

  it('returns null for content element types that do not support quotes', () => {
    const {result} = renderSubjectQuote({
      subjectType: 'ContentElement', subjectId: 11, subjectRange
    });

    expect(result.current).toBeNull();
  });

  it('returns null for section subjects', () => {
    const {result} = renderSubjectQuote({
      subjectType: 'Section', subjectId: 1, subjectRange
    });

    expect(result.current).toBeNull();
  });

  it('cuts quotes to the length the server stores', () => {
    review.contentElementTypes.register('heading', {
      extractQuote: () => 'a'.repeat(4010)
    });

    const {result} = renderSubjectQuote({
      subjectType: 'ContentElement', subjectId: 12
    });

    expect(result.current).toEqual('a'.repeat(4000));
  });

  it('returns null for deleted content elements', () => {
    const {result} = renderSubjectQuote({
      subjectType: 'ContentElement', subjectId: 999, subjectRange
    });

    expect(result.current).toBeNull();
  });
});
