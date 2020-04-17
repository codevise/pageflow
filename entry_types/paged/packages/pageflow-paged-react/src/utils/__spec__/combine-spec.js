import combine from '../combine';


describe('combine', () => {
  describe('returns function that', () => {
    it(
      'returns object resulting from calling functions in passed object',
      () => {
        const selector1 = function(state, props) {
          return state.value;
        };
        const selector2 = function(state, props) {
          return props.value;
        };
        const combinedSelector = combine({
          selector1,
          selector2
        });
        const state = {
          value: 'from state'
        };
        const props = {
          value: 'from props'
        };

        const result = combinedSelector(state, props);

        expect(result).toEqual({
          selector1: 'from state',
          selector2: 'from props'
        });
      }
    );

    it('keeps skalar values', () => {
      const selector = function(state, props) {
        return props.value;
      };
      const combinedSelector = combine({
        selector,
        skalar: true
      });
      const state = {};
      const props = {
        value: 'from props'
      };

      const result = combinedSelector(state, props);

      expect(result).toEqual({
        selector: 'from props',
        skalar: true
      });
    });
  });
});
