require 'spec_helper'

module Pageflow
  describe EntryPolicy do
    it_behaves_like 'a membership-based permission that',
                    allows: :manager,
                    but_forbids: :publisher,
                    of_entry_or_its_account: ->(topic) { topic },
                    to: :manage,
                    topic: -> { create(:entry) }

    it_behaves_like 'a membership-based permission that',
                    allows: :manager,
                    but_forbids: :publisher,
                    of_entry_or_its_account: ->(topic) { topic },
                    to: :add_member_to,
                    topic: -> { create(:entry) }

    it_behaves_like 'a membership-based permission that',
                    allows: :manager,
                    but_forbids: :publisher,
                    of_entry_or_its_account: ->(topic) { topic },
                    to: :edit_role_on,
                    topic: -> { create(:entry) }

    it_behaves_like 'a membership-based permission that',
                    allows: :manager,
                    but_forbids: :publisher,
                    of_entry_or_its_account: ->(topic) { topic },
                    to: :destroy_membership_on,
                    topic: -> { create(:entry) }

    it_behaves_like 'a membership-based permission that',
                    allows: :publisher,
                    but_forbids: :editor,
                    of_entry_or_its_account: ->(topic) { topic },
                    to: :publish,
                    topic: -> { create(:entry) }

    it_behaves_like 'a membership-based permission that',
                    allows: :publisher,
                    but_forbids: :editor,
                    of_account: ->(topic) { topic.account },
                    to: :create,
                    topic: -> { create(:entry) }

    it_behaves_like 'a membership-based permission that',
                    forbids: :manager,
                    of_entry: ->(topic) { topic },
                    to: :create,
                    topic: -> { create(:entry) }

    it_behaves_like 'a membership-based permission that',
                    allows: :publisher,
                    but_forbids: :editor,
                    of_entry_or_its_account: ->(topic) { topic },
                    to: :duplicate,
                    topic: -> { create(:entry) }

    it_behaves_like 'a membership-based permission that',
                    allows: :publisher,
                    but_forbids: :editor,
                    of_account: ->(topic) { topic.account },
                    to: :manage_translations,
                    topic: -> { create(:entry) }

    it_behaves_like 'a membership-based permission that',
                    forbids: :manager,
                    of_entry: ->(topic) { topic },
                    to: :manage_translations,
                    topic: -> { create(:entry) }

    it_behaves_like 'a membership-based permission that',
                    allows: :editor,
                    but_forbids: :previewer,
                    of_entry_or_its_account: ->(topic) { topic },
                    to: :edit,
                    topic: -> { create(:entry) }

    it_behaves_like 'a membership-based permission that',
                    allows: :editor,
                    but_forbids: :previewer,
                    of_entry_or_its_account: ->(topic) { topic },
                    to: :index_widgets_for,
                    topic: -> { create(:entry) }

    it_behaves_like 'a membership-based permission that',
                    allows: :editor,
                    but_forbids: :previewer,
                    of_entry_or_its_account: ->(topic) { topic },
                    to: :edit_outline,
                    topic: -> { create(:entry) }

    it_behaves_like 'a membership-based permission that',
                    allows: :editor,
                    but_forbids: :previewer,
                    of_entry_or_its_account: ->(topic) { topic },
                    to: :restore,
                    topic: -> { create(:entry) }

    it_behaves_like 'a membership-based permission that',
                    allows: :editor,
                    but_forbids: :previewer,
                    of_entry_or_its_account: ->(topic) { topic },
                    to: :snapshot,
                    topic: -> { create(:entry) }

    it_behaves_like 'a membership-based permission that',
                    allows: :editor,
                    but_forbids: :previewer,
                    of_entry_or_its_account: ->(topic) { topic },
                    to: :confirm_encoding,
                    topic: -> { create(:entry) }

    it_behaves_like 'a membership-based permission that',
                    allows: :previewer,
                    of_entry_or_its_account: ->(topic) { topic },
                    to: :preview,
                    topic: -> { create(:entry) }

    it_behaves_like 'a membership-based permission that',
                    allows: :previewer,
                    of_entry_or_its_account: ->(topic) { topic },
                    to: :read,
                    topic: -> { create(:entry) }

    it_behaves_like 'a membership-based permission that',
                    allows: :previewer,
                    of_entry_or_its_account: ->(topic) { topic },
                    to: :use_files,
                    topic: -> { create(:entry) }

    it_behaves_like 'a membership-based permission that',
                    allows: :publisher,
                    but_forbids: :editor,
                    of_account: ->(topic) { topic.account },
                    to: :publish_on_account_of,
                    topic: -> { create(:entry) }

    it_behaves_like 'a membership-based permission that',
                    allows: :publisher,
                    but_forbids: :editor,
                    of_account: ->(topic) { topic.account },
                    to: :update_account_on,
                    topic: -> { create(:entry) }

    context 'without only_admins_may_update_site' do
      before do
        pageflow_configure do |config|
          config.permissions.only_admins_may_update_site = false
        end
      end

      it_behaves_like 'a membership-based permission that',
                      allows: :publisher,
                      but_forbids: :editor,
                      of_account: ->(topic) { topic.account },
                      to: :update_site_on,
                      topic: -> { create(:entry) }
    end

    context 'with only_admins_may_update_site' do
      before do
        pageflow_configure do |config|
          config.permissions.only_admins_may_update_site = true
        end
      end

      it_behaves_like 'an admin permission that',
                      allows_admins_but_forbids_even_managers: true,
                      of_account: ->(topic) { topic.account },
                      to: :update_site_on,
                      topic: -> { create(:entry) }
    end

    it_behaves_like 'a membership-based permission that',
                    allows: :manager,
                    but_forbids: :publisher,
                    of_account: ->(topic) { topic.account },
                    to: :manage_account_of,
                    topic: -> { create(:entry) }

    context 'without only_admins_may_update_features' do
      before do
        pageflow_configure do |config|
          config.permissions.only_admins_may_update_features = false
        end
      end

      it_behaves_like 'a membership-based permission that',
                      allows: :manager,
                      but_forbids: :publisher,
                      of_account: ->(topic) { topic.account },
                      to: :update_feature_configuration_on,
                      topic: -> { create(:entry) }
    end

    context 'with only_admins_may_update_features' do
      before do
        pageflow_configure do |config|
          config.permissions.only_admins_may_update_features = true
        end
      end

      it_behaves_like 'an admin permission that',
                      allows_admins_but_forbids_even_managers: true,
                      of_account: ->(topic) { topic.account },
                      to: :update_feature_configuration_on,
                      topic: -> { create(:entry) }
    end

    it_behaves_like 'a membership-based permission that',
                    allows: :manager,
                    but_forbids: :publisher,
                    of_account: ->(topic) { topic.account },
                    to: :destroy,
                    topic: -> { create(:entry) }

    describe 'create_any?' do
      it 'allows admin to view new entry form' do
        user = create(:user, :admin)

        policy = EntryPolicy.new(user, Entry.new)

        expect(policy).to permit_action(:create_any)
      end

      it 'allows publisher of at least one account to view new entry form' do
        user = create(:user, :publisher, on: create(:account))

        policy = EntryPolicy.new(user, Entry.new)

        expect(policy).to permit_action(:create_any)
      end

      it 'does not allow account editor to view new entry from' do
        user = create(:user, :editor, on: create(:account))

        policy = EntryPolicy.new(user, Entry.new)

        expect(policy).not_to permit_action(:create_any)
      end

      it 'does not allow entry manager to view new entry form' do
        user = create(:user, :manager, on: create(:entry))

        policy = EntryPolicy.new(user, Entry.new)

        expect(policy).not_to permit_action(:create_any)
      end
    end

    describe 'filter_by_type?' do
      it 'is allowed for admin' do
        user = create(:user, :admin)

        policy = EntryPolicy.new(user, Entry.new)

        expect(policy).to permit_action(:filter_by_type)
      end

      it 'is not allowed for non admins' do
        user = create(:user, :publisher, on: create(:account))

        policy = EntryPolicy.new(user, Entry.new)

        expect(policy).not_to permit_action(:filter_by_type)
      end
    end

    describe '.resolve' do
      it 'includes all entries for admins' do
        user = create(:user, :admin)

        expect(EntryPolicy::Scope.new(user, Entry).resolve).to include(create(:entry))
      end

      it 'includes entries with membership with correct user and correct id' do
        user = create(:user)
        entry = create(:entry, with_previewer: user)

        expect(EntryPolicy::Scope.new(user, Entry).resolve).to include(entry)
      end

      it 'includes entries with membership with correct user and correct account' do
        user = create(:user)
        account = create(:account, with_previewer: user)
        entry = create(:entry, account:)

        expect(EntryPolicy::Scope.new(user, Entry).resolve).to include(entry)
      end

      it 'does not include entries with wrong id' do
        user = create(:user)
        create(:entry, with_previewer: user)
        other_entry = create(:entry)

        expect(EntryPolicy::Scope.new(user, Entry).resolve).not_to include(other_entry)
      end

      it 'does not include entries with membership with wrong user and correct id' do
        user = create(:user)
        other_user = create(:user)
        entry = create(:entry, with_previewer: other_user)

        expect(EntryPolicy::Scope.new(user, Entry).resolve).not_to include(entry)
      end

      it 'does not include entries with membership with wrong account' do
        user = create(:user)
        account = create(:account)
        create(:account, with_previewer: user)
        entry = create(:entry, account:)

        expect(EntryPolicy::Scope.new(user, Entry).resolve).not_to include(entry)
      end

      it 'does not include entries with membership with wrong user and correct account' do
        user = create(:user)
        other_user = create(:user)
        account = create(:account, with_previewer: other_user)
        entry = create(:entry, account:)

        expect(EntryPolicy::Scope.new(user, Entry).resolve).not_to include(entry)
      end
    end

    describe '.editor_or_above' do
      it 'includes no entries for admin without memberships' do
        user = create(:user, :admin)

        expect(EntryPolicy::Scope.new(user, Entry).editor_or_above).to be_empty
      end

      it 'includes entries with membership with correct user and correct id' do
        user = create(:user)
        entry = create(:entry, with_editor: user)

        expect(EntryPolicy::Scope.new(user, Entry).editor_or_above).to include(entry)
      end

      it 'includes entries with membership with correct user and correct account' do
        user = create(:user)
        account = create(:account, with_editor: user)
        entry = create(:entry, account:)

        expect(EntryPolicy::Scope.new(user, Entry).editor_or_above).to include(entry)
      end

      it 'does not include entries with wrong id' do
        user = create(:user)
        create(:entry, with_editor: user)
        other_entry = create(:entry)

        expect(EntryPolicy::Scope.new(user, Entry).editor_or_above).not_to include(other_entry)
      end

      it 'does not include entries with membership with wrong user and correct id' do
        user = create(:user)
        other_user = create(:user)
        entry = create(:entry, with_editor: other_user)

        expect(EntryPolicy::Scope.new(user, Entry).editor_or_above).not_to include(entry)
      end

      it 'does not include entries with membership with wrong account' do
        user = create(:user)
        account = create(:account)
        create(:account, with_editor: user)
        entry = create(:entry, account:)

        expect(EntryPolicy::Scope.new(user, Entry).editor_or_above).not_to include(entry)
      end

      it 'does not include entries with membership with wrong user and correct account' do
        user = create(:user)
        other_user = create(:user)
        account = create(:account, with_editor: other_user)
        entry = create(:entry, account:)

        expect(EntryPolicy::Scope.new(user, Entry).editor_or_above).not_to include(entry)
      end

      it 'does not include entries with memberships of insufficient role' do
        user = create(:user)
        entry = create(:entry, with_previewer: user)

        expect(EntryPolicy::Scope.new(user, Entry).editor_or_above).not_to include(entry)
      end
    end

    describe '.publisher_or_above' do
      it 'includes no entries for admin without memberships' do
        user = create(:user, :admin)

        expect(EntryPolicy::Scope.new(user, Entry).publisher_or_above).to be_empty
      end

      it 'includes entries with membership with correct user and correct id' do
        user = create(:user)
        entry = create(:entry, with_publisher: user)

        expect(EntryPolicy::Scope.new(user, Entry).publisher_or_above).to include(entry)
      end

      it 'includes entries with membership with correct user and correct account' do
        user = create(:user)
        account = create(:account, with_publisher: user)
        entry = create(:entry, account:)

        expect(EntryPolicy::Scope.new(user, Entry).publisher_or_above).to include(entry)
      end

      it 'does not include entries with wrong id' do
        user = create(:user)
        create(:entry, with_publisher: user)
        other_entry = create(:entry)

        expect(EntryPolicy::Scope.new(user, Entry).publisher_or_above).not_to include(other_entry)
      end

      it 'does not include entries with membership with wrong user and correct id' do
        user = create(:user)
        other_user = create(:user)
        entry = create(:entry, with_publisher: other_user)

        expect(EntryPolicy::Scope.new(user, Entry).publisher_or_above).not_to include(entry)
      end

      it 'does not include entries with membership with wrong account' do
        user = create(:user)
        account = create(:account)
        create(:account, with_publisher: user)
        entry = create(:entry, account:)

        expect(EntryPolicy::Scope.new(user, Entry).publisher_or_above).not_to include(entry)
      end

      it 'does not include entries with membership with wrong user and correct account' do
        user = create(:user)
        other_user = create(:user)
        account = create(:account, with_publisher: other_user)
        entry = create(:entry, account:)

        expect(EntryPolicy::Scope.new(user, Entry).publisher_or_above).not_to include(entry)
      end

      it 'does not include entries with memberships of insufficient role' do
        user = create(:user)
        entry = create(:entry, with_editor: user)

        expect(EntryPolicy::Scope.new(user, Entry).publisher_or_above).not_to include(entry)
      end
    end

    describe '.member_addable' do
      it 'includes no entries for admin without memberships' do
        user = create(:user, :admin)

        expect(EntryPolicy::Scope.new(user, Entry).member_addable).to be_empty
      end

      it 'includes entries with membership with correct user and correct id' do
        user = create(:user)
        entry = create(:entry, with_publisher: user)

        expect(EntryPolicy::Scope.new(user, Entry).member_addable).to include(entry)
      end

      it 'includes entries with membership with correct user and correct account' do
        user = create(:user)
        account = create(:account, with_publisher: user)
        entry = create(:entry, account:)

        expect(EntryPolicy::Scope.new(user, Entry).member_addable).to include(entry)
      end

      it 'does not include entries with wrong id' do
        user = create(:user)
        create(:entry, with_publisher: user)
        other_entry = create(:entry)

        expect(EntryPolicy::Scope.new(user, Entry).member_addable).not_to include(other_entry)
      end

      it 'does not include entries with membership with wrong user and correct id' do
        user = create(:user)
        other_user = create(:user)
        entry = create(:entry, with_publisher: other_user)

        expect(EntryPolicy::Scope.new(user, Entry).member_addable).not_to include(entry)
      end

      it 'does not include entries with membership with wrong account' do
        user = create(:user)
        account = create(:account)
        create(:account, with_publisher: user)
        entry = create(:entry, account:)

        expect(EntryPolicy::Scope.new(user, Entry).member_addable).not_to include(entry)
      end

      it 'does not include entries with membership with wrong user and correct account' do
        user = create(:user)
        other_user = create(:user)
        account = create(:account, with_publisher: other_user)
        entry = create(:entry, account:)

        expect(EntryPolicy::Scope.new(user, Entry).member_addable).not_to include(entry)
      end

      it 'does not include entries with memberships of insufficient role' do
        user = create(:user)
        entry = create(:entry, with_editor: user)

        expect(EntryPolicy::Scope.new(user, Entry).member_addable).not_to include(entry)
      end
    end

    describe '.manager_or_above' do
      it 'includes no entries for admin without memberships' do
        user = create(:user, :admin)

        expect(EntryPolicy::Scope.new(user, Entry).manager_or_above).to be_empty
      end

      it 'includes entries with membership with correct user and correct id' do
        user = create(:user)
        entry = create(:entry, with_manager: user)

        expect(EntryPolicy::Scope.new(user, Entry).manager_or_above).to include(entry)
      end

      it 'includes entries with membership with correct user and correct account' do
        user = create(:user)
        account = create(:account, with_manager: user)
        entry = create(:entry, account:)

        expect(EntryPolicy::Scope.new(user, Entry).manager_or_above).to include(entry)
      end

      it 'does not include entries with wrong id' do
        user = create(:user)
        create(:entry, with_manager: user)
        other_entry = create(:entry)

        expect(EntryPolicy::Scope.new(user, Entry).manager_or_above).not_to include(other_entry)
      end

      it 'does not include entries with membership with wrong user and correct id' do
        user = create(:user)
        other_user = create(:user)
        entry = create(:entry, with_manager: other_user)

        expect(EntryPolicy::Scope.new(user, Entry).manager_or_above).not_to include(entry)
      end

      it 'does not include entries with membership with wrong account' do
        user = create(:user)
        account = create(:account)
        create(:account, with_manager: user)
        entry = create(:entry, account:)

        expect(EntryPolicy::Scope.new(user, Entry).manager_or_above).not_to include(entry)
      end

      it 'does not include entries with membership with wrong user and correct account' do
        user = create(:user)
        other_user = create(:user)
        account = create(:account, with_manager: other_user)
        entry = create(:entry, account:)

        expect(EntryPolicy::Scope.new(user, Entry).manager_or_above).not_to include(entry)
      end

      it 'does not include entries with memberships of insufficient role' do
        user = create(:user)
        entry = create(:entry, with_publisher: user)

        expect(EntryPolicy::Scope.new(user, Entry).manager_or_above).not_to include(entry)
      end
    end
  end
end
