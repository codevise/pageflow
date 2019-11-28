import memoizedSelector, {unwrap, combine} from '../memoizedSelector';


describe('memoizedSelector', () => {
  describe('unwrap', () => {
    it('turns memoizedSelector into selector', () => {
      const selectorCreator = memoizedSelector(
        state => state.value,
        function(value) {
          return value;
        }
      );

      const result = unwrap(selectorCreator)({value: 'foo'});

      expect(result).toBe('foo');
    });

    it('returns selector that memoizes return value for same arguments', () => {
      let counter = 0;
      const selectorCreator = memoizedSelector(
        state => state.value,
        function(value) {
          counter += 1;
          return value;
        }
      );

      const selector = unwrap(selectorCreator);
      selector({value: 'foo'});
      selector({value: 'foo'});
      const result = selector({value: 'foo'});

      expect(result).toBe('foo');
      expect(counter).toBe(1);
    });

    it(
      'returns selector that return different values for different arguments',
      () => {
        const selectorCreator = memoizedSelector(
          state => state.value,
          function(value) {
            return value;
          }
        );

        const selector = unwrap(selectorCreator);
        selector({value: 'foo'});
        const result = selector({value: 'other'});

        expect(result).toBe('other');
      }
    );

    it('returns selectors that memoize individually on subsequent calls', () => {
      let counter = 0;
      const selectorCreator = memoizedSelector(
        state => state.value,
        function(value) {
          counter += 1;
          return value;
        }
      );
      const state1 = {value: 'foo'};
      const state2 = {value: 'bar'};

      const selector1 = unwrap(selectorCreator);
      const selector2 = unwrap(selectorCreator);
      selector1(state1);
      selector2(state2);
      selector1(state1);
      selector2(state2);
      const result1 = selector1(state1);
      const result2 = selector2(state2);

      expect(result1).toBe('foo');
      expect(result2).toBe('bar');
      expect(counter).toBe(2);
    });

    it('returns non memoized selector unaltered', () => {
      function vanillaSelector(state) {
        return state.value;
      }

      const selector = unwrap(vanillaSelector);
      const result = selector({value: 'foo'});

      expect(result).toBe('foo');
    });
  });

  describe('when with state', () => {
    it('works like a normal selector', () => {
      const selector = memoizedSelector(
        state => state.value,
        function(value) {
          return value;
        }
      );

      const result = selector({value: 'foo'});

      expect(result).toBe('foo');
    });

    it('can be called multiple times', () => {
      const selector = memoizedSelector(
        state => state.value,
        function(value) {
          return value;
        }
      );

      selector({value: 'foo'});
      const result = selector({value: 'foo'});

      expect(result).toBe('foo');
    });
  });

  it('allows memoized selectors as input selectors', () => {
    const inputSelectorCreator = memoizedSelector(
      state => state.value,
      function(value) {
        return value;
      }
    );

    const selectorCreator = memoizedSelector(
      inputSelectorCreator,
      function(value) {
        return value;
      }
    );

    const result = unwrap(selectorCreator)({value: 'foo'});

    expect(result).toBe('foo');
  });

  describe('combine', () => {
    it(
      'returns selector creator for selector returning object with input selector values under given keys',
      () => {
        const selectorCreatorA = memoizedSelector(
          state => state.value,
          function(value) {
            return `a ${value}`;
          }
        );

        const selectorCreatorB = memoizedSelector(
          state => state.value,
          function(value) {
            return `b ${value}`;
          }
        );

        const combinedSelectorCreator = combine({
          a: selectorCreatorA,
          b: selectorCreatorB
        });

        const result = unwrap(combinedSelectorCreator)({value: 'foo'});

        expect(result).toEqual({
          a: 'a foo',
          b: 'b foo'
        });
      }
    );

    it('supports combining non memoized selectors', () => {
      const selectorA = function(state) {
        return `a ${state.value}`;
      };

      const selectorCreatorB = memoizedSelector(
        state => state.value,
        function(value) {
          return `b ${value}`;
        }
      );

      const combinedSelectorCreator = combine({
        a: selectorA,
        b: selectorCreatorB
      });

      const result = unwrap(combinedSelectorCreator)({value: 'foo'});

      expect(result).toEqual({
        a: 'a foo',
        b: 'b foo'
      });
    });

    it('supports skalar values', () => {
      const selectorCreatorB = memoizedSelector(
        state => state.value,
        function(value) {
          return `b ${value}`;
        }
      );

      const combinedSelectorCreator = combine({
        a: 'a foo',
        b: selectorCreatorB
      });

      const result = unwrap(combinedSelectorCreator)({value: 'foo'});

      expect(result).toEqual({
        a: 'a foo',
        b: 'b foo'
      });
    });
  });
});
