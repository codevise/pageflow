require 'spec_helper'

module Pageflow
  describe EntryTitleOrAccountNameQuery::Scope do
    it 'includes entry with title containing all words in term' do
      entry = create(:entry, title: 'International news overview')

      result = EntryTitleOrAccountNameQuery::Scope.new('Intern overview', Entry).resolve

      expect(result).to include(entry)
    end

    it 'does not includes entry with title not containing all words in term' do
      entry = create(:entry, title: 'International news overview')

      result = EntryTitleOrAccountNameQuery::Scope.new('Other overview', Entry).resolve

      expect(result).not_to include(entry)
    end

    it 'includes entry with account name containing all words in term' do
      account = create(:account, name: 'Business Today Journal')
      entry = create(:entry, account:, title: 'International news overview')

      result = EntryTitleOrAccountNameQuery::Scope.new('Business Journal', Entry).resolve

      expect(result).to include(entry)
    end

    it 'includes entry with account name and title containing all words in term' do
      account = create(:account, name: 'Business Today Journal')
      entry = create(:entry, account:, title: 'International news overview')

      result = EntryTitleOrAccountNameQuery::Scope.new('Business overview', Entry).resolve

      expect(result).to include(entry)
    end

    it 'is case insensitive' do
      entry = create(:entry, title: 'International news overview')

      result = EntryTitleOrAccountNameQuery::Scope.new('intern NEWS', Entry).resolve

      expect(result).to include(entry)
    end
  end
end
