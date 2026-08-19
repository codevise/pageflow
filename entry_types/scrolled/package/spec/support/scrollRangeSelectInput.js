import userEvent from '@testing-library/user-event';
import {within} from '@testing-library/dom';
import {Input} from 'pageflow/testHelpers';

import styles from 'editor/views/inputs/ScrollRangeSelectInputView.module.css';

// Options of the scroll range select are only rendered while the
// dropdown is open. Read the name of each range from the description,
// since options also contain the play progress of their illustration.
export async function scrollRangeNames(propertyName, {inView}) {
  const input = Input.findByPropertyName(propertyName, {inView, visible: true});
  const queries = within(input.$el[0]);
  const user = userEvent.setup();

  await user.click(queries.getByRole('button'));

  return queries.getAllByRole('option').map(
    option => option.querySelector(`.${styles.description}`).textContent
  );
}
