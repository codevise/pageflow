import {useSectionStructure, updateContentElementConfiguration} from 'entryState';

import {renderHookInEntry} from 'support';

describe('updateContentElementConfiguration', () => {
  it('updates the configuration of a content element preserving object identity', () => {
    const newConfiguration = {some: 'update'};
    const {result} = renderHookInEntry(() => useSectionStructure({sectionPermaId: 10}), {
      seed: {
        sections: [{id: 1, permaId: 10}],
        contentElements: [{sectionId: 1, permaId: 50}]
      },
      setup: dispatch => {
        updateContentElementConfiguration({
          permaId: 50,
          dispatch,
          configuration: newConfiguration
        });
      }
    });
    const sectionStructure = result.current;

    expect(sectionStructure.foreground[0].props).toBe(newConfiguration);
  });
});
