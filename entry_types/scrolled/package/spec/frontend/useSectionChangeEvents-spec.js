import {useSectionChangeEvents} from 'frontend/useSectionChangeEvents';

import {renderHookInEntry} from 'support';

describe('useSectionChangeEvents', () => {
  it('returns a function that triggers page:change event', () => {
    const events = {trigger: jest.fn()};
    const section = {
      permaId: 101,
      sectionIndex: 1,
      chapter: {
        permaId: 10,
        title: 'Chapter 1',
        index: 0
      }
    };

    const {result} = renderHookInEntry(() => useSectionChangeEvents(events), {
      seed: {}
    });

    result.current(section, 5);

    expect(events.trigger).toHaveBeenCalledWith(
      'page:change',
      expect.objectContaining({
        index: 1,
        configuration: {
          title: 'Chapter 1, Section 1'
        }
      })
    );
  });

  it('includes analytics data in event object', () => {
    const events = {trigger: jest.fn()};
    const section = {
      permaId: 101,
      sectionIndex: 2,
      chapter: {
        permaId: 10,
        title: 'Chapter 2',
        index: 1
      }
    };

    const {result} = renderHookInEntry(() => useSectionChangeEvents(events), {
      seed: {}
    });

    result.current(section, 10);

    expect(events.trigger).toHaveBeenCalledTimes(1);
    const eventObject = events.trigger.mock.calls[0][1];
    expect(eventObject.getAnalyticsData()).toEqual({
      chapterIndex: 1,
      chapterTitle: 'Chapter 2',
      index: 2,
      total: 10
    });
  });

  it('does not trigger event when called twice with same section', () => {
    const events = {trigger: jest.fn()};
    const section = {
      permaId: 101,
      sectionIndex: 1,
      chapter: {
        permaId: 10,
        title: 'Chapter 1',
        index: 0
      }
    };

    const {result} = renderHookInEntry(() => useSectionChangeEvents(events), {
      seed: {}
    });

    result.current(section, 5);
    result.current(section, 5);

    expect(events.trigger).toHaveBeenCalledTimes(1);
  });

  it('triggers event again when called with different section', () => {
    const events = {trigger: jest.fn()};
    const section1 = {
      permaId: 101,
      sectionIndex: 0,
      chapter: {
        permaId: 10,
        title: 'Chapter 1',
        index: 0
      }
    };
    const section2 = {
      permaId: 102,
      sectionIndex: 1,
      chapter: {
        permaId: 11,
        title: 'Chapter 2',
        index: 1
      }
    };

    const {result} = renderHookInEntry(() => useSectionChangeEvents(events), {
      seed: {}
    });

    result.current(section1, 5);
    result.current(section2, 5);

    expect(events.trigger).toHaveBeenCalledTimes(2);
    expect(events.trigger).toHaveBeenNthCalledWith(
      1,
      'page:change',
      expect.objectContaining({index: 0})
    );
    expect(events.trigger).toHaveBeenNthCalledWith(
      2,
      'page:change',
      expect.objectContaining({index: 1})
    );
  });
});
