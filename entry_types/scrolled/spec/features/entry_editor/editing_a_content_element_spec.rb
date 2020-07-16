require 'spec_helper'

require 'pageflow/dom'
require 'support/dominos/editor'

RSpec.feature 'as entry editor, editing a content element', js: true do
  scenario 'can change the caption of an inline image' do
    entry = create(:entry, type_name: 'scrolled')
    create(:content_element,
           revision: entry.draft,
           type_name: 'inlineImage',
           configuration: {caption: 'Some text'})
    Pageflow::Dom::Admin::Page.sign_in_as(:editor, on: entry)

    visit(pageflow.editor_entry_path(entry))

    Dom::Editor::EntryPreview.find!.within_scrolled_entry do |preview|
      expect(preview.inline_image_content_element_caption).to have_text('Some text')
      preview.inline_image_content_element_selection_rect.click
    end

    edit_configuration_view = Pageflow::Dom::Editor::EditConfigurationView.find!
    expect(edit_configuration_view.input_value('Caption')).to eq('Some text')

    edit_configuration_view.change_input('Caption', 'New text')

    Dom::Editor::EntryPreview.find!.within_scrolled_entry do |preview|
      expect(preview.inline_image_content_element_caption).to have_text('New text')
    end
  end
end
