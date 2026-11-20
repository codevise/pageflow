import '@testing-library/jest-dom/extend-expect';

import {factories, renderWidgetConfigurationEditor} from 'pageflow/testHelpers';
import {ConfigurationEditorView, TextInputView} from 'pageflow/ui';

describe('renderWidgetConfigurationEditor', () => {
  it('renders configuration editor of widget with given role', () => {
    const entry = createEntry();

    const {getByInputPropertyName} = renderWidgetConfigurationEditor({entry, role: 'header'});

    expect(getByInputPropertyName('title')).toBeInTheDocument();
  });

  it('passes entry to configuration editor view', () => {
    const entry = createEntry({slug: 'some-entry'});

    const {getByRole} = renderWidgetConfigurationEditor({entry, role: 'header'});

    expect(getByRole('textbox')).toHaveAttribute('placeholder', 'some-entry');
  });
});

function createEntry(attributes) {
  const widgetTypes = factories.widgetTypes(
    [{role: 'header', name: 'someNavigation'}],
    widgetTypes => widgetTypes.register('someNavigation', {
      configurationEditorView: ConfigurationEditorView.extend({
        configure: function() {
          const entry = this.options.entry;

          this.tab('general', function() {
            this.input('title', TextInputView, {
              placeholder: entry.get('slug')
            });
          });
        }
      })
    })
  );

  return factories.entry(attributes, {
    widgetTypes,
    widgetsAttributes: [{id: 'header', role: 'header', type_name: 'someNavigation'}]
  });
}
