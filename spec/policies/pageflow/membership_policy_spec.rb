require 'spec_helper'

module Pageflow
  describe MembershipPolicy do
    it_behaves_like 'a membership-based permission that',
                    allows: :manager,
                    but_forbids: :publisher,
                    of_entry: ->(topic) { topic.entity },
                    to: :create,
                    topic: -> { create(:entry_membership) }

    it_behaves_like 'a membership-based permission that',
                    allows: :manager,
                    but_forbids: :publisher,
                    of_account: ->(topic) { topic.entity },
                    to: :create,
                    topic: -> { create(:account_membership) }

    it_behaves_like 'a membership-based permission that',
                    allows: :manager,
                    but_forbids: :publisher,
                    of_entry: ->(topic) { topic.entity },
                    to: :edit_role,
                    topic: -> { create(:entry_membership) }

    it_behaves_like 'a membership-based permission that',
                    allows: :manager,
                    but_forbids: :publisher,
                    of_account: ->(topic) { topic.entity },
                    to: :edit_role,
                    topic: -> { create(:account_membership) }

    it_behaves_like 'a membership-based permission that',
                    allows: :manager,
                    but_forbids: :publisher,
                    of_entry: ->(topic) { topic.entity },
                    to: :destroy,
                    topic: -> { create(:entry_membership) }

    context 'with allow_multiaccount_users' do
      before do
        pageflow_configure do |config|
          config.allow_multiaccount_users = true
        end
      end

      it_behaves_like 'a membership-based permission that',
                      allows: :manager,
                      but_forbids: :publisher,
                      of_account: ->(topic) { topic.entity },
                      to: :destroy,
                      topic: -> { create(:account_membership) }
    end

    context 'without allow_multiaccount users' do
      before do
        pageflow_configure do |config|
          config.allow_multiaccount_users = false
        end
      end

      it 'does not allow even admins to destroy an account membership' do
        membership = create(:account_membership)
        user = create(:user, :admin)
        policy = MembershipPolicy.new(user, membership)

        expect(policy).not_to permit_action(:destroy)
      end
    end

    describe '.indexable' do
      it 'includes all memberships for admins' do
        user = create(:user, :admin)

        expect(MembershipPolicy::Scope
                .new(user, Membership).indexable).to include(create(:membership))
      end

      it 'includes memberships with correct user and correct entry' do
        user = create(:user)
        entry = create(:entry)
        membership = create(:membership, role: :previewer, entity: entry, user:)
        entry_previewer = create(:user, :previewer, on: entry)

        expect(MembershipPolicy::Scope
                .new(entry_previewer, Membership).indexable).to include(membership)
      end

      it 'includes memberships with correct user and correct account' do
        user = create(:user)
        account = create(:account)
        membership = create(:membership, role: :previewer, entity: account, user:)
        account_manager = create(:user, :manager, on: account)

        expect(MembershipPolicy::Scope
                .new(account_manager, Membership).indexable).to include(membership)
      end

      it 'does not include memberships for entry non-member in spite of correct entry' do
        user = create(:user)
        entry = create(:entry)
        membership = create(:membership, role: :previewer, entity: entry, user:)
        entry_publisher = create(:user)

        expect(MembershipPolicy::Scope
                .new(entry_publisher, Membership).indexable).not_to include(membership)
      end

      it 'does not include account memberships for account publisher and entry manager '\
         'in spite of correct entry' do
        user = create(:user)
        account = create(:account)
        account_publisher = create(:user, :publisher, on: account)
        entry = create(:entry, account:, with_manager: account_publisher)
        membership = create(:membership, role: :member, entity: account, user:)

        expect(MembershipPolicy::Scope
                .new(account_publisher, Membership).indexable).not_to include(membership)
      end

      it 'does not include memberships with wrong entry' do
        user = create(:user)
        entry = create(:entry, with_previewer: user)
        other_entry = create(:entry)
        other_membership = create(:membership,
                                  role: :previewer,
                                  entity: other_entry,
                                  user: create(:user))
        entry_manager = create(:user, :manager, on: entry)

        expect(MembershipPolicy::Scope
                .new(entry_manager, Membership).indexable).not_to include(other_membership)
      end

      it 'does not include memberships with wrong user and correct entry' do
        user = create(:user)
        entry = create(:entry)
        membership = create(:membership, role: :previewer, entity: entry, user:)
        create(:user, :manager, on: entry)
        entry_manager = create(:user, :manager, on: create(:entry))

        expect(MembershipPolicy::Scope
                .new(entry_manager, Membership).indexable).not_to include(membership)
      end

      it 'does not include memberships with wrong account' do
        account = create(:account)
        membership = create(:membership, role: :previewer, entity: account, user: create(:user))
        account_manager = create(:user, :manager, on: create(:account))

        expect(MembershipPolicy::Scope
                .new(account_manager, Membership).indexable).not_to include(membership)
      end

      it 'does not include memberships with account publisher on correct account' do
        user = create(:user)
        account = create(:account)
        membership = create(:membership, role: :previewer, entity: account, user:)
        account_manager = create(:user, :publisher, on: account)

        expect(MembershipPolicy::Scope
                .new(account_manager, Membership).indexable).not_to include(membership)
      end

      it 'does not include memberships with entry manager on correct account' do
        user = create(:user)
        account = create(:account)
        entry = create(:entry, account:)
        membership = create(:membership, role: :previewer, entity: account, user:)
        account_manager = create(:user, :manager, on: entry)

        expect(MembershipPolicy::Scope
                .new(account_manager, Membership).indexable).not_to include(membership)
      end

      it 'includes own memberships' do
        user = create(:user)
        entry_membership = create(:membership,
                                  user:,
                                  role: :previewer,
                                  entity: create(:entry))
        account_membership = create(:membership,
                                    user:,
                                    role: :member,
                                    entity: create(:account))

        expect(MembershipPolicy::Scope
                .new(user, Membership).indexable).to include(entry_membership)
        expect(MembershipPolicy::Scope
                .new(user, Membership).indexable).to include(account_membership)
      end
    end
  end
end
