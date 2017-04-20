import {createSelector, createStructuredSelector} from 'reselect';

const SELECTOR_FACTORY = Symbol('selectorFactory');
const CREATE_SELECTOR = Symbol('createSelector');

export default function memoizedSelector(...args) {
  return mark(function selectorCreator(stateOrCreateSelectorSymbol, props) {
    const inputSelectors = args.slice(0, -1).map(unwrap);
    const transform = args.slice(-1)[0];

    const selector = createSelector(...inputSelectors, transform);

    if (stateOrCreateSelectorSymbol === CREATE_SELECTOR) {
      return selector;
    }
    else if (stateOrCreateSelectorSymbol) {
      return selector(stateOrCreateSelectorSymbol, props);
    }
    else {
      throw 'Missing state argument for selector.';
    }
  });
}

export function combine(selectors, name) {
  return mark(function combinedSelectorCreator() {
    return createStructuredSelector(unwrapAll(replaceScalarsWithConstantFunctions(selectors)));
  });
}

function unwrapAll(selectors) {
  return Object.keys(selectors).reduce((result, key) => {
    result[key] = unwrap(selectors[key]);
    return result;
  }, {});
}

function replaceScalarsWithConstantFunctions(object) {
  return Object.keys(object).reduce((result, key) => {
    if (typeof object[key] == 'function') {
      result[key] = object[key];
    }
    else {
      result[key] = () => object[key];
    }

    return result;
  }, {});
}

export function unwrap(selector) {
  if (typeof selector == 'function' && selector[SELECTOR_FACTORY]) {
    return selector(CREATE_SELECTOR);
  }
  else {
    return selector;
  }
}

function mark(selectorFactory) {
  selectorFactory[SELECTOR_FACTORY] = true;
  return selectorFactory;
}
