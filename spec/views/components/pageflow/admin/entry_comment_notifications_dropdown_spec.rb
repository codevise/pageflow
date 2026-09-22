require 'spec_helper'

module Pageflow
  module Admin
    describe EntryCommentNotificationsDropdown, type: :view_component do
      it 'carries the class the drop down initializer looks for' do
        user = create(:user)
        entry = create(:entry, with_previewer: user)

        render(entry, CommentNotifications.for_entry(entry, user:))

        expect(rendered).to have_selector('.dropdown_menu.entry_comment_notifications')
      end

      it 'names what the menu governs' do
        user = create(:user)
        entry = create(:entry, with_previewer: user)

        render(entry, CommentNotifications.for_entry(entry, user:))

        expect(rendered).to have_selector('.dropdown_menu_list .heading',
                                          text: 'Comment notifications')
      end

      it 'offers the levels the entry rung can store' do
        user = create(:user)
        entry = create(:entry, with_previewer: user)

        render(entry, CommentNotifications.for_entry(entry, user:))

        expect(rendered).to have_selector(".dropdown_menu_list a[href*='level=all_activity']")
        expect(rendered)
          .to have_selector(".dropdown_menu_list a[href*='level=participating_threads']")
        expect(rendered).to have_selector(".dropdown_menu_list a[href*='level=watched_threads']")
        expect(rendered).to have_selector(".dropdown_menu_list a[href*='level=muted']")
      end

      it 'offers going back to the default' do
        user = create(:user)
        entry = create(:entry, with_previewer: user)

        render(entry, CommentNotifications.for_entry(entry, user:))

        expect(rendered).to have_selector(".dropdown_menu_list a:not([href*='level='])",
                                          text: 'Default')
      end

      it 'sets the level with a patch request' do
        user = create(:user)
        entry = create(:entry, with_previewer: user)

        render(entry, CommentNotifications.for_entry(entry, user:))

        expect(rendered).to have_selector(".dropdown_menu_list a[data-method='patch']", count: 5)
      end

      it 'explains each level' do
        user = create(:user)
        entry = create(:entry, with_previewer: user)

        render(entry, CommentNotifications.for_entry(entry, user:))

        expect(rendered).to have_selector('.hint', text: 'Every comment in this story')
        expect(rendered).to have_selector('.hint', text: 'Anything in those, but no new topics')
        expect(rendered).to have_selector('.hint', text: 'Nothing else from this story')
        expect(rendered).to have_selector('.hint', text: 'Nothing from this story')
      end

      it 'names the default an assigned entry falls back to' do
        user = create(:user)
        entry = create(:entry, with_previewer: user)

        render(entry, CommentNotifications.for_entry(entry, user:))

        expect(rendered).to have_selector('.name', text: 'Default – All activity')
        expect(rendered).to have_selector(
          '.hint', text: 'Default for stories I am assigned to as a member'
        )
      end

      it 'names the default an entry reached through the account falls back to' do
        user = create(:user)
        entry = create(:entry, account: create(:account, with_previewer: user))

        render(entry, CommentNotifications.for_entry(entry, user:))

        expect(rendered).to have_selector('.name',
                                          text: 'Default – Topics I have commented in')
        expect(rendered).to have_selector(
          '.hint', text: 'Default for stories I am not assigned to as a member'
        )
      end

      it 'marks the level the user set for the entry' do
        user = create(:user)
        entry = create(:entry, with_previewer: user)
        create(:entry_comment_notification_override, entry:, user:, level: 'muted')

        render(entry, CommentNotifications.for_entry(entry, user:))

        expect(rendered).to have_selector("a[href*='level=muted'][aria-current]")
      end

      it 'marks the default when the user has not set a level for the entry' do
        user = create(:user)
        entry = create(:entry, with_previewer: user)

        render(entry, CommentNotifications.for_entry(entry, user:))

        expect(rendered).to have_selector("a:not([href*='level='])[aria-current]",
                                          text: 'Default')
      end

      it 'shows the level each item sets' do
        user = create(:user)
        entry = create(:entry, with_previewer: user)

        render(entry, CommentNotifications.for_entry(entry, user:))

        expect(rendered).to have_selector(
          ".dropdown_menu_list a[href*='level=muted'] .comment_notification_level.muted"
        )
      end

      it 'shows the level the default item falls back to' do
        user = create(:user)
        entry = create(:entry, account: create(:account, with_previewer: user))

        render(entry, CommentNotifications.for_entry(entry, user:))

        expect(rendered).to have_selector(
          ".dropdown_menu_list a:not([href*='level=']) " \
          '.comment_notification_level.participating_threads'
        )
      end

      it 'names itself and its level on a button that carries only the icon' do
        user = create(:user)
        entry = create(:entry, with_previewer: user)

        render(entry, CommentNotifications.for_entry(entry, user:))

        expect(rendered).to have_selector(
          ".dropdown_menu_button[aria-label='Comment notifications: All activity']"
        )
        expect(rendered).to have_selector(
          ".dropdown_menu_button[title='Comment notifications: All activity']"
        )
      end

      it 'shows the level the entry resolves to on the button' do
        user = create(:user)
        entry = create(:entry, with_previewer: user)
        create(:entry_comment_notification_override, entry:, user:, level: 'muted')

        render(entry, CommentNotifications.for_entry(entry, user:))

        expect(rendered)
          .to have_selector('.dropdown_menu_button .comment_notification_level.muted')
      end

      it 'shows the resolved default on the button without an override' do
        user = create(:user)
        entry = create(:entry, with_previewer: user)

        render(entry, CommentNotifications.for_entry(entry, user:))

        expect(rendered)
          .to have_selector('.dropdown_menu_button .comment_notification_level.all_activity')
      end
    end
  end
end
