require 'spec_helper'

module Pageflow
  module Admin
    describe AddMembershipButtonIfNeeded, type: :view_component do
      before do
        helper.extend(ActiveAdmin::ViewHelpers)
        helper.extend(Pageflow::Admin::MembershipsHelper)
        allow(helper).to receive(:new_admin_account_membership_path)
        allow(helper).to receive(:new_admin_user_membership_path)
        allow(helper).to receive(:url_for)
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
          add_membership_button_if_needed(account_manager, account, 'account')
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
          add_membership_button_if_needed(account_manager, account, 'account')
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
          add_membership_button_if_needed(user, user, 'account')
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
          add_membership_button_if_needed(user, user, 'account')
        end

        expect(rendered).to have_selector('a', class: 'disabled')
      end

      it 'does not render add account button when multiaccounts are off' do
        pageflow_configure do |config|
          config.allow_multiaccount_users = false
        end
        first_account = create(:account)
        user = create(:user, :member, on: first_account)
        account_manager = create(:user, :manager, on: first_account)
        sign_in(account_manager)

        render do
          add_membership_button_if_needed(user, user, 'account')
        end

        expect(rendered).to_not have_selector('a', text: 'Add Account')
        expect(rendered).to_not have_selector('a', class: 'disabled')
      end
    end
  end
end
