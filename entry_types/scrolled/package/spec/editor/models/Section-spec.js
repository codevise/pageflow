import {ScrolledEntry} from 'editor/models/ScrolledEntry';
import {factories} from 'pageflow/testHelpers';
import {normalizeSeed} from 'support';

describe('Section', () => {
  describe('getTransition', () => {
    it('returns transition from configuration', () => {
      const entry = factories.entry(ScrolledEntry, {}, {
        entryTypeSeed: normalizeSeed({
          sections: [
            {id: 10, position: 0},
            {id: 11, position: 1, configuration: {transition: 'reveal'}}
          ]
        })
      });
      const section = entry.sections.get(11);

      expect(section.getTransition()).toEqual('reveal');
    });

    it('turns fade into scroll if fade transition is not available', () => {
      const entry = factories.entry(ScrolledEntry, {}, {
        entryTypeSeed: normalizeSeed({
          sections: [
            {id: 10, position: 0, configuration: {fullHeight: false}},
            {id: 11, position: 1, configuration: {transition: 'fade', fullHeight: true}}
          ]
        })
      });
      const section = entry.sections.get(11);

      expect(section.getTransition()).toEqual('scroll');
    });

    it('keeps fade if fade transition is available', () => {
      const entry = factories.entry(ScrolledEntry, {}, {
        entryTypeSeed: normalizeSeed({
          sections: [
            {id: 10, position: 0, configuration: {fullHeight: true}},
            {id: 11, position: 1, configuration: {transition: 'fade', fullHeight: true}}
          ]
        })
      });
      const section = entry.sections.get(11);

      expect(section.getTransition()).toEqual('fade');
    });
  });
});
