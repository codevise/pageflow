require 'spec_helper'

module Pageflow
  describe FolderPolicy do
    it_behaves_like 'a membership-based permission that',
                    allows: :publisher,
                    but_forbids: :editor,
                    of_account: ->(topic) { topic.account },
                    to: :manage,
                    topic: -> { create(:folder) }
  end

  describe '.show_account_selection_on' do
    it 'permits admins when there is more than one account' do
      create(:account)
      folder = create(:folder)
      admin = create(:user, :admin)

      expect(FolderPolicy.new(admin, folder)).to permit_action(:show_account_selection_on)
    end

    it 'does not permit admins when there is no more than one account' do
      Account.delete_all
      folder = create(:folder)
      admin = create(:user, :admin, on: folder.account)

      expect(FolderPolicy.new(admin, folder)).not_to permit_action(:show_account_selection_on)
    end

    it 'does not permit account managers of less than two accounts' do
      account_manager = create(:user)
      folder = create(:folder)
      create(:account, with_manager: account_manager)

      expect(FolderPolicy.new(account_manager, folder))
        .not_to permit_action(:show_account_selection_on)
    end

    it 'does permit account publishers of at least two accounts' do
      account_publisher = create(:user)
      folder = create(:folder)
      create(:account, with_publisher: account_publisher)
      create(:account, with_publisher: account_publisher)

      expect(FolderPolicy.new(account_publisher, folder))
        .to permit_action(:show_account_selection_on)
    end

    it 'does not permit account editors of at least two accounts who are also entry managers' do
      account_editor = create(:user)
      folder = create(:folder)
      create(:account, with_editor: account_editor)
      create(:account, with_editor: account_editor)
      create(:entry, with_manager: account_editor)

      expect(FolderPolicy.new(account_editor, folder))
        .not_to permit_action(:show_account_selection_on)
    end
  end

  describe '.resolve' do
    it 'includes all folders for admins' do
      user = create(:user, :admin)

      expect(FolderPolicy::Scope.new(user, Folder).resolve).to include(create(:folder))
    end

    it 'includes folders containing an entry of the user' do
      folder = create(:folder)
      user = create(:user)
      create(:entry, with_previewer: user, folder:, account: folder.account)

      expect(FolderPolicy::Scope.new(user, Folder).resolve).to include(folder)
    end

    it 'includes folders on the accounts of which the user is publisher' do
      user = create(:user)
      account = create(:account, with_publisher: user)
      folder = create(:folder, account:)

      expect(FolderPolicy::Scope.new(user, Folder).resolve).to include(folder)
    end

    it 'does not include folders without entry of the user where they are not ' \
       'account previewer' do
      user = create(:user)
      account = create(:account)
      folder = create(:folder, account:)

      expect(FolderPolicy::Scope.new(user, Folder).resolve).not_to include(folder)
    end

    it 'does not include folders without entry of the user where they are account publisher on ' \
       'another account' do
      user = create(:user)
      create(:account, with_publisher: user)
      folder = create(:folder)

      expect(FolderPolicy::Scope.new(user, Folder).resolve).not_to include(folder)
    end
  end
end
