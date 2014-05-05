require 'spec_helper'

module Pageflow
  describe Ability do
    context 'of editor' do
      it 'can read folders containing entries editor is member of' do
        user = create(:user, :editor)
        folder = create(:folder, :account => user.account)
        entry = create(:entry, :with_member => user, :account => user.account, :folder => folder)
        ability = Ability.new(user)

        expect(Folder.accessible_by(ability, :read)).to include(folder)
      end

      it 'cannot read folders without entry editor is member of' do
        user = create(:user, :editor)
        folder = create(:folder, :account => user.account)
        ability = Ability.new(user)

        expect(Folder.accessible_by(ability, :read)).not_to include(folder)
      end

      it 'can use_files of entries it is member of' do
        user = create(:user, :editor)
        entry = create(:entry, :with_member => user, :account => user.account)
        ability = Ability.new(user)

        expect(Entry.accessible_by(ability, :use_files)).to include(entry)
      end

      it 'cannot use_files of entries it is not member of' do
        user = create(:user, :editor)
        entry = create(:entry, :account => user.account)
        ability = Ability.new(user)

        expect(Entry.accessible_by(ability, :use_files)).not_to include(entry)
      end

      it 'can manage file used in entry editor is member of' do
        user = create(:user, :editor)
        entry = create(:entry, :with_member => user, :account => user.account)
        file = create(:audio_file)
        create(:file_usage, :revision => entry.draft, :file => file)
        ability = Ability.new(user)

        expect(ability.can?(:manage, file)).to eq(true)
      end

      it 'cannot manage file used in entry editor is not member of' do
        user = create(:user, :editor)
        entry = create(:entry, :account => user.account)
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

        expect(ability.can?(:create, User)).to be_true
      end

      it 'can read folders of own account' do
        user = create(:user, :account_manager)
        folder = create(:folder, :account => user.account)
        ability = Ability.new(user)

        expect(Folder.accessible_by(ability, :read)).to include(folder)
      end

      it 'cannot read folders of other account' do
        user = create(:user, :account_manager)
        folder = create(:folder)
        ability = Ability.new(user)

        expect(Folder.accessible_by(ability, :read)).not_to include(folder)
      end

      it 'can use_files of entries of own account' do
        user = create(:user, :account_manager)
        entry = create(:entry, :account => user.account)
        ability = Ability.new(user)

        expect(Entry.accessible_by(ability, :use_files)).to include(entry)
      end

      it 'cannot use_files of other account' do
        user = create(:user, :account_manager)
        entry = create(:entry)
        ability = Ability.new(user)

        expect(Entry.accessible_by(ability, :use_files)).not_to include(entry)
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
      it 'can read folders of all accounts' do
        user = create(:user, :admin)
        folder = create(:folder)
        ability = Ability.new(user)

        expect(Folder.accessible_by(ability, :read)).to include(folder)
      end

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
