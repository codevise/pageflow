require 'spec_helper'

module Pageflow
  describe BuiltInPageType do
    describe '#file_types' do
      it 'returns file types for given file type models' do
        page_type = BuiltInPageType.new('background_image', file_types: [BuiltInFileType.image])

        file_type = page_type.file_types.first

        expect(file_type.model).to be(ImageFile)
        expect(file_type.collection_name).to eq('image_files')
        expect(file_type.editor_partial).to eq('pageflow/editor/image_files/image_file')
      end
    end

    describe '#thumbnail_candidates' do
      it 'returns default candidates' do
        page_type = BuiltInPageType.new('background_image')

        expect(page_type.thumbnail_candidates).to be_present
      end

      it 'allows overriding via option' do
        thumbnail_candidates = [
          {file_collection: 'image_files', attribute: 'poster_image_id'},
          {file_collection: 'video_files', attribute: 'video_file_id'}
        ]
        page_type = BuiltInPageType.new('video',
                                        thumbnail_candidates: thumbnail_candidates)

        expect(page_type.thumbnail_candidates).to eq(thumbnail_candidates)
      end
    end
  end
end
