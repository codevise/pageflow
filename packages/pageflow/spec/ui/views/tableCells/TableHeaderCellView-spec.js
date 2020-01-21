import {TableHeaderCellView} from 'pageflow/ui';

import * as support from '$support';

describe('TableHeaderCellView', () => {
  support.useFakeTranslations({
    'columns.first_name.column_header': 'First Name'
  });

  it('uses attribute translation as text', () => {
    var cell = new TableHeaderCellView({
      column: {
        name: 'first_name'
      },
      attributeTranslationKeyPrefixes: ['columns']
    });

    cell.render();

    expect(cell.$el).toHaveText('First Name');
  });
});