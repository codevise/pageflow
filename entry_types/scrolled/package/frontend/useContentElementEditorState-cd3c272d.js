import { useState, useRef, useEffect, createContext, useContext } from 'react';
import { _ as _slicedToArray } from './ThemeIcon-87fcf0dd.js';

function useDelayedBoolean(value, _ref) {
  var fromFalseToTrue = _ref.fromFalseToTrue,
    fromTrueToFalse = _ref.fromTrueToFalse;
  var _useState = useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    setFlag = _useState2[1];
  var timeoutRef = useRef(null);
  var ref = useRef(value);
  useEffect(function () {
    if (value && !fromFalseToTrue || !value && !fromTrueToFalse) {
      ref.current = value;
    } else if (ref.current !== value) {
      timeoutRef.current = setTimeout(function () {
        ref.current = value;
        setFlag(function (flag) {
          return !flag;
        });
      }, ref.current ? fromTrueToFalse : fromFalseToTrue);
      return function () {
        return clearTimeout(timeoutRef.current);
      };
    }
  }, [value, fromTrueToFalse, fromFalseToTrue]);
  return !fromFalseToTrue && value || ref.current && (!!fromTrueToFalse || value);
}

var ContentElementEditorStateContext = createContext({
  isSelected: false,
  isEditable: false,
  setTransientState: function setTransientState() {},
  select: function select() {}
});

/**
 * Use inside a content element component to determine whether the
 * component is being rendered inside the editor iframe, and whether
 * the content element is currently selected. This can be used to
 * implement simple inline editing capabilities like displaying extra
 * information when the content element is selected.
 *
 * @example
 * const {isEditable, isSelected} = useContentElementEditorState();
 */
function useContentElementEditorState() {
  return useContext(ContentElementEditorStateContext);
}

export { ContentElementEditorStateContext as C, useContentElementEditorState as a, useDelayedBoolean as u };
