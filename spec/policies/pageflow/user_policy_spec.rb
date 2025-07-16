require 'spec_helper'

module Pageflow
  describe UserPolicy do
    it_behaves_like 'a membership-based permission that',
                    allows: :manager,
                    but_forbids: :publisher,
                    of_account: ->(topic) { topic.accounts.first },
                    to: :read,
                    topic: -> { create(:user, :member, on: create(:account)) }

    it_behaves_like 'an admin permission that',
                    allows_admins_but_forbids_even_managers: true,
                    of_account: ->(topic) { topic.accounts.first },
                    to: :suspend,
                    topic: -> { create(:user, :member, on: create(:account)) }

    it_behaves_like 'an admin permission that',
                    allows_admins_but_forbids_even_managers: true,
                    of_account: ->(topic) { topic.accounts.first },
                    to: :destroy,
                    topic: -> { create(:user, :member, on: create(:account)) }

    context 'when allow_multiaccount_users is false' do
      before do
        pageflow_configure do |config|
          config.allow_multiaccount_users = false
        end
      end

      it_behaves_like 'a membership-based permission that',
                      allows: :manager,
                      but_forbids: :publisher,
                      of_account: ->(topic) { topic.accounts.first },
                      to: :suspend,
                      topic: -> { create(:user, :member, on: create(:account)) }

      it_behaves_like 'a membership-based permission that',
                      allows: :manager,
                      but_forbids: :publisher,
                      of_account: ->(topic) { topic.accounts.first },
                      to: :destroy,
                      topic: -> { create(:user, :member, on: create(:account)) }
    end

    context 'without only_admins_may_see_admin_boolean' do
      before do
        pageflow_configure do |config|
          config.permissions.only_admins_may_see_admin_boolean = false
        end
      end

      it_behaves_like 'a membership-based permission that',
                      allows: :manager,
                      but_forbids: :publisher,
                      of_account: ->(topic) { topic.accounts.first },
                      to: :see_admin_status,
                      topic: -> { create(:user, :member, on: create(:account)) }
    end

    context 'with only_admins_may_see_admin_boolean' do
      before do
        pageflow_configure do |config|
          config.permissions.only_admins_may_see_admin_boolean = true
        end
      end

      it_behaves_like 'an admin permission that',
                      allows_admins_but_forbids_even_managers: true,
                      of_account: ->(topic) { topic.accounts.first },
                      to: :see_admin_status,
                      topic: -> { create(:user, :member, on: create(:account)) }
    end

    it_behaves_like 'a membership-based permission that',
                    allows: :manager,
                    but_forbids: :publisher,
                    of_account: ->(topic) { topic.accounts.first },
                    to: :redirect_to_user,
                    topic: -> { create(:user, :member, on: create(:account)) }

    it_behaves_like 'an admin permission that',
                    allows_admins_but_forbids_even_managers: true,
                    of_account: ->(topic) { topic.accounts.first },
                    to: :admin,
                    topic: -> { create(:user, :member, on: create(:account)) }

    it_behaves_like 'an admin permission that',
                    allows_admins_but_forbids_even_managers: true,
                    of_account: ->(topic) { topic.accounts.first },
                    to: :set_admin,
                    topic: -> { create(:user, :member, on: create(:account)) }

    describe 'delete_own_user?' do
      it 'allows users when authorize_user_deletion is true' do
        Pageflow.config.authorize_user_deletion = ->(_user) { true }

        user = create(:user)

        expect(UserPolicy.new(user, user)).to permit_action(:delete_own_user)
      end

      it 'does not allow users when authorize_user_deletion is false' do
        Pageflow.config.authorize_user_deletion =
          ->(_user) { 'User cannot be deleted. Database is read-only' }

        user = create(:user)

        expect(UserPolicy.new(user, user)).not_to permit_action(:delete_own_user)
      end
    end

    describe '.resolve' do
      it 'includes all users if admin' do
        admin = create(:user, :admin)

        expect(UserPolicy::Scope.new(admin, ::User).resolve).to include(create(:user))
      end

      it 'includes member on managed account' do
        account_manager = create(:user)
        managed_user = create(:user)
        create(:account, with_member: managed_user, with_manager: account_manager)

        expect(UserPolicy::Scope.new(account_manager, ::User).resolve).to include(managed_user)
      end

      it 'does not include member on publisher account' do
        account_publisher = create(:user)
        managed_user = create(:user)
        create(:account, with_member: managed_user, with_publisher: account_publisher)

        expect(UserPolicy::Scope
                .new(account_publisher, ::User).resolve).not_to include(managed_user)
      end

      it 'does not include previewer on managed entry' do
        account_manager = create(:user)
        managed_user = create(:user)
        create(:entry, with_previewer: managed_user, with_manager: account_manager)

        expect(UserPolicy::Scope.new(account_manager, ::User).resolve).not_to include(managed_user)
      end

      it 'does not include member on other account' do
        account_manager = create(:user)
        managed_user = create(:user)
        create(:account, with_manager: account_manager)
        create(:account, with_member: managed_user)

        expect(UserPolicy::Scope.new(account_manager, ::User).resolve).not_to include(managed_user)
      end
    end

    describe 'index?' do
      it 'allows admin to index users' do
        user = create(:user, :admin)

        policy = UserPolicy.new(user, create(:user))

        expect(policy).to permit_action(:index)
      end

      it 'allows user with manager permissions on account to index users' do
        user = create(:user, :manager, on: create(:account))

        policy = UserPolicy.new(user, create(:user))

        expect(policy).to permit_action(:index)
      end

      it 'does not allow user with publisher permissions on account to index users' do
        user = create(:user, :publisher, on: create(:account))

        policy = UserPolicy.new(user, create(:user))

        expect(policy).not_to permit_action(:index)
      end

      it 'does not allow user with manager permissions on entry to index users' do
        user = create(:user, :manager, on: create(:entry))

        policy = UserPolicy.new(user, create(:user))

        expect(policy).not_to permit_action(:index)
      end
    end

    describe 'create_any?' do
      it 'allows admin to view invite user form' do
        user = create(:user, :admin)

        policy = UserPolicy.new(user, create(:user))

        expect(policy).to permit_action(:create_any)
      end

      it 'allows user with manager permissions on account to view invite user form' do
        user = create(:user, :manager, on: create(:account))

        policy = UserPolicy.new(user, User.new)

        expect(policy).to permit_action(:create_any)
      end

      it 'does not allow user with publisher permissions on account to view invite user form' do
        user = create(:user, :publisher, on: create(:account))

        policy = UserPolicy.new(user, User.new)

        expect(policy).not_to permit_action(:create_any)
      end

      it 'does not allow user with manager permissions on entry to view invite user form' do
        user = create(:user, :manager, on: create(:entry))

        policy = UserPolicy.new(user, User.new)

        expect(policy).not_to permit_action(:create_any)
      end
    end

    describe 'create?' do
      it 'allows user with manager permissions on account to create users' do
        user = create(:user, :manager, on: create(:account))

        policy = UserPolicy.new(user, create(:user))

        expect(policy).to permit_action(:create)
      end

      it 'does not allow user with publisher permissions on account to create users' do
        user = create(:user, :publisher, on: create(:account))

        policy = UserPolicy.new(user, create(:user))

        expect(policy).not_to permit_action(:create)
      end

      it 'does not allow user with manager permissions on entry to index users' do
        user = create(:user, :manager, on: create(:entry))

        policy = UserPolicy.new(user, create(:user))

        expect(policy).not_to permit_action(:create)
      end
    end

    context 'with allow_multiaccount_users' do
      it 'allows to add account to user' do
        pageflow_configure do |config|
          config.allow_multiaccount_users = true
        end

        policy = UserPolicy.new(create(:user), create(:user))

        expect(policy).to permit_action(:add_account_to)
      end
    end

    context 'without allow_multiaccount_users' do
      it 'does not allow to add account to user' do
        pageflow_configure do |config|
          config.allow_multiaccount_users = false
        end

        policy = UserPolicy.new(create(:user), create(:user))

        expect(policy).to_not permit_action(:add_account_to)
      end
    end
  end
end
