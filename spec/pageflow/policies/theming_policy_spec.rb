require 'spec_helper'

module Pageflow
  module Policies
    describe ThemingPolicy do
      it_behaves_like 'a membership-based permission that',
                      allows: 'publisher',
                      but_forbids: 'editor',
                      of_account: -> (topic) { topic.account },
                      to: :edit,
                      topic: -> { create(:theming) }

      it_behaves_like 'an admin permission that',
                      allows_admins_but_forbids_even_managers: true,
                      of_account: -> (topic) { topic.account },
                      to: :index_widgets_for,
                      topic: -> { create(:theming) }

      describe '.themings_allowed_for(accounts)' do
        it 'includes all themings for admins' do
          user = create(:user, :admin)
          theming = create(:theming)

          expect(Policies::ThemingPolicy::Scope.new(user,
                                                    Theming).themings_allowed_for(create(:account))).to include(theming)
        end

        it 'includes themings for one account' do
          user = create(:user)
          account = create(:account, with_publisher: user)
          theming = create(:theming, account: account)

          expect(Policies::ThemingPolicy::Scope.new(user, Theming).themings_allowed_for(account)).to include(theming)
        end

        it 'includes/excludes themings correctly for multiple accounts' do
          user = create(:user)
          other_user = create(:user)

          account = create(:account, with_publisher: user)
          create(:membership, user: other_user, role: 'publisher', entity: account)

          account_2 = create(:account, with_publisher: user)
          theming_2 = create(:theming, account: account_2)

          account_3 = create(:account, with_editor: user)
          theming_3 = create(:theming, account: account_3)
          create(:entry, account: account_3, theming: theming_3, with_manager: user)

          account_policy_scope = Pageflow::Policies::AccountPolicy::Scope.new(user, Account)
          accounts = account_policy_scope.themings_accessible

          other_user_account_policy_scope = Pageflow::Policies::AccountPolicy::Scope.new(other_user, Account)
          other_user_accounts = other_user_account_policy_scope.themings_accessible

          scope = Pageflow::Policies::ThemingPolicy::Scope.new(user, Theming).themings_allowed_for(accounts)
          other_user_scope = Pageflow::Policies::ThemingPolicy::Scope.new(other_user, Theming).themings_allowed_for(other_user_accounts)

          expect(scope).to include(theming_2)
          expect(scope).to_not include(theming_3)

          expect(other_user_scope).to_not include(theming_2)
        end

        it 'does not include themings for wrong account' do
          user = create(:user)
          theming = create(:theming)

          scope = Pageflow::Policies::ThemingPolicy::Scope.new(user, Theming).themings_allowed_for(theming.account)

          expect(scope).to_not include(theming)
        end

        it 'does not include themings with membership with nil account id' do
          user = create(:user)
          account = Account.new
          theming = create(:theming, account: account)
          create(:membership, user: user, entity: account)

          expect(Pageflow::Policies::ThemingPolicy::Scope.new(user, Theming).themings_allowed_for(account)).not_to include(theming)
        end
      end
    end
  end
end
