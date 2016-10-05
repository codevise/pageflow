require 'spec_helper'

module Pageflow
  describe EntryRoleQuery do
    describe EntryRoleQuery::Scope do
      describe '.with_role_at_least' do
        it 'includes entries with entry membership with required role' do
          user = create(:user)
          entry = create(:entry, with_editor: user)

          result = EntryRoleQuery::Scope.new(user, Entry).with_role_at_least(:editor)

          expect(result).to include(entry)
        end

        it 'includes entries with entry membership with stronger role' do
          user = create(:user)
          entry = create(:entry, with_publisher: user)

          result = EntryRoleQuery::Scope.new(user, Entry).with_role_at_least(:editor)

          expect(result).to include(entry)
        end

        it 'includes entries with account membership with required role' do
          user = create(:user)
          account = create(:account, with_editor: user)
          entry = create(:entry, account: account)

          result = EntryRoleQuery::Scope.new(user, Entry).with_role_at_least(:editor)

          expect(result).to include(entry)
        end

        it 'does not include entries user is not member of' do
          user = create(:user)
          create(:entry, with_editor: user)
          other_entry = create(:entry)

          result = EntryRoleQuery::Scope.new(user, Entry).with_role_at_least(:editor)

          expect(result).not_to include(other_entry)
        end

        it 'does not include entries with membership with wrong user and correct id' do
          user = create(:user)
          other_user = create(:user)
          entry = create(:entry, with_editor: other_user)

          result = EntryRoleQuery::Scope.new(user, Entry).with_role_at_least(:editor)

          expect(result).not_to include(entry)
        end

        it 'does not include entries with membership with wrong account' do
          user = create(:user)
          account = create(:account)
          create(:account, with_editor: user)
          entry = create(:entry, account: account)

          result = EntryRoleQuery::Scope.new(user, Entry).with_role_at_least(:editor)

          expect(result).not_to include(entry)
        end

        it 'does not include entries with memberships of insufficient role' do
          user = create(:user)
          entry = create(:entry, with_previewer: user)

          result = EntryRoleQuery::Scope.new(user, Entry).with_role_at_least(:editor)

          expect(result).not_to include(entry)
        end
      end
    end

    describe '.has_at_least_role?' do
      it 'returns true if user has membership with given role' do
        user = create(:user)
        entry = create(:entry, with_editor: user)

        result = EntryRoleQuery.new(user, entry).has_at_least_role?(:editor)

        expect(result).to be(true)
      end

      it 'returns true if user has membership with stronger role' do
        user = create(:user)
        entry = create(:entry, with_publisher: user)

        result = EntryRoleQuery.new(user, entry).has_at_least_role?(:editor)

        expect(result).to be(true)
      end

      it 'returns true if user has account membership with given role' do
        user = create(:user)
        account = create(:account, with_editor: user)
        entry = create(:entry, account: account)

        result = EntryRoleQuery.new(user, entry).has_at_least_role?(:editor)

        expect(result).to be(true)
      end

      it 'returns false if user has membership with weaker role' do
        user = create(:user)
        entry = create(:entry, with_previewer: user)

        result = EntryRoleQuery.new(user, entry).has_at_least_role?(:editor)

        expect(result).to be(false)
      end

      it 'returns false if user has membership with given role on other entry' do
        user = create(:user)
        create(:entry, with_editor: user)
        entry = create(:entry)

        result = EntryRoleQuery.new(user, entry).has_at_least_role?(:editor)

        expect(result).to be(false)
      end

      it 'returns false if user has account membership with given role on other account' do
        user = create(:user)
        create(:account, with_editor: user)
        entry = create(:entry)

        result = EntryRoleQuery.new(user, entry).has_at_least_role?(:editor)

        expect(result).to be(false)
      end
    end

    describe '.has_at_least_account_role?' do
      it 'returns true if user has account membership with given role' do
        user = create(:user)
        account = create(:account, with_editor: user)
        entry = create(:entry, account: account)

        result = EntryRoleQuery.new(user, entry).has_at_least_account_role?(:editor)

        expect(result).to be(true)
      end

      it 'returns false if user has membership with weaker role' do
        user = create(:user)
        account = create(:account, with_previewer: user)
        entry = create(:entry, account: account)

        result = EntryRoleQuery.new(user, entry).has_at_least_account_role?(:editor)

        expect(result).to be(false)
      end

      it 'returns false if user has entry membership with given role' do
        user = create(:user)
        entry = create(:entry, with_editor: user)

        result = EntryRoleQuery.new(user, entry).has_at_least_account_role?(:editor)

        expect(result).to be(false)
      end

      it 'returns false if user has account membership with given role on other account' do
        user = create(:user)
        create(:account, with_editor: user)
        entry = create(:entry)

        result = EntryRoleQuery.new(user, entry).has_at_least_account_role?(:editor)

        expect(result).to be(false)
      end
    end
  end
end
