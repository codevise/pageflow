require 'spec_helper'

feature 'as entry publisher, publishing an entry', js: true do
  scenario 'without depublication date' do
    entry = create(:entry, title: 'Test Entry')
    Dom::Admin::Page.sign_in_as(:publisher, on: entry)

    visit(pageflow.editor_entry_path(entry))
    editor_sidebar = Dom::Editor::Sidebar.find!
    editor_sidebar.publish_button.click
    Dom::Editor::PublishEntryPanel.find!.publish
    Dom::Admin::EntryPage.visit_revisions(entry)

    expect(Dom::Admin::EntryRevision.published).to be_present
  end

  scenario 'with depublication date' do
    entry = create(:entry, title: 'Test Entry')
    Dom::Admin::Page.sign_in_as(:publisher, on: entry)

    visit(pageflow.editor_entry_path(entry))
    editor_sidebar = Dom::Editor::Sidebar.find!
    editor_sidebar.publish_button.click
    Dom::Editor::PublishEntryPanel.find!.publish_until(1.month.from_now)
    Dom::Admin::EntryPage.visit_revisions(entry)

    expect(Dom::Admin::EntryRevision.published_until_date).to be_present
  end

  scenario 'with invalid depublication time' do
    entry = create(:entry, title: 'Test Entry')
    Dom::Admin::Page.sign_in_as(:publisher, on: entry)

    visit(pageflow.editor_entry_path(entry))
    editor_sidebar = Dom::Editor::Sidebar.find!
    editor_sidebar.publish_button.click
    publish_panel = Dom::Editor::PublishEntryPanel.find!

    publish_panel.activate_publish_until
    publish_panel.set_depublication_date(1.month.from_now.strftime('%d.%m.%Y'), '40:30')

    expect(publish_panel.save_button).to be_disabled
  end

  scenario 'with password' do
    entry = create(:entry, title: 'Test Entry')
    Dom::Admin::Page.sign_in_as(:publisher, on: entry)

    visit(pageflow.editor_entry_path(entry))
    editor_sidebar = Dom::Editor::Sidebar.find!
    editor_sidebar.publish_button.click
    publish_panel = Dom::Editor::PublishEntryPanel.find!

    publish_panel.activate_password_protection('abc213')
    publish_panel.publish

    Dom::Admin::EntryPage.visit_revisions(entry)
    published_revision = Dom::Admin::EntryRevision.published.first

    expect(published_revision).to be_password_protected
  end
end
