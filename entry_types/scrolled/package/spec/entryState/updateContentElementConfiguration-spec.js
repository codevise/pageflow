import {useSectionForegroundContentElements, updateContentElementConfiguration} from 'entryState';

import {renderHookInEntry} from 'support';

describe('updateContentElementConfiguration', () => {
  it('updates the configuration of a content element', () => {
    const newConfiguration = {some: {text: 'update'}};
    const {result} = renderHookInEntry(() => useSectionForegroundContentElements({sectionId: 1}), {
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
    const contentElements = result.current;

    expect(contentElements[0].props.some).toBe(newConfiguration.some);
  });
});
