import userEvent from '@testing-library/user-event';
import {within} from '@testing-library/dom';
import {Input} from 'pageflow/testHelpers';

// Options of illustrated selects are only rendered while the dropdown
// is open.
export async function illustratedOptionNames(propertyName, {inView}) {
  const input = Input.findByPropertyName(propertyName, {inView, visible: true});
  const queries = within(input.$el[0]);
  const user = userEvent.setup();

  await user.click(queries.getByRole('button'));

  return queries.getAllByRole('option').map(optionName);
}

// Besides the name of the option, options contain the play progress of their
// illustration, which is hidden from assistive technology.
function optionName(option) {
  const clone = option.cloneNode(true);

  clone.querySelectorAll('[aria-hidden="true"]').forEach(node => node.remove());

  return clone.textContent;
}
