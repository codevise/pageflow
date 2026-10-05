import {FileMetaDataItemValueView} from 'pageflow/editor';

import * as support from '$support';
import {renderBackboneView as render} from 'pageflow/testHelpers';

describe('FileMetaDataItemValueView', () => {
  support.useFakeTranslations({
    'pageflow.editor.templates.file_meta_data_item_value_view.edit': 'Edit'
  });

  const ValueView = FileMetaDataItemValueView.extend({
    getText: () => 'value'
  });

  it('displays edit link if settings dialog tab link is given', () => {
    const view = new ValueView({
      model: support.factories.imageFile({id: 1}),
      name: 'rights',
      settingsDialogTabLink: 'general'
    });

    const {queryByRole} = render(view);

    expect(queryByRole('button', {name: 'Edit'})).not.toBeNull();
  });

  it('does not display edit link without settings dialog tab link', () => {
    const view = new ValueView({
      model: support.factories.imageFile({id: 1}),
      name: 'rights'
    });

    const {queryByRole} = render(view);

    expect(queryByRole('button', {name: 'Edit'})).toBeNull();
  });

  it('does not display edit link for new file', () => {
    const view = new ValueView({
      model: support.factories.imageFile(),
      name: 'rights',
      settingsDialogTabLink: 'general'
    });

    const {queryByRole} = render(view);

    expect(queryByRole('button', {name: 'Edit'})).toBeNull();
  });

  it('does not display edit link when read only', () => {
    const view = new ValueView({
      model: support.factories.imageFile({id: 1}),
      name: 'rights',
      settingsDialogTabLink: 'general',
      readOnly: true
    });

    const {queryByRole} = render(view);

    expect(queryByRole('button', {name: 'Edit'})).toBeNull();
  });

  it('keeps edit link hidden when read only file changes', () => {
    const file = support.factories.imageFile({id: 1});
    const view = new ValueView({
      model: file,
      name: 'rights',
      settingsDialogTabLink: 'general',
      readOnly: true
    });

    const {queryByRole} = render(view);
    file.set('state', 'processed');

    expect(queryByRole('button', {name: 'Edit'})).toBeNull();
  });
});
