require 'spec_helper'

module Pageflow
  module Admin
    describe MembershipsHelper do
      describe '#membership_users_collection_for_parent' do
        it 'returns pairs of formal name and id' do
          john = create(:user, first_name: 'John', last_name: 'Doe')
          account = create(:account, with_member: john)
          entry = create(:entry, account: account)

          pairs = membership_users_collection_for_parent(entry)

          expect(pairs).to eq([['Doe, John', john.id]])
        end

        it 'filters users that are already members of parent' do
          account = create(:account)
          user = create(:user, account: account, first_name: 'John', last_name: 'Doe')
          entry = create(:entry, account: account)
          entry.users << user

          pairs = membership_users_collection_for_parent(entry)

          expect(pairs).to eq([])
        end
      end

      describe '#membership_entries_collection_for_parent' do
        it 'returns pairs of title and id' do
          account = create(:account)
          entry = create(:entry, account: account, title: 'My Pageflow')

          pairs = membership_entries_collection_for_parent(entry)

          expect(pairs).to eq([['My Pageflow', entry.id]])
        end

        it 'filters entries that the user ise already member of' do
          account = create(:account)
          entry = create(:entry, account: account, title: 'My Pageflow')
          user = create(:user, account: account)
          entry.users << user

          pairs = membership_entries_collection_for_parent(user)

          expect(pairs).to eq([])
        end
      end
    end
  end
end
