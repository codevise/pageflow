require 'spec_helper'

require 'pageflow/dom'
require 'support/dominos/editor'

RSpec.feature 'as entry editor, editing the entry outline', js: true do
  scenario 'can add and remove chapters' do
    entry = create(:entry, type_name: 'scrolled')
    Pageflow::Dom::Admin::Page.sign_in_as(:editor, on: entry)

    visit(pageflow.editor_entry_path(entry))

    outline = Dom::Editor::EntryOutline.find!
    outline.add_chapter_button.click

    expect(outline.chapter_items.size).to eq(1)

    outline.chapter_items.first.edit_link.click
    accept_confirm do
      Pageflow::Dom::Editor::EditConfigurationView.find!.destroy_button.click
    end

    outline = Dom::Editor::EntryOutline.find!
    expect(outline.chapter_items.size).to eq(0)
  end

  scenario 'can add and remove sections' do
    entry = create(:entry, type_name: 'scrolled')
    create(:scrolled_chapter, revision: entry.draft)
    Pageflow::Dom::Admin::Page.sign_in_as(:editor, on: entry)

    visit(pageflow.editor_entry_path(entry))

    outline = Dom::Editor::EntryOutline.find!
    chapter_item = outline.chapter_items.first
    chapter_item.add_section_button.click

    Pageflow::Dom::Editor::EditConfigurationView.find!.back_button.click
    chapter_item = outline.chapter_items.first
    expect(chapter_item.section_items.size).to eq(1)

    chapter_item.section_items.first.thumbnail.double_click
    accept_confirm do
      Pageflow::Dom::Editor::EditConfigurationView.find!.destroy_button.click
    end

    outline = Dom::Editor::EntryOutline.find!
    expect(outline.chapter_items.first.section_items.size).to eq(0)
  end
end
