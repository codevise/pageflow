require 'spec_helper'

module Pageflow
  describe ThemingPolicy do
    it_behaves_like 'a membership-based permission that',
                    allows: :publisher,
                    but_forbids: :editor,
                    of_account: -> (topic) { topic.account },
                    to: :edit,
                    topic: -> { create(:theming) }

    describe '.themings_allowed_for(accounts)' do
      it 'includes all themings for admins' do
        user = create(:user, :admin)
        theming = create(:theming)

        expect(ThemingPolicy::Scope
                .new(user, Theming).themings_allowed_for(create(:account))).to include(theming)
      end

      it 'includes themings for one account' do
        user = create(:user)
        account = create(:account, with_publisher: user)
        theming = create(:theming, account: account)

        expect(ThemingPolicy::Scope
                .new(user, Theming).themings_allowed_for(account)).to include(theming)
      end

      it 'excludes a theming for whose account the user is not at least publisher' do
        user = create(:user)

        account = create(:account, with_editor: user)
        theming = create(:theming, account: account)
        create(:entry, account: account, theming: theming, with_manager: user)

        account_policy_scope = AccountPolicy::Scope.new(user, Account)
        accounts = account_policy_scope.themings_accessible

        scope = ThemingPolicy::Scope.new(user, Theming).themings_allowed_for(accounts)

        expect(scope).to_not include(theming)
      end

      it 'does not include themings for wrong account' do
        user = create(:user)
        theming = create(:theming)

        scope = ThemingPolicy::Scope.new(user, Theming).themings_allowed_for(theming.account)

        expect(scope).to_not include(theming)
      end
    end
  end
end
