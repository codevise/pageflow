require 'spec_helper'

feature 'as entry manager, managing user roles' do
  context 'via entry show page' do
    scenario 'giving a member on the account of entry permissions on that entry' do
      entry = create(:entry)
      create(:user, :member, on: entry.account)
      Dom::Admin::Page.sign_in_as(:manager, on: entry)

      visit(admin_entry_path(entry))

      Dom::Admin::EntryPage.first.add_member_link.click
      Dom::Admin::MembershipForm.first.submit_with(role: 'publisher',
                                                   entity: entry)
      expect(Dom::Admin::EntryPage.first).to have_role_flag('publisher')
    end

    scenario 'editing permissions of a user on an entry' do
      entry = create(:entry)
      create(:user, :previewer, on: entry)
      Dom::Admin::Page.sign_in_as(:manager, on: entry)

      visit(admin_entry_path(entry))

      Dom::Admin::EntryPage.first.edit_role_link('previewer').click
      Dom::Admin::MembershipForm.first.submit_with(role: 'publisher')
      expect(Dom::Admin::EntryPage.first).to have_role_flag('publisher')
    end

    scenario 'deleting permissions of a user on an entry' do
      entry = create(:entry)
      create(:user, :previewer, on: entry)
      Dom::Admin::Page.sign_in_as(:manager, on: entry)

      visit(admin_entry_path(entry))

      Dom::Admin::EntryPage.first.delete_member_link('previewer').click

      expect(Dom::Admin::EntryPage.first).not_to have_role_flag('previewer')
    end
  end
end
