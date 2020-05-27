import {useContext, createContext} from 'react';

export const ContentElementEditorStateContext = createContext({
  isSelected: false,
  isEditable: false,
  setTransientState() {}
});

/**
 * Use inside a content element component to determine whether the
 * component is being rendered inside the editor and whether the
 * content element is currently selected. This can be used to
 * implement simple inline editing capabilities like displaying extra
 * information when the content element is selected.
 *
 * @example
 * const {isEditable, isSelected} = useContentElementEditorState();
 */
export function useContentElementEditorState() {
  return useContext(ContentElementEditorStateContext);
}
