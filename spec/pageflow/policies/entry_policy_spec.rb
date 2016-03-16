require 'spec_helper'

module Pageflow
  module Policies
    describe EntryPolicy do
      describe :configure do
        include_examples 'for entry and account',
                         permission_type: :configure,
                         minimum_required_role: 'manager',
                         maximum_forbidden_role: 'publisher'
      end

      describe :publish do
        include_examples 'for entry and account',
                         permission_type: :publish,
                         minimum_required_role: 'publisher',
                         maximum_forbidden_role: 'editor'
      end

      describe :edit do
        include_examples 'for entry and account',
                         permission_type: :edit,
                         minimum_required_role: 'editor',
                         maximum_forbidden_role: 'previewer'
      end

      describe :preview do
        include_examples 'for entry and account',
                         permission_type: :preview,
                         minimum_required_role: 'previewer'
      end

      describe :read do
        include_examples 'for entry and account',
                         permission_type: :read,
                         minimum_required_role: 'previewer'
      end

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
