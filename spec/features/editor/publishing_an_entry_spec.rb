require 'spec_helper'

feature 'publishing an entry', :js => true do
  scenario 'without depublication date' do
    user = Dom::Admin::Page.sign_in_as(:editor)
    entry = create(:entry, :title => 'Test Entry', :with_member => user)

    visit(pageflow.edit_entry_path(entry))
    editor_sidebar = Dom::Editor::Sidebar.first
    editor_sidebar.publish_button.click
    Dom::Editor::PublishEntryPanel.find!.publish
    visit(admin_entry_path(entry))

    expect(Dom::Admin::EntryRevision.published).to be_present
  end

  scenario 'with depublication date', :js => true do
    user = Dom::Admin::Page.sign_in_as(:editor)
    entry = create(:entry, :title => 'Test Entry', :with_member => user)

    visit(pageflow.edit_entry_path(entry))
    editor_sidebar = Dom::Editor::Sidebar.first
    editor_sidebar.publish_button.click
    Dom::Editor::PublishEntryPanel.find!.publish_until(1.month.from_now)

    visit(admin_entry_path(entry))

    expect(Dom::Admin::EntryRevision.published_until_date).to be_present
  end

  scenario 'with invalid depublication time', :js => true do
    user = Dom::Admin::Page.sign_in_as(:editor)
    entry = create(:entry, :title => 'Test Entry', :with_member => user)

    visit(pageflow.edit_entry_path(entry))
    editor_sidebar = Dom::Editor::Sidebar.first
    editor_sidebar.publish_button.click
    publish_panel =  Dom::Editor::PublishEntryPanel.find!

    publish_panel.activate_publish_until
    publish_panel.set_depublication_date(1.month.from_now.strftime('%d.%m.%Y'), '40:30')

    expect(publish_panel.save_button).to be_disabled
  end
end
