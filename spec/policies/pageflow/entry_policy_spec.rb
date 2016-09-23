require 'spec_helper'

module Pageflow
  describe EntryPolicy do
    it_behaves_like 'a membership-based permission that',
                    allows: :manager,
                    but_forbids: :publisher,
                    of_entry: -> (topic) { topic },
                    of_account: -> (topic) { topic.account },
                    to: :manage,
                    topic: -> { create(:entry) }

    it_behaves_like 'a membership-based permission that',
                    allows: :manager,
                    but_forbids: :publisher,
                    of_entry: -> (topic) { topic },
                    of_account: -> (topic) { topic.account },
                    to: :add_member_to,
                    topic: -> { create(:entry) }

    it_behaves_like 'a membership-based permission that',
                    allows: :manager,
                    but_forbids: :publisher,
                    of_entry: -> (topic) { topic },
                    of_account: -> (topic) { topic.account },
                    to: :edit_role_on,
                    topic: -> { create(:entry) }

    it_behaves_like 'a membership-based permission that',
                    allows: :manager,
                    but_forbids: :publisher,
                    of_entry: -> (topic) { topic },
                    of_account: -> (topic) { topic.account },
                    to: :destroy_membership_on,
                    topic: -> { create(:entry) }

    it_behaves_like 'a membership-based permission that',
                    allows: :publisher,
                    but_forbids: :editor,
                    of_entry: -> (topic) { topic },
                    of_account: -> (topic) { topic.account },
                    to: :publish,
                    topic: -> { create(:entry) }

    it_behaves_like 'a membership-based permission that',
                    allows: :publisher,
                    but_forbids: :editor,
                    of_entry: -> (topic) { topic },
                    of_account: -> (topic) { topic.account },
                    to: :create,
                    topic: -> { create(:entry) }

    it_behaves_like 'a membership-based permission that',
                    allows: :publisher,
                    but_forbids: :editor,
                    of_entry: -> (topic) { topic },
                    of_account: -> (topic) { topic.account },
                    to: :duplicate,
                    topic: -> { create(:entry) }

    it_behaves_like 'a membership-based permission that',
                    allows: :editor,
                    but_forbids: :previewer,
                    of_entry: -> (topic) { topic },
                    of_account: -> (topic) { topic.account },
                    to: :edit,
                    topic: -> { create(:entry) }

    it_behaves_like 'a membership-based permission that',
                    allows: :editor,
                    but_forbids: :previewer,
                    of_entry: -> (topic) { topic },
                    of_account: -> (topic) { topic.account },
                    to: :index_widgets_for,
                    topic: -> { create(:entry) }

    it_behaves_like 'a membership-based permission that',
                    allows: :editor,
                    but_forbids: :previewer,
                    of_entry: -> (topic) { topic },
                    of_account: -> (topic) { topic.account },
                    to: :edit_outline,
                    topic: -> { create(:entry) }

    it_behaves_like 'a membership-based permission that',
                    allows: :editor,
                    but_forbids: :previewer,
                    of_entry: -> (topic) { topic },
                    of_account: -> (topic) { topic.account },
                    to: :restore,
                    topic: -> { create(:entry) }

    it_behaves_like 'a membership-based permission that',
                    allows: :editor,
                    but_forbids: :previewer,
                    of_entry: -> (topic) { topic },
                    of_account: -> (topic) { topic.account },
                    to: :snapshot,
                    topic: -> { create(:entry) }

    it_behaves_like 'a membership-based permission that',
                    allows: :editor,
                    but_forbids: :previewer,
                    of_entry: -> (topic) { topic },
                    of_account: -> (topic) { topic.account },
                    to: :confirm_encoding,
                    topic: -> { create(:entry) }

    it_behaves_like 'a membership-based permission that',
                    allows: :previewer,
                    of_entry: -> (topic) { topic },
                    of_account: -> (topic) { topic.account },
                    to: :preview,
                    topic: -> { create(:entry) }

    it_behaves_like 'a membership-based permission that',
                    allows: :previewer,
                    of_entry: -> (topic) { topic },
                    of_account: -> (topic) { topic.account },
                    to: :read,
                    topic: -> { create(:entry) }

    it_behaves_like 'a membership-based permission that',
                    allows: :previewer,
                    of_entry: -> (topic) { topic },
                    of_account: -> (topic) { topic.account },
                    to: :use_files,
                    topic: -> { create(:entry) }

    it_behaves_like 'a membership-based permission that',
                    allows: :publisher,
                    but_forbids: :editor,
                    of_account: -> (topic) { topic.account },
                    to: :publish_on_account_of,
                    topic: -> { create(:entry) }

    it_behaves_like 'a membership-based permission that',
                    allows: :publisher,
                    but_forbids: :editor,
                    of_account: -> (topic) { topic.account },
                    to: :update_account_on,
                    topic: -> { create(:entry) }

    it_behaves_like 'a membership-based permission that',
                    allows: :publisher,
                    but_forbids: :editor,
                    of_account: -> (topic) { topic.account },
                    to: :update_theming_on,
                    topic: -> { create(:entry) }

    it_behaves_like 'a membership-based permission that',
                    allows: :manager,
                    but_forbids: :publisher,
                    of_account: -> (topic) { topic.account },
                    to: :manage_account_of,
                    topic: -> { create(:entry) }

    it_behaves_like 'a membership-based permission that',
                    allows: :manager,
                    but_forbids: :publisher,
                    of_account: -> (topic) { topic.account },
                    to: :update_feature_configuration_on,
                    topic: -> { create(:entry) }

    it_behaves_like 'a membership-based permission that',
                    allows: :manager,
                    but_forbids: :publisher,
                    of_account: -> (topic) { topic.account },
                    to: :destroy,
                    topic: -> { create(:entry) }

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
        entry = create(:entry, account: account)

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
        entry = create(:entry, account: account)

        expect(EntryPolicy::Scope.new(user, Entry).resolve).not_to include(entry)
      end

      it 'does not include entries with membership with wrong user and correct account' do
        user = create(:user)
        other_user = create(:user)
        account = create(:account, with_previewer: other_user)
        entry = create(:entry, account: account)

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
        entry = create(:entry, account: account)

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
        entry = create(:entry, account: account)

        expect(EntryPolicy::Scope.new(user, Entry).editor_or_above).not_to include(entry)
      end

      it 'does not include entries with membership with wrong user and correct account' do
        user = create(:user)
        other_user = create(:user)
        account = create(:account, with_editor: other_user)
        entry = create(:entry, account: account)

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
        entry = create(:entry, account: account)

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
        entry = create(:entry, account: account)

        expect(EntryPolicy::Scope.new(user, Entry).publisher_or_above).not_to include(entry)
      end

      it 'does not include entries with membership with wrong user and correct account' do
        user = create(:user)
        other_user = create(:user)
        account = create(:account, with_publisher: other_user)
        entry = create(:entry, account: account)

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
        entry = create(:entry, account: account)

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
        entry = create(:entry, account: account)

        expect(EntryPolicy::Scope.new(user, Entry).member_addable).not_to include(entry)
      end

      it 'does not include entries with membership with wrong user and correct account' do
        user = create(:user)
        other_user = create(:user)
        account = create(:account, with_publisher: other_user)
        entry = create(:entry, account: account)

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
        entry = create(:entry, account: account)

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
        entry = create(:entry, account: account)

        expect(EntryPolicy::Scope.new(user, Entry).manager_or_above).not_to include(entry)
      end

      it 'does not include entries with membership with wrong user and correct account' do
        user = create(:user)
        other_user = create(:user)
        account = create(:account, with_manager: other_user)
        entry = create(:entry, account: account)

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
