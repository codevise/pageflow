require 'spec_helper'

require 'pageflow/dom'
require 'support/dominos/editor'

RSpec.feature 'as entry editor, editing a content element', js: true do
  scenario 'can change text of heading' do
    entry = create(:entry, type_name: 'scrolled')
    create(:content_element,
           revision: entry.draft,
           type_name: 'heading',
           configuration: {children: 'Some text'})
    Pageflow::Dom::Admin::Page.sign_in_as(:editor, on: entry)

    visit(pageflow.editor_entry_path(entry))

    Dom::Editor::EntryPreview.find!.within_scrolled_entry do |preview|
      expect(preview.heading_content_element).to have_text('Some text')
      preview.heading_content_element.click
    end

    edit_configuration_view = Pageflow::Dom::Editor::EditConfigurationView.find!
    expect(edit_configuration_view.input_value('Text')).to eq('Some text')

    edit_configuration_view.change_input('Text', 'New text')

    Dom::Editor::EntryPreview.find!.within_scrolled_entry do |preview|
      expect(preview.heading_content_element).to have_text('New text')
    end
  end
end
