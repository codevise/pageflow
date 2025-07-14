require 'spec_helper'

module Pageflow
  describe ManagedUserQuery::Scope do
    describe '#resolve' do
      it 'includes users of accounts managed by the current user' do
        account = create(:account)
        current_user = create(:user, :manager, on: account)
        managed_user = create(:user, :member, on: account)

        result = ManagedUserQuery::Scope.new(current_user, User).resolve

        expect(result).to include(managed_user)
      end

      it 'does not include users that are not member of an account managed by user' do
        account = create(:account)
        current_user = create(:user, :manager, on: account)
        other_user = create(:user)

        result = ManagedUserQuery::Scope.new(current_user, User).resolve

        expect(result).not_to include(other_user)
      end

      it 'does not include users of accounts the current_user is not manager of' do
        account = create(:account)
        current_user = create(:user, :publisher, on: account)
        user = create(:user, :member, on: account)

        result = ManagedUserQuery::Scope.new(current_user, User).resolve

        expect(result).not_to include(user)
      end

      it 'does not include duplicate users if there are multiple common managed accounts' do
        account = create(:account)
        current_user = create(:user, :manager, on: account)
        user = create(:user, :member, on: account)
        other_account = create(:account)
        create(:membership, user: current_user, entity: other_account, role: 'manager')
        create(:membership, user:, entity: other_account, role: 'member')

        result = ManagedUserQuery::Scope.new(current_user, User).resolve

        expect(result.size).to eq(2)
      end

      describe 'for admins' do
        it 'includes all users' do
          current_user = create(:user, :admin)
          managed_user = create(:user)

          result = ManagedUserQuery::Scope.new(current_user, User).resolve

          expect(result).to include(managed_user)
        end
      end
    end
  end
end
