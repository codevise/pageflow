require 'spec_helper'

module Pageflow
  module Policies
    describe EntryPolicy do
      include_examples 'a membership-based permission referring to entry and account that',
                       allows: 'manager',
                       but_forbids: 'publisher',
                       to: :manage,
                       topic: -> { create(:entry) }

      include_examples 'a membership-based permission referring to entry and account that',
                       allows: 'manager',
                       but_forbids: 'publisher',
                       to: :add_member_to,
                       topic: -> { create(:entry) }

      include_examples 'a membership-based permission referring to entry and account that',
                       allows: 'publisher',
                       but_forbids: 'editor',
                       to: :publish,
                       topic: -> { create(:entry) }

      include_examples 'a membership-based permission referring to entry and account that',
                       allows: 'publisher',
                       but_forbids: 'editor',
                       to: :create,
                       topic: -> { create(:entry) }

      include_examples 'a membership-based permission referring to entry and account that',
                       allows: 'publisher',
                       but_forbids: 'editor',
                       to: :duplicate,
                       topic: -> { create(:entry) }

      include_examples 'a membership-based permission referring to entry and account that',
                       allows: 'editor',
                       but_forbids: 'previewer',
                       to: :edit,
                       topic: -> { create(:entry) }

      include_examples 'a membership-based permission referring to entry and account that',
                       allows: 'editor',
                       but_forbids: 'previewer',
                       to: :index_widgets_for,
                       topic: -> { create(:entry) }

      include_examples 'a membership-based permission referring to entry and account that',
                       allows: 'editor',
                       but_forbids: 'previewer',
                       to: :edit_outline,
                       topic: -> { create(:entry) }

      include_examples 'a membership-based permission referring to entry and account that',
                       allows: 'editor',
                       but_forbids: 'previewer',
                       to: :restore,
                       topic: -> { create(:entry) }

      include_examples 'a membership-based permission referring to entry and account that',
                       allows: 'editor',
                       but_forbids: 'previewer',
                       to: :snapshot,
                       topic: -> { create(:entry) }

      include_examples 'a membership-based permission referring to entry and account that',
                       allows: 'editor',
                       but_forbids: 'previewer',
                       to: :confirm_encoding,
                       topic: -> { create(:entry) }

      include_examples 'a membership-based permission referring to entry and account that',
                       allows: 'previewer',
                       to: :preview,
                       topic: -> { create(:entry) }

      include_examples 'a membership-based permission referring to entry and account that',
                       allows: 'previewer',
                       to: :read,
                       topic: -> { create(:entry) }

      include_examples 'a membership-based permission referring to entry and account that',
                       allows: 'previewer',
                       to: :use_files,
                       topic: -> { create(:entry) }

      include_examples 'a membership-based permission that',
                       allows: 'publisher',
                       but_forbids: 'editor',
                       of_account: -> (topic) { topic.account },
                       to: :publish_on_account_of,
                       topic: -> { create(:entry) }

      include_examples 'a membership-based permission that',
                       allows: 'publisher',
                       but_forbids: 'editor',
                       of_account: -> (topic) { topic.account },
                       to: :update_account_on,
                       topic: -> { create(:entry) }

      include_examples 'a membership-based permission that',
                       allows: 'publisher',
                       but_forbids: 'editor',
                       of_account: -> (topic) { topic.account },
                       to: :update_theming_on,
                       topic: -> { create(:entry) }

      include_examples 'a membership-based permission that',
                       allows: 'manager',
                       but_forbids: 'publisher',
                       of_account: -> (topic) { topic.account },
                       to: :manage_account_of,
                       topic: -> { create(:entry) }

      include_examples 'a membership-based permission that',
                       allows: 'manager',
                       but_forbids: 'publisher',
                       of_account: -> (topic) { topic.account },
                       to: :update_feature_configuration_on,
                       topic: -> { create(:entry) }

      include_examples 'a membership-based permission that',
                       allows: 'manager',
                       but_forbids: 'publisher',
                       of_account: -> (topic) { topic.account },
                       to: :destroy,
                       topic: -> { create(:entry) }

      describe '.resolve' do
        it 'includes all entries for admins' do
          user = create(:user, :admin)

          expect(Policies::EntryPolicy::Scope.new(user,
                                                  Entry).resolve).to include(create(:entry))
        end

        it 'includes entries with membership with correct user and correct id' do
          user = create(:user)
          entry = create(:entry, with_previewer: user)

          expect(Policies::EntryPolicy::Scope.new(user, Entry).resolve).to include(entry)
        end

        it 'includes entries with membership with correct user and correct account' do
          user = create(:user)
          account = create(:account, with_previewer: user)
          entry = create(:entry, account: account)

          expect(Policies::EntryPolicy::Scope.new(user, Entry).resolve).to include(entry)
        end

        it 'does not include entries with wrong id' do
          user = create(:user)
          create(:entry, with_previewer: user)
          other_entry = create(:entry)

          expect(Policies::EntryPolicy::Scope.new(user, Entry).resolve).not_to include(other_entry)
        end

        it 'does not include entries with membership with wrong user and correct id' do
          user = create(:user)
          other_user = create(:user)
          entry = create(:entry, with_previewer: other_user)

          expect(Policies::EntryPolicy::Scope.new(user, Entry).resolve).not_to include(entry)
        end

        it 'does not include entries with membership with wrong account' do
          user = create(:user)
          account = create(:account)
          create(:account, with_previewer: user)
          entry = create(:entry, account: account)

          expect(Policies::EntryPolicy::Scope.new(user, Entry).resolve).not_to include(entry)
        end

        it 'does not include entries with membership with wrong user and correct account' do
          user = create(:user)
          other_user = create(:user)
          account = create(:account, with_previewer: other_user)
          entry = create(:entry, account: account)

          expect(Policies::EntryPolicy::Scope.new(user, Entry).resolve).not_to include(entry)
        end

        it 'does not include entries with membership with nil id' do
          user = create(:user)
          entry = Entry.new
          create(:membership, user: user, entity: entry)

          expect(Policies::EntryPolicy::Scope.new(user, Entry).resolve).not_to include(entry)
        end

        it 'does not include entries with membership with nil account id' do
          user = create(:user)
          theming = create(:theming)
          account = Account.new
          entry = create(:entry, account: account, theming: theming)
          create(:membership, user: user, entity: account)

          expect(Policies::EntryPolicy::Scope.new(user, Entry).resolve).not_to include(entry)
        end
      end

      describe '.editor_or_above' do
        it 'includes no entries for admin without memberships' do
          user = create(:user, :admin)

          expect(Policies::EntryPolicy::Scope.new(user,
                                                  Entry).resolve).to be_empty
        end

        it 'includes entries with membership with correct user and correct id' do
          user = create(:user)
          entry = create(:entry, with_editor: user)

          expect(Policies::EntryPolicy::Scope.new(user, Entry).resolve).to include(entry)
        end

        it 'includes entries with membership with correct user and correct account' do
          user = create(:user)
          account = create(:account, with_editor: user)
          entry = create(:entry, account: account)

          expect(Policies::EntryPolicy::Scope.new(user, Entry).resolve).to include(entry)
        end

        it 'does not include entries with wrong id' do
          user = create(:user)
          create(:entry, with_editor: user)
          other_entry = create(:entry)

          expect(Policies::EntryPolicy::Scope.new(user, Entry).resolve).not_to include(other_entry)
        end

        it 'does not include entries with membership with wrong user and correct id' do
          user = create(:user)
          other_user = create(:user)
          entry = create(:entry, with_editor: other_user)

          expect(Policies::EntryPolicy::Scope.new(user, Entry).resolve).not_to include(entry)
        end

        it 'does not include entries with membership with wrong account' do
          user = create(:user)
          account = create(:account)
          create(:account, with_editor: user)
          entry = create(:entry, account: account)

          expect(Policies::EntryPolicy::Scope.new(user, Entry).resolve).not_to include(entry)
        end

        it 'does not include entries with membership with wrong user and correct account' do
          user = create(:user)
          other_user = create(:user)
          account = create(:account, with_editor: other_user)
          entry = create(:entry, account: account)

          expect(Policies::EntryPolicy::Scope.new(user, Entry).resolve).not_to include(entry)
        end

        it 'does not include entries with membership with nil id' do
          user = create(:user)
          entry = Entry.new
          create(:membership, user: user, entity: entry, role: 'editor')

          expect(Policies::EntryPolicy::Scope.new(user, Entry).resolve).not_to include(entry)
        end

        it 'does not include entries with membership with nil account id' do
          user = create(:user)
          theming = create(:theming)
          account = Account.new
          entry = create(:entry, account: account, theming: theming)
          create(:membership, user: user, entity: account, role: 'editor')

          expect(Policies::EntryPolicy::Scope.new(user, Entry).resolve).not_to include(entry)
        end
      end
    end
  end
end
