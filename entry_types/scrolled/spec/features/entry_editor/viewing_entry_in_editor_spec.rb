require 'spec_helper'

require 'pageflow/dom'
require 'support/dominos/editor'

RSpec.feature 'as entry editor, viewing entry in editor', js: true do
  scenario 'sees entry outline and preview' do
    entry = create(:entry, type_name: 'scrolled')
    chapter = create(:scrolled_chapter, revision: entry.draft)
    create(:section, chapter:)
    create(:section, chapter:)
    Pageflow::Dom::Admin::Page.sign_in_as(:editor, on: entry)

    visit(pageflow.editor_entry_path(entry))

    outline = Dom::Editor::EntryOutline.find!
    preview = Dom::Editor::EntryPreview.find!

    expect(preview.section_count).to eq(2)
    expect(outline).to be_present
  end
end
