require 'spec_helper'

module Pageflow
  describe MembershipPolicy do
    it_behaves_like 'a membership-based permission that',
                    allows: :manager,
                    but_forbids: :publisher,
                    of_entry: -> (topic) { topic.entity },
                    to: :create,
                    topic: -> { create(:entry_membership) }

    it_behaves_like 'a membership-based permission that',
                    allows: :manager,
                    but_forbids: :publisher,
                    of_account: -> (topic) { topic.entity },
                    to: :create,
                    topic: -> { create(:account_membership) }

    it_behaves_like 'a membership-based permission that',
                    allows: :manager,
                    but_forbids: :publisher,
                    of_entry: -> (topic) { topic.entity },
                    to: :edit_role,
                    topic: -> { create(:entry_membership) }

    it_behaves_like 'a membership-based permission that',
                    allows: :manager,
                    but_forbids: :publisher,
                    of_account: -> (topic) { topic.entity },
                    to: :edit_role,
                    topic: -> { create(:account_membership) }

    it_behaves_like 'a membership-based permission that',
                    allows: :manager,
                    but_forbids: :publisher,
                    of_entry: -> (topic) { topic.entity },
                    to: :destroy,
                    topic: -> { create(:entry_membership) }

    it_behaves_like 'a membership-based permission that',
                    allows: :manager,
                    but_forbids: :publisher,
                    of_account: -> (topic) { topic.entity },
                    to: :destroy,
                    topic: -> { create(:account_membership) }

    describe '.indexable' do
      it 'includes all memberships for admins' do
        user = create(:user, :admin)

        expect(MembershipPolicy::Scope
                .new(user, Membership).indexable).to include(create(:membership))
      end

      it 'includes memberships with correct user and correct entry' do
        user = create(:user)
        entry = create(:entry)
        membership = create(:membership, role: :previewer, entity: entry, user: user)
        entry_manager = create(:user, :manager, on: entry)

        expect(MembershipPolicy::Scope
                .new(entry_manager, Membership).indexable).to include(membership)
      end

      it 'includes memberships with correct user and correct account' do
        user = create(:user)
        account = create(:account)
        membership = create(:membership, role: :previewer, entity: account, user: user)
        account_manager = create(:user, :manager, on: account)

        expect(MembershipPolicy::Scope
                .new(account_manager, Membership).indexable).to include(membership)
      end

      it 'does not include memberships for entry publisher in spite of correct entry' do
        user = create(:user)
        entry = create(:entry)
        membership = create(:membership, role: :previewer, entity: entry, user: user)
        entry_publisher = create(:user, :publisher, on: entry)

        expect(MembershipPolicy::Scope
                .new(entry_publisher, Membership).indexable).not_to include(membership)
      end

      it 'does not include memberships for account publisher in spite of correct entry' do
        user = create(:user)
        entry = create(:entry)
        membership = create(:membership, role: :previewer, entity: entry, user: user)
        account_publisher = create(:user, :publisher, on: entry.account)

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
        membership = create(:membership, role: :previewer, entity: entry, user: user)
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
        membership = create(:membership, role: :previewer, entity: account, user: user)
        account_manager = create(:user, :publisher, on: account)

        expect(MembershipPolicy::Scope
                .new(account_manager, Membership).indexable).not_to include(membership)
      end

      it 'does not include memberships with entry manager on correct account' do
        user = create(:user)
        account = create(:account)
        entry = create(:entry, account: account)
        membership = create(:membership, role: :previewer, entity: account, user: user)
        account_manager = create(:user, :manager, on: entry)

        expect(MembershipPolicy::Scope
                .new(account_manager, Membership).indexable).not_to include(membership)
      end

      it 'does not include memberships with nil entry id' do
        user = create(:user)
        entry = Entry.new
        membership = create(:membership, user: user, entity: entry, role: :previewer)
        entry_manager = create(:user, :manager, on: entry)

        expect(MembershipPolicy::Scope
                .new(entry_manager, Membership).indexable).not_to include(membership)
      end

      it 'does not include memberships with nil account id' do
        user = create(:user)
        account = Account.new
        membership = create(:membership, user: user, entity: account, role: :previewer)
        account_manager = create(:user, :manager, on: account)

        expect(MembershipPolicy::Scope
                .new(account_manager, Membership).indexable).not_to include(membership)
      end
    end
  end
end
