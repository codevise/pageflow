require 'spec_helper'

module Pageflow
  describe FoldersHelper do
    describe '#collection_for_folders' do
      it 'contains only folders of entry`s account' do
        folder = create(:folder)
        create(:folder)

        expect(helper.collection_for_folders(folder.account)).to eq([folder])
      end
    end
  end
end
