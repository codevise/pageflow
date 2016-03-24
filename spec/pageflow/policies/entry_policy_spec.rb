require 'spec_helper'

module Pageflow
  module Policies
    describe EntryPolicy do
      include_examples 'a membership-based permission referring to entry and account that',
                       allows: 'manager',
                       but_forbids: 'publisher',
                       to: :configure,
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
                       allows: 'previewer',
                       to: :preview,
                       topic: -> { create(:entry) }

      include_examples 'a membership-based permission referring to entry and account that',
                       allows: 'previewer',
                       to: :read,
                       topic: -> { create(:entry) }

      describe '.resolve' do
        it 'includes entries with correct user and correct id' do
          user = create(:user)
          entry = create(:entry)
          create(:membership, user: user, entity: entry)

          expect(Policies::EntryPolicy::Scope.new(user, Entry).resolve).to include(entry)
        end

        it 'includes entries with correct user and correct account' do
          user = create(:user)
          account = create(:account)
          entry = create(:entry, account: account)
          create(:membership, user: user, entity: account)

          expect(Policies::EntryPolicy::Scope.new(user, Entry).resolve).to include(entry)
        end

        it 'does not include entries with wrong id' do
          user = create(:user)
          entry = create(:entry)
          other_entry = create(:entry)
          create(:membership, user: user, entity: entry)

          expect(Policies::EntryPolicy::Scope.new(user, Entry).resolve).not_to include(other_entry)
        end

        it 'does not include entries with wrong user and correct id' do
          user = create(:user)
          other_user = create(:user)
          entry = create(:entry)
          create(:membership, user: other_user, entity: entry)

          expect(Policies::EntryPolicy::Scope.new(user, Entry).resolve).not_to include(entry)
        end

        it 'does not include entries with wrong account' do
          user = create(:user)
          account = create(:account)
          other_account = create(:account)
          entry = create(:entry, account: account)
          create(:membership, user: user, entity: other_account)

          expect(Policies::EntryPolicy::Scope.new(user, Entry).resolve).not_to include(entry)
        end

        it 'does not include entries with wrong user and correct account' do
          user = create(:user)
          other_user = create(:user)
          account = create(:account)
          entry = create(:entry, account: account)
          create(:membership, user: other_user, entity: account)

          expect(Policies::EntryPolicy::Scope.new(user, Entry).resolve).not_to include(entry)
        end

        it 'does not include entries with nil id' do
          user = create(:user)
          entry = Entry.new
          create(:membership, user: user, entity: entry)

          expect(Policies::EntryPolicy::Scope.new(user, Entry).resolve).not_to include(entry)
        end

        it 'does not include entries with nil account id' do
          user = create(:user)
          theming = create(:theming)
          account = Account.new
          entry = create(:entry, account: account, theming: theming)
          create(:membership, user: user, entity: account)

          expect(Policies::EntryPolicy::Scope.new(user, Entry).resolve).not_to include(entry)
        end
      end
    end
  end
end
