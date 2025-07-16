require 'spec_helper'

module Pageflow
  describe AccountRoleQuery do
    describe AccountRoleQuery::Scope do
      describe '.with_role_at_least' do
        it 'includes accounts with membership with required role' do
          user = create(:user)
          account = create(:account, with_editor: user)

          result = AccountRoleQuery::Scope.new(user, Account).with_role_at_least(:editor)

          expect(result).to include(account)
        end

        it 'includes accounts with membership with stronger role' do
          user = create(:user)
          account = create(:account, with_publisher: user)

          result = AccountRoleQuery::Scope.new(user, Account).with_role_at_least(:editor)

          expect(result).to include(account)
        end

        it 'does not include accounts user is not member of' do
          user = create(:user)
          create(:account, with_editor: user)
          other_account = create(:account)

          result = AccountRoleQuery::Scope.new(user, Account).with_role_at_least(:editor)

          expect(result).not_to include(other_account)
        end

        it 'does not include accounts with membership with wrong user and correct id' do
          user = create(:user)
          other_user = create(:user)
          account = create(:account, with_editor: other_user)

          result = AccountRoleQuery::Scope.new(user, Account).with_role_at_least(:editor)

          expect(result).not_to include(account)
        end

        it 'does not include accounts with membership with wrong account' do
          user = create(:user)
          account = create(:account)
          create(:account, with_editor: user)

          result = AccountRoleQuery::Scope.new(user, Account).with_role_at_least(:editor)

          expect(result).not_to include(account)
        end

        it 'does not include accounts with memberships of insufficient role' do
          user = create(:user)
          account = create(:account, with_previewer: user)

          result = AccountRoleQuery::Scope.new(user, Account).with_role_at_least(:editor)

          expect(result).not_to include(account)
        end
      end
    end

    describe '.has_at_least_role?' do
      it 'returns true if user has account membership with given role' do
        user = create(:user)
        account = create(:account, with_publisher: user)

        result = AccountRoleQuery.new(user, account)
                                 .has_at_least_role?(:publisher)

        expect(result).to be true
      end

      it 'returns true if user has account membership with stronger role' do
        user = create(:user)
        account = create(:account, with_manager: user)

        result = AccountRoleQuery.new(user, account)
                                 .has_at_least_role?(:publisher)

        expect(result).to be true
      end

      it 'returns false if user has account membership with weaker role' do
        user = create(:user)
        account = create(:account, with_editor: user)

        result = AccountRoleQuery.new(user, account)
                                 .has_at_least_role?(:publisher)

        expect(result).to be false
      end

      it 'returns false if user has entry membership with given role on ' \
         'account' do
        user = create(:user)
        account = create(:account, with_editor: user)
        create(:entry, with_publisher: user)

        result = AccountRoleQuery.new(user, account)
                                 .has_at_least_role?(:publisher)

        expect(result).to be false
      end

      it 'returns false if user has account membership with given role on ' \
         'other account' do
        user = create(:user)
        account = create(:account, with_editor: user)
        create(:account, with_publisher: user)

        result = AccountRoleQuery.new(user, account)
                                 .has_at_least_role?(:publisher)

        expect(result).to be false
      end
    end
  end
end
