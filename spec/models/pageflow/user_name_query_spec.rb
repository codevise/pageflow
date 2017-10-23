require 'spec_helper'

module Pageflow
  describe UserNameQuery::Scope do
    it 'includes user with first_name containing all words in term' do
      user = create(:user, first_name: 'James Edward')

      result = UserNameQuery::Scope.new('Jam Edw', User).resolve

      expect(result).to include(user)
    end

    it 'includes user with last_name containing all words in term' do
      user = create(:user, last_name: 'van Placeholder')

      result = UserNameQuery::Scope.new('van Place', User).resolve

      expect(result).to include(user)
    end

    it 'includes user with fist and last name containing all words in term' do
      user = create(:user, first_name: 'James Edward', last_name: 'van Placeholder')

      result = UserNameQuery::Scope.new('James Place', User).resolve

      expect(result).to include(user)
    end

    it 'does not includes user with first and last name not containing all words in term' do
      user = create(:user, first_name: 'James Edward', last_name: 'van Placeholder')

      result = UserNameQuery::Scope.new('James Dean', User).resolve

      expect(result).not_to include(user)
    end

    it 'is case insensitive' do
      user = create(:user, first_name: 'John', last_name: 'Doe')

      result = UserNameQuery::Scope.new('john', User).resolve

      expect(result).to include(user)
    end
  end
end
