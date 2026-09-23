require 'spec_helper'

feature 'as entry previewer, choosing comment notifications for an entry' do
  scenario 'muting an entry from its admin page' do
    entry = create(:entry, title: 'Noisy Entry', with_feature: 'commenting')
    Dom::Admin::Page.sign_in_as(:previewer, on: entry)

    visit(admin_entry_path(entry))
    click_link('Muted')

    expect(page).to have_selector('.dropdown_menu_button .comment_notification_level.muted')
  end
end
