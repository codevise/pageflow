require 'spec_helper'

module Pageflow
  module Policies
    describe AccountPolicy do
      it_behaves_like 'a membership-based permission that',
                      allows: 'publisher',
                      but_forbids: 'editor',
                      of_account: -> (topic) { topic },
                      to: :publish,
                      topic: -> { create(:account) }

      it_behaves_like 'a membership-based permission that',
                      allows: 'publisher',
                      but_forbids: 'editor',
                      of_account: -> (topic) { topic },
                      to: :read,
                      topic: -> { create(:account) }

      it_behaves_like 'a membership-based permission that',
                      allows: 'publisher',
                      but_forbids: 'editor',
                      of_account: -> (topic) { topic },
                      to: :configure_folder_on,
                      topic: -> { create(:account) }

      it_behaves_like 'a membership-based permission that',
                      allows: 'publisher',
                      but_forbids: 'editor',
                      of_account: -> (topic) { topic },
                      to: :update_theming_on_entry_of,
                      topic: -> { create(:account) }

      it_behaves_like 'a membership-based permission that',
                      allows: 'manager',
                      but_forbids: 'publisher',
                      of_account: -> (topic) { topic },
                      to: :manage,
                      topic: -> { create(:account) }

      it_behaves_like 'a membership-based permission that',
                      allows: 'manager',
                      but_forbids: 'publisher',
                      of_account: -> (topic) { topic },
                      to: :update,
                      topic: -> { create(:account) }

      it_behaves_like 'a membership-based permission that',
                      allows: 'manager',
                      but_forbids: 'publisher',
                      of_account: -> (topic) { topic },
                      to: :add_member_to,
                      topic: -> { create(:account) }

      it_behaves_like 'a membership-based permission that',
                      allows: 'manager',
                      but_forbids: 'publisher',
                      of_account: -> (topic) { topic },
                      to: :edit_role_on,
                      topic: -> { create(:account) }

      it_behaves_like 'a membership-based permission that',
                      allows: 'manager',
                      but_forbids: 'publisher',
                      of_account: -> (topic) { topic },
                      to: :destroy_membership_on,
                      topic: -> { create(:account) }

      it_behaves_like 'an admin permission that',
                      allows_admins_but_forbids_even_managers: true,
                      of_account: -> (topic) { topic },
                      to: :admin,
                      topic: -> { create(:account) }

      it_behaves_like 'an admin permission that',
                      allows_admins_but_forbids_even_managers: true,
                      of_account: -> (topic) { topic },
                      to: :index,
                      topic: -> { create(:account) }
    end

    describe '.resolve' do
      it 'includes all accounts for admins' do
        user = create(:user, :admin)

        expect(Policies::AccountPolicy::Scope
                .new(user, Account).resolve).to include(create(:account))
      end

      it 'includes accounts with memberships with correct user, correct account and ' \
         'sufficient role' do
        user = create(:user)
        account = create(:account, with_member: user)

        expect(Policies::AccountPolicy::Scope
                .new(user, Account).resolve).to include(account)
      end

      it 'does not include accounts with memberships with wrong entity id/insufficient role' do
        user = create(:user)
        account = create(:account)

        expect(Policies::AccountPolicy::Scope
                .new(user, Account).resolve).not_to include(account)
      end

      it 'does not include accounts with memberships with wrong user' do
        user = create(:user)
        wrong_user = create(:user)
        account = create(:account, with_member: wrong_user)

        expect(Policies::AccountPolicy::Scope
                .new(user, Account).resolve).not_to include(account)
      end

      it 'does not include accounts with membership with nil account id' do
        user = create(:user)
        account = Account.new
        create(:membership, user: user, entity: account)

        expect(Policies::AccountPolicy::Scope
                .new(user, Account).resolve).not_to include(account)
      end
    end

    describe '.entry_creatable' do
      it 'includes all accounts for admins' do
        user = create(:user, :admin)

        expect(Policies::AccountPolicy::Scope
                .new(user, Account).entry_creatable).to include(create(:account))
      end

      it 'includes accounts with memberships with correct user, correct account and ' \
         'sufficient role' do
        user = create(:user)
        account = create(:account, with_publisher: user)

        expect(Policies::AccountPolicy::Scope
                .new(user, Account).entry_creatable).to include(account)
      end

      it 'does not include accounts with memberships with wrong entity id' do
        user = create(:user)
        account = create(:account)

        expect(Policies::AccountPolicy::Scope
                .new(user, Account).entry_creatable).not_to include(account)
      end

      it 'does not include accounts with memberships with wrong user' do
        user = create(:user)
        wrong_user = create(:user)
        account = create(:account, with_publisher: wrong_user)

        expect(Policies::AccountPolicy::Scope
                .new(user, Account).entry_creatable).not_to include(account)
      end

      it 'does not include accounts with memberships with insufficient role' do
        user = create(:user)
        account = create(:account, with_editor: user)

        expect(Policies::AccountPolicy::Scope
                .new(user, Account).entry_creatable).not_to include(account)
      end

      it 'does not include accounts with membership with nil account id' do
        user = create(:user)
        account = Account.new
        create(:membership, user: user, entity: account)

        expect(Policies::AccountPolicy::Scope
                .new(user, Account).entry_creatable).not_to include(account)
      end
    end

    describe '.entry_movable' do
      it 'includes all accounts for admins' do
        user = create(:user, :admin)

        expect(Policies::AccountPolicy::Scope
                .new(user, Account).entry_movable).to include(create(:account))
      end

      it 'includes accounts with memberships with correct user, correct account and ' \
         'sufficient role' do
        user = create(:user)
        account = create(:account, with_publisher: user)

        expect(Policies::AccountPolicy::Scope
                .new(user, Account).entry_movable).to include(account)
      end

      it 'does not include accounts with memberships with wrong entity id' do
        user = create(:user)
        account = create(:account)

        expect(Policies::AccountPolicy::Scope
                .new(user, Account).entry_movable).not_to include(account)
      end

      it 'does not include accounts with memberships with wrong user' do
        user = create(:user)
        wrong_user = create(:user)
        account = create(:account, with_publisher: wrong_user)

        expect(Policies::AccountPolicy::Scope
                .new(user, Account).entry_movable).not_to include(account)
      end

      it 'does not include accounts with memberships with insufficient role' do
        user = create(:user)
        account = create(:account, with_editor: user)

        expect(Policies::AccountPolicy::Scope
                .new(user, Account).entry_movable).not_to include(account)
      end

      it 'does not include accounts with membership with nil account id' do
        user = create(:user)
        account = Account.new
        create(:membership, user: user, entity: account)

        expect(Policies::AccountPolicy::Scope
                .new(user, Account).entry_movable).not_to include(account)
      end
    end

      describe '.member_addable' do
        it 'includes all accounts for admins' do
          user = create(:user, :admin)

          expect(Policies::AccountPolicy::Scope
                  .new(user, Account).member_addable).to include(create(:account))
        end

        it 'includes accounts with memberships with correct user, correct account and ' \
           'sufficient role' do
          user = create(:user)
          account = create(:account, with_manager: user)

          expect(Policies::AccountPolicy::Scope
                  .new(user, Account).member_addable).to include(account)
        end

        it 'does not include accounts with memberships with wrong entity id' do
          user = create(:user)
          account = create(:account)

          expect(Policies::AccountPolicy::Scope
                  .new(user, Account).member_addable).not_to include(account)
        end

        it 'does not include accounts with memberships with wrong user' do
          user = create(:user)
          wrong_user = create(:user)
          account = create(:account, with_manager: wrong_user)

          expect(Policies::AccountPolicy::Scope
                  .new(user, Account).member_addable).not_to include(account)
        end

        it 'does not include accounts with memberships with insufficient role' do
          user = create(:user)
          account = create(:account, with_publisher: user)

          expect(Policies::AccountPolicy::Scope
                  .new(user, Account).member_addable).not_to include(account)
        end

        it 'does not include accounts with membership with nil account id' do
          user = create(:user)
          account = Account.new
          create(:membership, user: user, entity: account)

          expect(Policies::AccountPolicy::Scope
                  .new(user, Account).member_addable).not_to include(account)
        end
      end

    describe '.themings_accessible' do
      it 'includes all accounts for admins' do
        user = create(:user, :admin)

        expect(Policies::AccountPolicy::Scope
                .new(user, Account).themings_accessible).to include(create(:account))
      end

      it 'includes accounts with memberships with correct user, correct account and ' \
         'sufficient role' do
        user = create(:user)
        account = create(:account, with_publisher: user)

        expect(Policies::AccountPolicy::Scope
                .new(user, Account).themings_accessible).to include(account)
      end

      it 'does not include accounts with memberships with wrong entity id' do
        user = create(:user)
        account = create(:account)

        expect(Policies::AccountPolicy::Scope
                .new(user, Account).themings_accessible).not_to include(account)
      end

      it 'does not include accounts with memberships with wrong user' do
        user = create(:user)
        wrong_user = create(:user)
        account = create(:account, with_publisher: wrong_user)

        expect(Policies::AccountPolicy::Scope
                .new(user, Account).themings_accessible).not_to include(account)
      end

      it 'does not include accounts with memberships with insufficient role' do
        user = create(:user)
        account = create(:account, with_editor: user)

        expect(Policies::AccountPolicy::Scope
                .new(user, Account).themings_accessible).not_to include(account)
      end

      it 'does not include accounts with membership with nil account id' do
        user = create(:user)
        account = Account.new
        create(:membership, user: user, entity: account)

        expect(Policies::AccountPolicy::Scope
                .new(user, Account).themings_accessible).not_to include(account)
      end
    end
  end
end
