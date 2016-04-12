require 'spec_helper'

module Pageflow
  describe Ability do
    context 'of editor' do
      it 'can manage file used in editor on entry they are member of' do
        user = create(:user)
        entry = create(:entry, :with_previewer => user)
        file = create(:audio_file)
        create(:file_usage, :revision => entry.draft, :file => file)
        ability = Ability.new(user)

        expect(ability.can?(:manage, file)).to eq(true)
      end

      it 'cannot manage file used in entry editor is not member of' do
        user = create(:user)
        entry = create(:entry)
        file = create(:audio_file)
        create(:file_usage, :revision => entry.draft, :file => file)
        ability = Ability.new(user)

        expect(ability.can?(:manage, file)).to eq(false)
      end
    end

    context 'of account manager' do
      it 'can create user' do
        user = build(:user, :account_manager)
        ability = Ability.new(user)

        expect(ability.can?(:create, User)).to be true
      end

      it 'can manage file used in any entry of own account' do
        user = create(:user, :account_manager)
        entry = create(:entry, :account => user.account)
        file = create(:audio_file)
        create(:file_usage, :revision => entry.draft, :file => file)
        ability = Ability.new(user)

        expect(ability.can?(:manage, file)).to eq(true)
      end

      it 'cannot manage file used in an entry of other account' do
        user = create(:user, :account_manager)
        entry = create(:entry)
        file = create(:audio_file)
        create(:file_usage, :revision => entry.draft, :file => file)
        ability = Ability.new(user)

        expect(ability.can?(:manage, file)).to eq(false)
      end
    end

    context 'of admin' do
      it 'can use_files of all entries' do
        user = create(:user, :admin)
        entry = create(:entry)
        ability = Ability.new(user)

        expect(Entry.accessible_by(ability, :use_files)).to include(entry)
      end

      it 'can manage file used in an entry of other account' do
        user = create(:user, :admin)
        entry = create(:entry)
        file = create(:audio_file)
        create(:file_usage, :revision => entry.draft, :file => file)
        ability = Ability.new(user)

        expect(ability.can?(:manage, file)).to eq(true)
      end
    end
  end
end
