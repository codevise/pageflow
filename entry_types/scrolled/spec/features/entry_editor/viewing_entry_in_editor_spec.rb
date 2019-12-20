require 'spec_helper'

require 'pageflow/dom'
require 'support/dominos/editor'

RSpec.feature 'as entry editor, viewing entry in editor', js: true do
  scenario 'sees entry outline' do
    entry = create(:entry, type_name: 'scrolled')
    Pageflow::Dom::Admin::Page.sign_in_as(:editor, on: entry)

    visit(pageflow.editor_entry_path(entry))
    outline = Dom::Editor::EntryOutline.find!

    expect(outline).to be_present
  end
end
