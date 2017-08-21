require 'spec_helper'

module Pageflow
  describe AccountRoleQuery do
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

      it 'returns false if user has entry membership with given role on '\
         'account' do
        user = create(:user)
        account = create(:account, with_editor: user)
        create(:entry, with_publisher: user)

        result = AccountRoleQuery.new(user, account)
                                 .has_at_least_role?(:publisher)

        expect(result).to be false
      end

      it 'returns false if user has account membership with given role on '\
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
