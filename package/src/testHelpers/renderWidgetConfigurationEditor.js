import {renderConfigurationEditorView} from './renderConfigurationEditorView';

/**
 * Render the configuration editor of a widget. Widget packs can use
 * this to assert how their editor integration behaves.
 *
 * Returns the same queries and `container` as
 * {@link renderConfigurationEditorView}.
 *
 * @param {Object} options
 * @param {Object} options.entry - Entry the widget belongs to.
 * @param {string} options.role - Role of the widget to configure.
 *
 * @example
 * import {renderWidgetConfigurationEditor} from 'pageflow/testHelpers';
 *
 * const {getByInputPropertyName} =
 *   renderWidgetConfigurationEditor({entry, role: 'header'});
 *
 * expect(getByInputPropertyName('title')).toBeVisible();
 */
export function renderWidgetConfigurationEditor({entry, role}) {
  const widget = entry.widgets.get(role);

  return renderConfigurationEditorView(widget.widgetType().createConfigurationEditorView({
    model: widget.configuration,
    entry
  }));
}
