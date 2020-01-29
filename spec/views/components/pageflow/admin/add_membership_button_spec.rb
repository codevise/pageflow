require 'spec_helper'

module Pageflow
  module Admin
    describe AddMembershipButton, type: :view_component do
      before do
        helper.extend(ActiveAdmin::ViewHelpers)
        helper.extend(Pageflow::Admin::MembershipsHelper)
        allow(helper).to receive(:new_admin_account_membership_path)
        allow(helper).to receive(:new_admin_user_membership_path)
        allow(helper).to receive(:url_for)
      end

      it 'renders add user button when there is user to add' do
        common_account = create(:account)
        create(:user, :member, on: common_account)
        account_manager = create(:user, :manager, on: common_account)
        entry = create(:entry, account: common_account,
                               with_editor: account_manager,
                               title: 'Entry 1')

        sign_in(account_manager, scope: :user)

        render do
          add_membership_button(account_manager, entry, 'entry')
        end

        expect(rendered).to have_selector('a', text: 'Add user')
        expect(rendered).to_not have_selector('a', class: 'disabled')
      end

      it 'do not render add user button when there is no user to add' do
        user = create(:user)
        entry = create(:entry, with_editor: user, title: 'Entry 1')
        sign_in(user, scope: :user)

        render do
          add_membership_button(user, entry, 'entry')
        end
        expect(rendered).to_not have_selector('a', text: 'Add user')
      end

      it 'renders cannot add user partial if not possible to add user to story' do
        user = create(:user)
        entry = create(:entry, with_editor: user, title: 'Entry 1')
        sign_in(user, scope: :user)

        html_template = <<-HTML
          <div class="custom_cannot_add_user_message">
            Cannot add any more users.
          </div>
        HTML
        stub_template('pageflow/admin/entries/_cannot_add_user.html.erb' => html_template)

        render do
          add_membership_button(user, entry, 'entry')
        end
        expect(rendered).to have_selector('.custom_cannot_add_user_message',
                                          text: 'Cannot add any more users.')
      end

      it 'renders add user button when account available' do
        account = create(:account)
        user_account = create(:account)
        create(:user, :member, on: user_account)
        account_manager = create(:user, :manager, on: account)
        create(:membership,
               user: account_manager,
               entity: user_account,
               role: :manager)
        sign_in(account_manager)

        render do
          add_membership_button(account_manager, account, 'account')
        end

        expect(rendered).to have_selector('a', text: 'Add user')
        expect(rendered).to_not have_selector('a', class: 'disabled')
      end

      it 'renders disabled add user button when account unavailable' do
        account = create(:account)
        create(:user, :member, on: account)
        account_manager = create(:user, :manager, on: account)
        sign_in(account_manager)

        render do
          add_membership_button(account_manager, account, 'account')
        end

        expect(rendered).to have_selector('a', class: 'disabled')
      end

      it 'renders add account button when account available' do
        first_account = create(:account)
        user = create(:user, :member, on: first_account)
        second_account = create(:account)
        account_manager = create(:user, :manager, on: first_account)
        create(:membership,
               user: account_manager,
               entity: second_account,
               role: 'manager')
        sign_in(account_manager)

        render do
          add_membership_button(account_manager, user, 'account')
        end

        expect(rendered).to have_selector('a', text: 'Add Account')
        expect(rendered).to_not have_selector('a', class: 'disabled')
      end

      it 'renders disabled add account button when account unavailable' do
        first_account = create(:account)
        user = create(:user, :member, on: first_account)
        account_manager = create(:user, :manager, on: first_account)
        sign_in(account_manager)

        render do
          add_membership_button(account_manager, user, 'account')
        end

        expect(rendered).to have_selector('a', class: 'disabled')
      end
    end
  end
end
