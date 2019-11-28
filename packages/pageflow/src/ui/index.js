/**
 * Reusable Backbone views for the editor and admin interface.
 * @module pageflow/ui
 */

import './renderer';
import * as i18nUtils from './utils/i18nUtils';

export { i18nUtils };
export {default as Object} from './Object';

export * from './views/SortableCollectionView';
export * from './views/CollectionView';
export * from './views/ConfigurationEditorView';
export * from './views/TableView';
export * from './views/TabsView';
export * from './views/TooltipView';

export * from './views/inputs/CheckBoxGroupInputView';
export * from './views/inputs/UrlDisplayView';
export * from './views/inputs/TextInputView';
export * from './views/inputs/ColorInputView';
export * from './views/inputs/ExtendedSelectInputView';
export * from './views/inputs/TextAreaInputView';
export * from './views/inputs/SelectInputView';
export * from './views/inputs/ProxyUrlInputView';
export * from './views/inputs/SliderInputView';
export * from './views/inputs/JsonInputView';
export * from './views/inputs/CheckBoxInputView';
export * from './views/inputs/UrlInputView';

export * from './views/ConfigurationEditorTabView';
export * from './views/TableRowView';

export * from './views/tableCells/EnumTableCellView';
export * from './views/tableCells/TableCellView';
export * from './views/tableCells/TableHeaderCellView';
export * from './views/tableCells/DeleteRowTableCellView';
export * from './views/tableCells/PresenceTableCellView';
export * from './views/tableCells/IconTableCellView';
export * from './views/tableCells/TextTableCellView';

export * from './views/mixins/inputWithPlaceholderText';
export * from './views/mixins/subviewContainer';
export * from './views/mixins/tooltipContainer';
export * from './views/mixins/inputView';
