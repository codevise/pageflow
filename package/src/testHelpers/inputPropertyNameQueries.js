import $ from 'jquery';
import {buildQueries} from '@testing-library/dom';

function queryAllByInputPropertyName(container, propertyName) {
  return Array.from(container.querySelectorAll('.input')).filter(
    element => $(element).data('inputPropertyName') === propertyName
  );
}

const [
  queryByInputPropertyName,
  getAllByInputPropertyName,
  getByInputPropertyName,
  findAllByInputPropertyName,
  findByInputPropertyName
] = buildQueries(
  queryAllByInputPropertyName,
  (container, propertyName) =>
    `Found multiple inputs for property "${propertyName}"`,
  (container, propertyName) =>
    `Unable to find an input for property "${propertyName}"`
);

/**
 * Custom testing-library queries to find configuration editor inputs
 * by the name of the property they edit. Follows the usual
 * `getBy`/`queryBy`/`findBy`/`*AllBy` variants. Inputs hidden via
 * `visibleBinding` are found as well; assert visibility with jest-dom's
 * `toBeVisible`.
 *
 * Bound to the configuration editor in the result of
 * {@link renderConfigurationEditorView}. Can also be passed
 * to `within` to use them with other views.
 *
 * Prefer role and label queries to assert what users perceive. Use
 * these for inputs that do not expose an accessible role or to check
 * which properties a configuration editor offers.
 *
 * @name inputPropertyNameQueries
 *
 * @example
 * import {within} from '@testing-library/dom';
 * import {inputPropertyNameQueries} from 'pageflow/testHelpers';
 *
 * const {getByInputPropertyName} = within(view.el, inputPropertyNameQueries);
 * expect(getByInputPropertyName('marqueeSpeed')).not.toBeVisible();
 */
export const inputPropertyNameQueries = {
  queryAllByInputPropertyName,
  queryByInputPropertyName,
  getAllByInputPropertyName,
  getByInputPropertyName,
  findAllByInputPropertyName,
  findByInputPropertyName
};

export {
  queryAllByInputPropertyName,
  queryByInputPropertyName,
  getAllByInputPropertyName,
  getByInputPropertyName,
  findAllByInputPropertyName,
  findByInputPropertyName
};
