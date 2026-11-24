import {queries, within} from '@testing-library/dom';

import {inputPropertyNameQueries} from './inputPropertyNameQueries';
import {renderBackboneView} from './renderBackboneView';

const selector = '.configuration_editor';

/**
 * Render a view that is or contains a configuration editor. Entry
 * types and plugins can use this to build helpers that render the
 * configuration editors of their models.
 *
 * Returns the queries of `@testing-library/dom` and the
 * {@link inputPropertyNameQueries} bound to the configuration editor,
 * and the configuration editor element as `container`.
 *
 * @param {Backbone.View} view - View to render.
 *
 * @example
 * import {renderConfigurationEditorView} from 'pageflow/testHelpers';
 *
 * const {getByRole, queryByInputPropertyName} =
 *   renderConfigurationEditorView(new EditWidgetView({model}));
 *
 * expect(getByRole('tab', {name: 'General'})).toBeInTheDocument();
 * expect(queryByInputPropertyName('title')).toBeNull();
 */
export function renderConfigurationEditorView(view) {
  renderBackboneView(view);

  const container = view.el.matches(selector) ?
                    view.el :
                    view.el.querySelector(selector);

  return {
    ...within(container, {...queries, ...inputPropertyNameQueries}),
    container
  };
}
