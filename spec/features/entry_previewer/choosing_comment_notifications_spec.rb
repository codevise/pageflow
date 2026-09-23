require 'spec_helper'

feature 'as entry previewer, choosing comment notifications for an entry' do
  scenario 'muting an entry from its admin page' do
    entry = create(:entry, title: 'Noisy Entry', with_feature: 'commenting')
    Dom::Admin::Page.sign_in_as(:previewer, on: entry)

    visit(admin_entry_path(entry))
    click_link('Muted')

    expect(page).to have_selector('.dropdown_menu_button .comment_notification_level.muted')
  end

  scenario 'arriving from a link that asks for the notification menu', js: true do
    entry = create(:entry, title: 'Noisy Entry', with_feature: 'commenting')
    Dom::Admin::Page.sign_in_as(:previewer, on: entry)

    visit(admin_entry_path(entry, comment_notifications: 'open'))

    expect(page).to have_selector('.entry_comment_notifications .dropdown_menu_list')
  end

  scenario 'signing in on the way there', js: true do
    entry = create(:entry, title: 'Noisy Entry', with_feature: 'commenting')
    user = create(:user, email: 'previewer@example.com', password: '!Pass123')
    create(:membership, user:, role: :previewer, entity: entry)

    visit(admin_entry_path(entry, comment_notifications: 'open'))
    Dom::Admin::SignInForm.find!.submit_with(email: 'previewer@example.com',
                                             password: '!Pass123')

    expect(page).to have_selector('.entry_comment_notifications .dropdown_menu_list')
  end
end
