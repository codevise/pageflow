require 'spec_helper'

module Pageflow
  describe FoldersHelper do
    describe '#collection_for_folders' do
      it 'contains only folders of correct account' do
        user = create(:user)
        account = create(:account, with_publisher: user, name: 'This account here')
        create(:folder, account: account, name: 'This folder')
        create(:folder, name: 'not this folder')

        allow(helper).to receive(:current_user) { user }

        expect(helper.collection_for_folders).to have_content('This folder')
        expect(helper.collection_for_folders).not_to have_content('not this folder')
        expect(helper.collection_for_folders).to include('This account here')
      end
    end
  end
end
