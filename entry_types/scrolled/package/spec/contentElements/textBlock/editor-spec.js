import 'contentElements/textBlock/editor';
import {editor} from 'editor';

describe('contentElements/textBlock/editor', () => {
  const type = editor.contentElementTypes.findByTypeName('textBlock');

  function paragraph(text) {
    return {type: 'paragraph', children: [{text}]};
  }

  describe('#split', () => {
    it('splits configuration at the given block index', () => {
      const configuration = {value: [paragraph('first'), paragraph('second')]};

      const {before, after} = type.split(configuration, 1, {ranges: {}});

      expect(before.configuration.value).toEqual([paragraph('first')]);
      expect(after.configuration.value).toEqual([paragraph('second')]);
    });

    it('leaves thread on the before side when range is fully before split', () => {
      const configuration = {
        value: [paragraph('first'), paragraph('second'), paragraph('third')]
      };
      const ranges = {
        7: {anchor: {path: [0, 0], offset: 0},
            focus: {path: [0, 0], offset: 3}}
      };

      const {before, after} = type.split(configuration, 2, {ranges});

      expect(before.ranges).toEqual(ranges);
      expect(after.ranges).toEqual({});
    });

    it('rebases thread on the after side when range is fully after split', () => {
      const configuration = {
        value: [paragraph('first'), paragraph('second'), paragraph('third')]
      };
      const ranges = {
        7: {anchor: {path: [2, 0], offset: 0},
            focus: {path: [2, 0], offset: 3}}
      };

      const {before, after} = type.split(configuration, 2, {ranges});

      expect(before.ranges).toEqual({});
      expect(after.ranges).toEqual({
        7: {anchor: {path: [0, 0], offset: 0},
            focus: {path: [0, 0], offset: 3}}
      });
    });

    it('clamps thread straddling the split point to the end of last before-block', () => {
      const configuration = {
        value: [paragraph('first'), paragraph('second'), paragraph('third')]
      };
      const ranges = {
        7: {anchor: {path: [0, 0], offset: 1},
            focus: {path: [2, 0], offset: 2}}
      };

      const {before, after} = type.split(configuration, 2, {ranges});

      expect(before.ranges).toEqual({
        7: {anchor: {path: [0, 0], offset: 1},
            focus: {path: [1, 0], offset: 'second'.length}}
      });
      expect(after.ranges).toEqual({});
    });
  });

  describe('#merge', () => {
    it('concatenates values of both configurations', () => {
      const configA = {value: [paragraph('a')]};
      const configB = {value: [paragraph('b')]};

      const {configuration} = type.merge(configA, configB,
                                         {rangesA: {}, rangesB: {}});

      expect(configuration.value).toEqual([paragraph('a'), paragraph('b')]);
    });

    it('keeps A-side ranges unchanged', () => {
      const configA = {value: [paragraph('one'), paragraph('two')]};
      const configB = {value: [paragraph('three')]};
      const rangesA = {
        7: {anchor: {path: [0, 0], offset: 0},
            focus: {path: [0, 0], offset: 3}}
      };

      const {ranges} = type.merge(configA, configB, {rangesA, rangesB: {}});

      expect(ranges).toEqual(rangesA);
    });

    it('shifts B-side ranges by the length of A', () => {
      const configA = {value: [paragraph('one'), paragraph('two')]};
      const configB = {value: [paragraph('three'), paragraph('four')]};
      const rangesB = {
        8: {anchor: {path: [0, 0], offset: 0},
            focus: {path: [1, 0], offset: 4}}
      };

      const {ranges} = type.merge(configA, configB, {rangesA: {}, rangesB});

      expect(ranges).toEqual({
        8: {anchor: {path: [2, 0], offset: 0},
            focus: {path: [3, 0], offset: 4}}
      });
    });

    it('combines both sides when both have ranges', () => {
      const configA = {value: [paragraph('one')]};
      const configB = {value: [paragraph('two')]};
      const rangesA = {
        7: {anchor: {path: [0, 0], offset: 0}, focus: {path: [0, 0], offset: 3}}
      };
      const rangesB = {
        8: {anchor: {path: [0, 0], offset: 0}, focus: {path: [0, 0], offset: 3}}
      };

      const {ranges} = type.merge(configA, configB, {rangesA, rangesB});

      expect(ranges).toEqual({
        7: {anchor: {path: [0, 0], offset: 0}, focus: {path: [0, 0], offset: 3}},
        8: {anchor: {path: [1, 0], offset: 0}, focus: {path: [1, 0], offset: 3}}
      });
    });
  });
});
