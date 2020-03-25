require 'spec_helper'

module Pageflow
  describe AccountPolicy do
    it_behaves_like 'a membership-based permission that',
                    allows: :publisher,
                    but_forbids: :editor,
                    of_account: -> (topic) { topic },
                    to: :publish,
                    topic: -> { create(:account) }

    it_behaves_like 'a membership-based permission that',
                    allows: :publisher,
                    but_forbids: :editor,
                    of_account: -> (topic) { topic },
                    to: :configure_folder_on,
                    topic: -> { create(:account) }

    it_behaves_like 'a membership-based permission that',
                    allows: :publisher,
                    but_forbids: :editor,
                    of_account: -> (topic) { topic },
                    to: :update_theming_on_entry_of,
                    topic: -> { create(:account) }

    it_behaves_like 'a membership-based permission that',
                    allows: :manager,
                    but_forbids: :publisher,
                    of_account: -> (topic) { topic },
                    to: :read,
                    topic: -> { create(:account) }

    it_behaves_like 'a membership-based permission that',
                    allows: :manager,
                    but_forbids: :publisher,
                    of_account: -> (topic) { topic },
                    to: :update,
                    topic: -> { create(:account) }

    context 'without only_admins_may_update_features' do
      before do
        pageflow_configure do |config|
          config.permissions.only_admins_may_update_features = false
        end
      end

      it_behaves_like 'a membership-based permission that',
                      allows: :manager,
                      but_forbids: :publisher,
                      of_account: ->(topic) { topic },
                      to: :update_feature_configuration_on,
                      topic: -> { create(:account) }
    end

    context 'with only_admins_may_update_features' do
      before do
        pageflow_configure do |config|
          config.permissions.only_admins_may_update_features = true
        end
      end

      it_behaves_like 'an admin permission that',
                      allows_admins_but_forbids_even_managers: true,
                      of_account: ->(topic) { topic },
                      to: :update_feature_configuration_on,
                      topic: -> { create(:account) }
    end

    context 'with allow_multiaccount_users' do
      before do
        pageflow_configure do |config|
          config.allow_multiaccount_users = true
        end
      end

      it_behaves_like 'a membership-based permission that',
                      allows: :manager,
                      but_forbids: :publisher,
                      of_account: ->(topic) { topic },
                      to: :add_member_to,
                      topic: -> { create(:account) }

      it_behaves_like 'a membership-based permission that',
                      allows: :manager,
                      but_forbids: :publisher,
                      of_account: ->(topic) { topic },
                      to: :destroy_membership_on,
                      topic: -> { create(:account) }
    end

    context 'without allow_multiaccount_users' do
      before do
        pageflow_configure do |config|
          config.allow_multiaccount_users = false
        end
      end

      it 'does not even allow admins to add members to accounts' do
        account = create(:account)
        user = create(:user, :admin)
        policy = AccountPolicy.new(user, account)

        expect(policy).not_to permit_action(:add_member_to)
      end

      it 'does not even allow admins to remove members from accounts' do
        account = create(:account)
        user = create(:user, :admin)
        policy = AccountPolicy.new(user, account)

        expect(policy).not_to permit_action(:destroy_membership_on)
      end
    end

    it_behaves_like 'a membership-based permission that',
                    allows: :manager,
                    but_forbids: :publisher,
                    of_account: -> (topic) { topic },
                    to: :edit_role_on,
                    topic: -> { create(:account) }

    it_behaves_like 'a membership-based permission that',
                    allows: :manager,
                    but_forbids: :publisher,
                    of_account: ->(topic) { topic },
                    to: :see_user_quota,
                    topic: -> { create(:account) }

    it_behaves_like 'a membership-based permission that',
                    allows: :publisher,
                    but_forbids: :editor,
                    of_account: ->(topic) { topic },
                    to: :see_entry_types,
                    topic: -> { create(:account) }

    it_behaves_like 'an admin permission that',
                    allows_admins_but_forbids_even_managers: true,
                    of_account: -> (topic) { topic },
                    to: :admin,
                    topic: -> { create(:account) }
  end

  describe '.see_badge_belonging_to?' do
    it 'is permitted when user and account have an entry in common' do
      account = create(:account)
      user = create(:user)
      create(:entry, account: account, with_previewer: user)

      expect(AccountPolicy.new(user, account)).to permit_action(:see_badge_belonging_to)
    end

    it 'is not permitted when user and account have no entry in common' do
      expect(AccountPolicy.new(create(:user), create(:account))).not_to permit_action(:see_badge_belonging_to)
    end

    it 'is permitted when user is at least previewer on account' do
      account = create(:account)
      user = create(:user, :previewer, on: account)

      expect(AccountPolicy.new(user, account)).to permit_action(:see_badge_belonging_to)
    end

    it 'is not permitted when user is at most member on account' do
      account = create(:account)
      user = create(:user, :member, on: account)

      expect(AccountPolicy.new(user, account)).not_to permit_action(:see_badge_belonging_to)
    end
  end

  describe '.index?' do
    it 'is permitted when account manager on at least one account' do
      user = create(:user, :manager, on: create(:account))

      expect(AccountPolicy.new(user, create(:account))).to permit_action(:index)
    end

    it 'is not permitted when account publisher and entry manager' do
      user = create(:user, :publisher, on: create(:account))
      create(:entry, with_manager: user)

      expect(AccountPolicy.new(user, create(:account))).not_to permit_action(:index)
    end

    it 'is not permitted when account manager without multiaccounts' do
      pageflow_configure do |config|
        config.allow_multiaccount_users = false
      end

      user = create(:user, :manager, on: create(:account))

      expect(AccountPolicy.new(user, create(:account))).not_to permit_action(:index)
    end
  end

  describe '.resolve' do
    it 'includes all accounts for admins' do
      user = create(:user, :admin)

      expect(AccountPolicy::Scope.new(user, Account).resolve).to include(create(:account))
    end

    it 'includes accounts with memberships with correct user, correct account and ' \
       'sufficient role' do
      user = create(:user)
      account = create(:account, with_member: user)

      expect(AccountPolicy::Scope.new(user, Account).resolve).to include(account)
    end

    it 'does not include accounts with memberships with wrong entity id/insufficient role' do
      user = create(:user)
      account = create(:account)

      expect(AccountPolicy::Scope.new(user, Account).resolve).not_to include(account)
    end

    it 'does not include accounts with memberships with wrong user' do
      user = create(:user)
      wrong_user = create(:user)
      account = create(:account, with_member: wrong_user)

      expect(AccountPolicy::Scope.new(user, Account).resolve).not_to include(account)
    end
  end

  describe '.entry_creatable' do
    it 'includes all accounts for admins' do
      user = create(:user, :admin)

      expect(AccountPolicy::Scope.new(user, Account).entry_creatable).to include(create(:account))
    end

    it 'includes accounts with memberships with correct user, correct account and ' \
       'sufficient role' do
      user = create(:user)
      account = create(:account, with_publisher: user)

      expect(AccountPolicy::Scope.new(user, Account).entry_creatable).to include(account)
    end

    it 'does not include accounts with memberships with wrong entity id' do
      user = create(:user)
      account = create(:account)

      expect(AccountPolicy::Scope.new(user, Account).entry_creatable).not_to include(account)
    end

    it 'does not include accounts with memberships with wrong user' do
      user = create(:user)
      wrong_user = create(:user)
      account = create(:account, with_publisher: wrong_user)

      expect(AccountPolicy::Scope.new(user, Account).entry_creatable).not_to include(account)
    end

    it 'does not include accounts with memberships with insufficient role' do
      user = create(:user)
      account = create(:account, with_editor: user)

      expect(AccountPolicy::Scope.new(user, Account).entry_creatable).not_to include(account)
    end
  end

  describe '.entry_movable' do
    it 'includes all accounts for admins' do
      user = create(:user, :admin)

      expect(AccountPolicy::Scope.new(user, Account).entry_movable).to include(create(:account))
    end

    it 'includes accounts with memberships with correct user, correct account and ' \
       'sufficient role' do
      user = create(:user)
      account = create(:account, with_publisher: user)

      expect(AccountPolicy::Scope.new(user, Account).entry_movable).to include(account)
    end

    it 'does not include accounts with memberships with wrong entity id' do
      user = create(:user)
      account = create(:account)

      expect(AccountPolicy::Scope.new(user, Account).entry_movable).not_to include(account)
    end

    it 'does not include accounts with memberships with wrong user' do
      user = create(:user)
      wrong_user = create(:user)
      account = create(:account, with_publisher: wrong_user)

      expect(AccountPolicy::Scope.new(user, Account).entry_movable).not_to include(account)
    end

    it 'does not include accounts with memberships with insufficient role' do
      user = create(:user)
      account = create(:account, with_editor: user)

      expect(AccountPolicy::Scope.new(user, Account).entry_movable).not_to include(account)
    end
  end

  describe '.member_addable' do
    it 'includes all accounts for admins' do
      user = create(:user, :admin)

      expect(AccountPolicy::Scope.new(user, Account).member_addable).to include(create(:account))
    end

    it 'includes accounts with memberships with correct user, correct account and ' \
       'sufficient role' do
      user = create(:user)
      account = create(:account, with_manager: user)

      expect(AccountPolicy::Scope.new(user, Account).member_addable).to include(account)
    end

    it 'does not include accounts with memberships with wrong entity id' do
      user = create(:user)
      account = create(:account)

      expect(AccountPolicy::Scope.new(user, Account).member_addable).not_to include(account)
    end

    it 'does not include accounts with memberships with wrong user' do
      user = create(:user)
      wrong_user = create(:user)
      account = create(:account, with_manager: wrong_user)

      expect(AccountPolicy::Scope.new(user, Account).member_addable).not_to include(account)
    end

    it 'does not include accounts with memberships with insufficient role' do
      user = create(:user)
      account = create(:account, with_publisher: user)

      expect(AccountPolicy::Scope.new(user, Account).member_addable).not_to include(account)
    end
  end

  describe '.themings_accessible' do
    it 'includes all accounts for admins' do
      user = create(:user, :admin)

      expect(AccountPolicy::Scope.new(user, Account).themings_accessible).to include(create(:account))
    end

    it 'includes accounts with memberships with correct user, correct account and ' \
       'sufficient role' do
      user = create(:user)
      account = create(:account, with_publisher: user)

      expect(AccountPolicy::Scope.new(user, Account).themings_accessible).to include(account)
    end

    it 'does not include accounts with memberships with wrong entity id' do
      user = create(:user)
      account = create(:account)

      expect(AccountPolicy::Scope.new(user, Account).themings_accessible).not_to include(account)
    end

    it 'does not include accounts with memberships with wrong user' do
      user = create(:user)
      wrong_user = create(:user)
      account = create(:account, with_publisher: wrong_user)

      expect(AccountPolicy::Scope.new(user, Account).themings_accessible).not_to include(account)
    end

    it 'does not include accounts with memberships with insufficient role' do
      user = create(:user)
      account = create(:account, with_editor: user)

      expect(AccountPolicy::Scope.new(user, Account).themings_accessible).not_to include(account)
    end
  end

  describe '.folder_addable' do
    it 'includes all accounts for admins' do
      user = create(:user, :admin)

      expect(AccountPolicy::Scope
              .new(user, Account).folder_addable).to include(create(:account))
    end

    it 'includes accounts with memberships with correct user, correct account and ' \
       'sufficient role' do
      user = create(:user)
      account = create(:account, with_publisher: user)

      expect(AccountPolicy::Scope
              .new(user, Account).folder_addable).to include(account)
    end

    it 'does not include accounts with memberships with wrong entity id' do
      user = create(:user)
      account = create(:account)

      expect(AccountPolicy::Scope
              .new(user, Account).folder_addable).not_to include(account)
    end

    it 'does not include accounts with memberships with wrong user' do
      user = create(:user)
      wrong_user = create(:user)
      account = create(:account, with_publisher: wrong_user)

      expect(AccountPolicy::Scope
              .new(user, Account).folder_addable).not_to include(account)
    end

    it 'does not include accounts with memberships with insufficient role' do
      user = create(:user)
      account = create(:account, with_editor: user)

      expect(AccountPolicy::Scope
              .new(user, Account).folder_addable).not_to include(account)
    end
  end

  describe '.folder_addable' do
    it 'includes all accounts for admins' do
      user = create(:user, :admin)

      expect(AccountPolicy::Scope
              .new(user, Account).folder_addable).to include(create(:account))
    end

    it 'includes accounts with memberships with correct user, correct account and ' \
       'sufficient role' do
      user = create(:user)
      account = create(:account, with_publisher: user)

      expect(AccountPolicy::Scope
              .new(user, Account).folder_addable).to include(account)
    end

    it 'does not include accounts with memberships with wrong entity id' do
      user = create(:user)
      account = create(:account)

      expect(AccountPolicy::Scope
              .new(user, Account).folder_addable).not_to include(account)
    end

    it 'does not include accounts with memberships with wrong user' do
      user = create(:user)
      wrong_user = create(:user)
      account = create(:account, with_publisher: wrong_user)

      expect(AccountPolicy::Scope
              .new(user, Account).folder_addable).not_to include(account)
    end

    it 'does not include accounts with memberships with insufficient role' do
      user = create(:user)
      account = create(:account, with_editor: user)

      expect(AccountPolicy::Scope
              .new(user, Account).folder_addable).not_to include(account)
    end
  end
end
