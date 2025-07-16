require 'spec_helper'

module Pageflow
  describe FoldersHelper do
    describe '#collection_for_folders' do
      it 'contains only folders of correct account' do
        user = create(:user)
        account = create(:account, with_publisher: user, name: 'This account here')
        create(:folder, account:, name: 'This folder')
        create(:folder, name: 'not this folder')

        allow(helper).to receive(:current_user) { user }

        collection_for_folders_result = helper.collection_for_folders(account)

        expect(collection_for_folders_result).to have_content('This folder')
        expect(collection_for_folders_result).not_to have_content('not this folder')
        expect(collection_for_folders_result).to include('This account here')
      end
    end
  end
end
