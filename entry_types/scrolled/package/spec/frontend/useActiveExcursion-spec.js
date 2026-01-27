import {useActiveExcursion} from 'frontend/useActiveExcursion';
import {useEntryStructure} from 'entryState';

import {renderHookInEntry} from 'support';
import {changeLocationHash} from 'support/changeLocationHash';
import {act} from '@testing-library/react';

describe('useActiveExcursion', () => {
  beforeEach(() => window.location.hash = '#initial');

  it('returns undefined by default', () => {
    const {result} = renderHookInEntry(() => useActiveExcursion(useEntryStructure()), {
      seed: {
      }
    });

    const {activeExcursion} = result.current;
    expect(activeExcursion).toBeUndefined();
  });

  it('returns excursion with slug matching hash', async () => {
    const {result} = renderHookInEntry(() => useActiveExcursion(useEntryStructure()), {
      seed: {
        storylines: [
          {id: 1, configuration: {main: true}},
          {id: 2}
        ],
        chapters: [
          {id: 10, storylineId: 1, configuration: {title: 'intro'}},
          {id: 11, storylineId: 2, configuration: {title: 'excursion'}},
        ]
      }
    });

    act(() => {
      changeLocationHash('#excursion')
    });

    const {activeExcursion} = result.current;
    expect(activeExcursion).toMatchObject({title: 'excursion'});
  });

  it('returns undefined when hash matches main chapter slug', async () => {
    const {result} = renderHookInEntry(() => useActiveExcursion(useEntryStructure()), {
      seed: {
        storylines: [
          {id: 1, configuration: {main: true}},
          {id: 2}
        ],
        chapters: [
          {id: 10, storylineId: 1, configuration: {title: 'intro'}},
          {id: 11, storylineId: 2, configuration: {title: 'excursion'}},
        ]
      }
    });

    act(() => {
      changeLocationHash('#intro')
    });

    const {activeExcursion} = result.current;
    expect(activeExcursion).toBeUndefined();
  });

  it('supports resetting active excursion', async () => {
    const {result} = renderHookInEntry(() => useActiveExcursion(useEntryStructure()), {
      seed: {
        storylines: [
          {id: 1, configuration: {main: true}},
          {id: 2}
        ],
        chapters: [
          {id: 10, storylineId: 1, configuration: {title: 'intro'}},
          {id: 11, storylineId: 2, configuration: {title: 'excursion'}},
        ]
      }
    });

    const {returnFromExcursion} = result.current;

    act(() => {
      changeLocationHash('#excursion')
      returnFromExcursion();
    });

    const {activeExcursion} = result.current;

    expect(activeExcursion).toBeUndefined();
    expect(window.location.hash).toEqual('#initial')
  });

  it('supports activating excursion via section id', async () => {
    const {result} = renderHookInEntry(() => useActiveExcursion(useEntryStructure()), {
      seed: {
        storylines: [
          {id: 1, configuration: {main: true}},
          {id: 2}
        ],
        chapters: [
          {id: 10, storylineId: 1, configuration: {title: 'intro'}},
          {id: 11, storylineId: 2, configuration: {title: 'excursion'}},
        ],
        sections: [
          {id: 100, chapterId: 10},
          {id: 101, chapterId: 11},
        ]
      }
    });

    const {activateExcursionOfSection} = result.current;

    act(() => {
      activateExcursionOfSection({id: 101});
    });

    const {activeExcursion} = result.current;

    expect(activeExcursion).toMatchObject({title: 'excursion'});
    expect(window.location.hash).toEqual('#excursion')
  });

  it('returns to initial hash after activating different excursions', async () => {
    const {result} = renderHookInEntry(() => useActiveExcursion(useEntryStructure()), {
      seed: {
        storylines: [
          {id: 1, configuration: {main: true}},
          {id: 2}
        ],
        chapters: [
          {id: 10, storylineId: 1, configuration: {title: 'intro'}},
          {id: 11, storylineId: 2, configuration: {title: 'excursion1'}},
          {id: 12, storylineId: 2, configuration: {title: 'excursion2'}}
        ],
        sections: [
          {id: 100, chapterId: 10},
          {id: 101, chapterId: 11},
          {id: 102, chapterId: 12}
        ]
      }
    });

    const {activateExcursionOfSection, returnFromExcursion} = result.current;

    act(() => { activateExcursionOfSection({id: 101}) });

    expect(window.location.hash).toEqual('#excursion1')

    act(() => { activateExcursionOfSection({id: 102}) });

    expect(window.location.hash).toEqual('#excursion2')

    act(() => { returnFromExcursion() });

    expect(window.location.hash).toEqual('#initial')
  });

  it('can return to initial empty hash', async () => {
    const {result} = renderHookInEntry(() => useActiveExcursion(useEntryStructure()), {
      seed: {
        storylines: [
          {id: 1, configuration: {main: true}},
          {id: 2}
        ],
        chapters: [
          {id: 10, storylineId: 1, configuration: {title: 'intro'}},
          {id: 11, storylineId: 2, configuration: {title: 'excursion1'}}
        ],
        sections: [
          {id: 100, permaId: 1000, chapterId: 10},
          {id: 101, permaId: 1001, chapterId: 11}
        ]
      }
    });

    window.location.hash = '';
    const {returnFromExcursion} = result.current;

    act(() => { changeLocationHash('#section-1001') });
    act(() => { changeLocationHash('#excursion1') });

    act(() => { returnFromExcursion() });

    expect(window.location.hash).toEqual('')
  });

  it('activates excursion when hash matches section permaId pattern', async () => {
    const {result} = renderHookInEntry(() => useActiveExcursion(useEntryStructure()), {
      seed: {
        storylines: [
          {id: 1, configuration: {main: true}},
          {id: 2}
        ],
        chapters: [
          {id: 10, storylineId: 1, configuration: {title: 'intro'}},
          {id: 11, storylineId: 2, configuration: {title: 'excursion'}},
        ],
        sections: [
          {id: 100, chapterId: 10, permaId: 500},
          {id: 101, chapterId: 11, permaId: 501},
        ]
      }
    });

    act(() => {
      changeLocationHash('#section-501')
    });

    const {activeExcursion} = result.current;
    expect(activeExcursion).toMatchObject({title: 'excursion'});
  });

  it('returns undefined when hash matches section permaId from main storyline', async () => {
    const {result} = renderHookInEntry(() => useActiveExcursion(useEntryStructure()), {
      seed: {
        storylines: [
          {id: 1, configuration: {main: true}},
          {id: 2}
        ],
        chapters: [
          {id: 10, storylineId: 1, configuration: {title: 'intro'}},
          {id: 11, storylineId: 2, configuration: {title: 'excursion'}},
        ],
        sections: [
          {id: 100, chapterId: 10, permaId: 500},
          {id: 101, chapterId: 11, permaId: 501},
        ]
      }
    });

    act(() => {
      changeLocationHash('#section-500') // Main storyline section
    });

    const {activeExcursion} = result.current;
    expect(activeExcursion).toBeUndefined();
  });

  it('activates excursion on initial render when hash matches chapter slug', () => {
    window.location.hash = '#excursion';

    const {result} = renderHookInEntry(() => useActiveExcursion(useEntryStructure()), {
      seed: {
        storylines: [
          {id: 1, configuration: {main: true}},
          {id: 2}
        ],
        chapters: [
          {id: 10, storylineId: 1, configuration: {title: 'intro'}},
          {id: 11, storylineId: 2, configuration: {title: 'excursion'}},
        ]
      }
    });

    const {activeExcursion} = result.current;
    expect(activeExcursion).toMatchObject({title: 'excursion'});
  });

  it('activates excursion on initial render when hash matches section permaId pattern', () => {
    window.location.hash = '#section-501';

    const {result} = renderHookInEntry(() => useActiveExcursion(useEntryStructure()), {
      seed: {
        storylines: [
          {id: 1, configuration: {main: true}},
          {id: 2}
        ],
        chapters: [
          {id: 10, storylineId: 1, configuration: {title: 'intro'}},
          {id: 11, storylineId: 2, configuration: {title: 'excursion'}},
        ],
        sections: [
          {id: 100, chapterId: 10, permaId: 500},
          {id: 101, chapterId: 11, permaId: 501},
        ]
      }
    });

    const {activeExcursion} = result.current;
    expect(activeExcursion).toMatchObject({title: 'excursion'});
  });

  describe('scrolling', () => {
    beforeEach(() => jest.useFakeTimers());
    afterEach(() => jest.useRealTimers());

    it('calls scrollToTarget when navigating from main to excursion section', async () => {
      const scrollToTarget = jest.fn();

      const {result} = renderHookInEntry(
        () => useActiveExcursion(useEntryStructure(), {scrollToTarget}),
        {
          seed: {
            storylines: [
              {id: 1, configuration: {main: true}},
              {id: 2}
            ],
            chapters: [
              {id: 10, storylineId: 1, configuration: {title: 'intro'}},
              {id: 11, storylineId: 2, configuration: {title: 'excursion'}},
            ],
            sections: [
              {id: 100, chapterId: 10, permaId: 500},
              {id: 101, chapterId: 11, permaId: 501},
              {id: 102, chapterId: 11, permaId: 502},
            ]
          }
        }
      );

      act(() => changeLocationHash('#section-502'));
      act(() => jest.advanceTimersByTime(500));

      const {activeExcursion} = result.current;
      expect(activeExcursion).toMatchObject({title: 'excursion'});
      expect(scrollToTarget).toHaveBeenCalledWith({id: 102});
    });

    it('calls scrollToTarget when navigating from excursion to main section', async () => {
      window.location.hash = '#excursion';
      const scrollToTarget = jest.fn();

      const {result} = renderHookInEntry(
        () => useActiveExcursion(useEntryStructure(), {scrollToTarget}),
        {
          seed: {
            storylines: [
              {id: 1, configuration: {main: true}},
              {id: 2}
            ],
            chapters: [
              {id: 10, storylineId: 1, configuration: {title: 'intro'}},
              {id: 11, storylineId: 2, configuration: {title: 'excursion'}},
            ],
            sections: [
              {id: 100, chapterId: 10, permaId: 500},
              {id: 101, chapterId: 11, permaId: 501},
            ]
          }
        }
      );

      act(() => changeLocationHash('#section-500'));
      act(() => jest.advanceTimersByTime(500));

      const {activeExcursion} = result.current;
      expect(activeExcursion).toBeUndefined();
      expect(scrollToTarget).toHaveBeenCalledWith({id: 100});
    });

    it('calls scrollToTarget when navigating from excursion A to excursion B', async () => {
      window.location.hash = '#excursion1';
      const scrollToTarget = jest.fn();

      const {result} = renderHookInEntry(
        () => useActiveExcursion(useEntryStructure(), {scrollToTarget}),
        {
          seed: {
            storylines: [
              {id: 1, configuration: {main: true}},
              {id: 2}
            ],
            chapters: [
              {id: 10, storylineId: 1, configuration: {title: 'intro'}},
              {id: 11, storylineId: 2, configuration: {title: 'excursion1'}},
              {id: 12, storylineId: 2, configuration: {title: 'excursion2'}}
            ],
            sections: [
              {id: 100, chapterId: 10, permaId: 500},
              {id: 101, chapterId: 11, permaId: 501},
              {id: 102, chapterId: 12, permaId: 502},
              {id: 103, chapterId: 12, permaId: 503}
            ]
          }
        }
      );

      act(() => changeLocationHash('#section-503'));
      act(() => jest.advanceTimersByTime(500));

      const {activeExcursion} = result.current;
      expect(activeExcursion).toMatchObject({title: 'excursion2'});
      expect(scrollToTarget).toHaveBeenCalledWith({id: 103});
    });

    it('delays scroll by 500ms', async () => {
      const scrollToTarget = jest.fn();

      renderHookInEntry(
        () => useActiveExcursion(useEntryStructure(), {scrollToTarget}),
        {
          seed: {
            storylines: [
              {id: 1, configuration: {main: true}},
              {id: 2}
            ],
            chapters: [
              {id: 10, storylineId: 1, configuration: {title: 'intro'}},
              {id: 11, storylineId: 2, configuration: {title: 'excursion'}},
            ],
            sections: [
              {id: 100, chapterId: 10, permaId: 500},
              {id: 101, chapterId: 11, permaId: 501},
              {id: 102, chapterId: 11, permaId: 502},
            ]
          }
        }
      );

      act(() => {
        changeLocationHash('#section-502');
      });

      expect(scrollToTarget).not.toHaveBeenCalled();

      act(() => {
        jest.advanceTimersByTime(499);
      });

      expect(scrollToTarget).not.toHaveBeenCalled();

      act(() => {
        jest.advanceTimersByTime(1);
      });

      expect(scrollToTarget).toHaveBeenCalledWith({id: 102});
    });

    it('does not call scrollToTarget when navigating within main storyline', async () => {
      const scrollToTarget = jest.fn();

      const {result} = renderHookInEntry(
        () => useActiveExcursion(useEntryStructure(), {scrollToTarget}),
        {
          seed: {
            storylines: [
              {id: 1, configuration: {main: true}},
              {id: 2}
            ],
            chapters: [
              {id: 10, storylineId: 1, configuration: {title: 'intro'}},
              {id: 11, storylineId: 2, configuration: {title: 'excursion'}},
            ],
            sections: [
              {id: 100, chapterId: 10, permaId: 500},
              {id: 103, chapterId: 10, permaId: 503},
              {id: 101, chapterId: 11, permaId: 501},
            ]
          }
        }
      );

      act(() => changeLocationHash('#section-503'));
      act(() => jest.advanceTimersByTime(500));

      const {activeExcursion} = result.current;
      expect(activeExcursion).toBeUndefined();
      expect(scrollToTarget).not.toHaveBeenCalled();
    });

    it('does not call scrollToTarget when navigating within same excursion', async () => {
      window.location.hash = '#excursion';
      const scrollToTarget = jest.fn();

      const {result} = renderHookInEntry(
        () => useActiveExcursion(useEntryStructure(), {scrollToTarget}),
        {
          seed: {
            storylines: [
              {id: 1, configuration: {main: true}},
              {id: 2}
            ],
            chapters: [
              {id: 10, storylineId: 1, configuration: {title: 'intro'}},
              {id: 11, storylineId: 2, configuration: {title: 'excursion'}},
            ],
            sections: [
              {id: 100, chapterId: 10, permaId: 500},
              {id: 101, chapterId: 11, permaId: 501},
              {id: 102, chapterId: 11, permaId: 502},
            ]
          }
        }
      );

      act(() => changeLocationHash('#section-502'));
      act(() => jest.advanceTimersByTime(500));

      const {activeExcursion} = result.current;
      expect(activeExcursion).toMatchObject({title: 'excursion'});
      expect(scrollToTarget).not.toHaveBeenCalled();
    });

    it('does not call scrollToTarget when hash does not match anything', async () => {
      const scrollToTarget = jest.fn();

      const {result} = renderHookInEntry(
        () => useActiveExcursion(useEntryStructure(), {scrollToTarget}),
        {
          seed: {
            storylines: [
              {id: 1, configuration: {main: true}},
              {id: 2}
            ],
            chapters: [
              {id: 10, storylineId: 1, configuration: {title: 'intro'}},
              {id: 11, storylineId: 2, configuration: {title: 'excursion'}},
            ],
            sections: [
              {id: 100, chapterId: 10, permaId: 500},
              {id: 101, chapterId: 11, permaId: 501},
            ]
          }
        }
      );

      act(() => changeLocationHash('#nonexistent'));
      act(() => jest.advanceTimersByTime(500));

      const {activeExcursion} = result.current;
      expect(activeExcursion).toBeUndefined();
      expect(scrollToTarget).not.toHaveBeenCalled();
    });

    it('scrolls again after returning from excursion and re-entering', async () => {
      const scrollToTarget = jest.fn();

      const {result} = renderHookInEntry(
        () => useActiveExcursion(useEntryStructure(), {scrollToTarget}),
        {
          seed: {
            storylines: [
              {id: 1, configuration: {main: true}},
              {id: 2}
            ],
            chapters: [
              {id: 10, storylineId: 1, configuration: {title: 'intro'}},
              {id: 11, storylineId: 2, configuration: {title: 'excursion'}},
            ],
            sections: [
              {id: 100, chapterId: 10, permaId: 500},
              {id: 101, chapterId: 11, permaId: 501},
              {id: 102, chapterId: 11, permaId: 502},
            ]
          }
        }
      );

      // Enter excursion (non-first section)
      act(() => changeLocationHash('#section-502'));
      act(() => jest.advanceTimersByTime(500));

      expect(scrollToTarget).toHaveBeenCalledWith({id: 102});
      scrollToTarget.mockClear();

      // Return from excursion
      act(() => result.current.returnFromExcursion());

      expect(result.current.activeExcursion).toBeUndefined();

      // Re-enter excursion - should scroll again
      act(() => changeLocationHash('#section-502'));
      act(() => jest.advanceTimersByTime(500));

      expect(scrollToTarget).toHaveBeenCalledWith({id: 102});
    });

    it('does not scroll when navigating to excursion via slug', async () => {
      const scrollToTarget = jest.fn();

      const {result} = renderHookInEntry(
        () => useActiveExcursion(useEntryStructure(), {scrollToTarget}),
        {
          seed: {
            storylines: [
              {id: 1, configuration: {main: true}},
              {id: 2}
            ],
            chapters: [
              {id: 10, storylineId: 1, configuration: {title: 'intro'}},
              {id: 11, storylineId: 2, configuration: {title: 'excursion'}},
            ],
            sections: [
              {id: 100, chapterId: 10, permaId: 500},
              {id: 101, chapterId: 11, permaId: 501},
            ]
          }
        }
      );

      act(() => changeLocationHash('#excursion'));
      act(() => jest.advanceTimersByTime(500));

      const {activeExcursion} = result.current;
      expect(activeExcursion).toMatchObject({title: 'excursion'});
      expect(scrollToTarget).not.toHaveBeenCalled();
    });

    it('does not scroll when navigating to first section of excursion', async () => {
      const scrollToTarget = jest.fn();

      const {result} = renderHookInEntry(
        () => useActiveExcursion(useEntryStructure(), {scrollToTarget}),
        {
          seed: {
            storylines: [
              {id: 1, configuration: {main: true}},
              {id: 2}
            ],
            chapters: [
              {id: 10, storylineId: 1, configuration: {title: 'intro'}},
              {id: 11, storylineId: 2, configuration: {title: 'excursion'}},
            ],
            sections: [
              {id: 100, chapterId: 10, permaId: 500},
              {id: 101, chapterId: 11, permaId: 501},
              {id: 102, chapterId: 11, permaId: 502},
            ]
          }
        }
      );

      act(() => changeLocationHash('#section-501'));
      act(() => jest.advanceTimersByTime(500));

      const {activeExcursion} = result.current;
      expect(activeExcursion).toMatchObject({title: 'excursion'});
      expect(scrollToTarget).not.toHaveBeenCalled();
    });
  });
});
