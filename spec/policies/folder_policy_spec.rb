require 'spec_helper'

module Pageflow
  describe FolderPolicy do
    it_behaves_like 'a membership-based permission that',
                    allows: :publisher,
                    but_forbids: :editor,
                    of_account: -> (topic) { topic.account },
                    to: :manage,
                    topic: -> { create(:folder) }
  end

  describe '.resolve' do
    it 'includes all folders for admins' do
      user = create(:user, :admin)

      expect(FolderPolicy::Scope.new(user, Folder).resolve).to include(create(:folder))
    end

    it 'includes folders containing an entry of the user' do
      folder = create(:folder)
      user = create(:user)
      create(:entry, with_previewer: user, folder: folder, account: folder.account)

      expect(FolderPolicy::Scope.new(user, Folder).resolve).to include(folder)
    end

    it 'includes folders on the accounts of which the user is publisher' do
      user = create(:user)
      account = create(:account, with_publisher: user)
      folder = create(:folder, account: account)

      expect(FolderPolicy::Scope.new(user, Folder).resolve).to include(folder)
    end

    it 'does not include folders without entry of the user where they are not ' \
       'account previewer' do
      user = create(:user)
      account = create(:account)
      folder = create(:folder, account: account)

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
