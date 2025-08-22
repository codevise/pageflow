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

});
