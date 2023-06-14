require 'spec_helper'

require 'pageflow/dom'
require 'support/dominos/editor'

RSpec.feature 'as entry editor, editing a content element', js: true do
  scenario 'can change the target value of a counter' do
    entry = create(:entry, type_name: 'scrolled')
    create(:content_element,
           revision: entry.draft,
           type_name: 'counter',
           configuration: {
             targetValue: '10',
             unit: 'km',
             countingSpeed: 'none'
           })
    Pageflow::Dom::Admin::Page.sign_in_as(:editor, on: entry)

    visit(pageflow.editor_entry_path(entry))

    Dom::Editor::EntryPreview.find!.within_scrolled_entry do |preview|
      expect(preview).to have_text('10km')
      preview.content_element_selection_rect.click
    end

    edit_configuration_view = Pageflow::Dom::Editor::EditConfigurationView.find!
    expect(edit_configuration_view.input_value('Target value')).to eq('10')

    edit_configuration_view.change_input('Target value', '100')

    Dom::Editor::EntryPreview.find!.within_scrolled_entry do |preview|
      expect(preview).to have_text('100km')
    end
  end
end
