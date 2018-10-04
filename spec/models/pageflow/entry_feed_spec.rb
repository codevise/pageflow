require 'spec_helper'

module Pageflow
  RSpec.describe EntryFeed, type: :model do
    let(:account) { create(:account) }

    it 'includes published entries' do
      entry = create(:entry, :published, account: account)

      scope = EntryFeed::Scope.new(account.entries)

      expect(scope.entries).to include(entry)
    end

    it 'does not include password-protected entries' do
      entry = create(:entry, :published_with_password, account: account)

      scope = EntryFeed::Scope.new(account.entries)

      expect(scope.entries).not_to include(entry)
    end

    it 'is ordered by publication time' do
      older = create(:entry, :published, account: account, published_revision_attributes: {
        published_at: 1.month.ago
      })
      recent = create(:entry, :published, account: account, published_revision_attributes: {
        published_at: 1.day.ago
      })

      scope = EntryFeed::Scope.new(account.entries)
      entries = scope.entries

      expect(entries.first).to eq(recent)
      expect(entries.second).to eq(older)
    end

    it 'is paginated with configurable per_page' do
      3.times { create(:entry, :published, account: account) }

      scope = EntryFeed::Scope.new(account.entries)
      scope.per_page = 2
      entries = scope.entries

      expect(entries.length).to eq(2)
    end
  end
end
