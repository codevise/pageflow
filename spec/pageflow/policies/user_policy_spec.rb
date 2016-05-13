require 'spec_helper'

module Pageflow
  module Policies
    describe UserPolicy do
      it_behaves_like 'a membership-based permission that',
                      allows: 'manager',
                      but_forbids: 'publisher',
                      of_account: -> (topic) { topic.accounts.first },
                      to: :read,
                      topic: -> { create(:user, :member, on: create(:account)) }

      it_behaves_like 'a membership-based permission that',
                      allows: 'manager',
                      but_forbids: 'publisher',
                      of_account: -> (topic) { topic.accounts.first },
                      to: :redirect_to_user,
                      topic: -> { create(:user, :member, on: create(:account)) }

      describe 'index?' do
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

        it 'allows user with manager permissions on entry to index users' do
          user = create(:user, :manager, on: create(:entry))

          policy = UserPolicy.new(user, create(:user))

          expect(policy).not_to permit_action(:index)
        end
      end

      describe 'create?' do
        it 'allows user with manager permissions on account to index users' do
          user = create(:user, :manager, on: create(:account))

          policy = UserPolicy.new(user, create(:user))

          expect(policy).to permit_action(:create)
        end

        it 'does not allow user with publisher permissions on account to index users' do
          user = create(:user, :publisher, on: create(:account))

          policy = UserPolicy.new(user, create(:user))

          expect(policy).not_to permit_action(:create)
        end

        it 'allows user with manager permissions on entry to index users' do
          user = create(:user, :manager, on: create(:entry))

          policy = UserPolicy.new(user, create(:user))

          expect(policy).not_to permit_action(:create)
        end
      end

      describe '.resolve' do
        it 'includes all users if admin' do
          admin = create(:user, :admin)

          expect(Policies::UserPolicy::Scope.new(admin, ::User).resolve).to include(create(:user))
        end

        it 'includes member on managed account' do
          account_manager = create(:user)
          managed_user = create(:user)
          create(:account, with_member: managed_user, with_manager: account_manager)

          expect(Policies::UserPolicy::Scope
                  .new(account_manager, ::User).resolve).to include(managed_user)
        end

        it 'does not include member on publisher account' do
          account_publisher = create(:user)
          managed_user = create(:user)
          create(:account, with_member: managed_user, with_publisher: account_publisher)

          expect(Policies::UserPolicy::Scope
                  .new(account_publisher, ::User).resolve).not_to include(managed_user)
        end

        it 'does not include member on managed entry' do
          account_manager = create(:user)
          managed_user = create(:user)
          create(:entry, with_member: managed_user, with_manager: account_manager)

          expect(Policies::UserPolicy::Scope
                  .new(account_manager, ::User).resolve).not_to include(managed_user)
        end

        it 'does not include member on other account' do
          account_manager = create(:user)
          managed_user = create(:user)
          create(:account, with_manager: account_manager)
          create(:account, with_member: managed_user)

          expect(Policies::UserPolicy::Scope
                  .new(account_manager, ::User).resolve).not_to include(managed_user)
        end

        it 'does not include user with nil id' do
          account_manager = create(:user)
          managed_user = User.new
          create(:account, with_manager: account_manager)
          create(:account, with_member: managed_user)

          expect(Policies::UserPolicy::Scope
                  .new(account_manager, ::User).resolve).not_to include(managed_user)
        end
      end
    end
  end
end
