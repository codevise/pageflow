require 'spec_helper'

module Pageflow
  describe BuiltInPageType do
    describe '#file_types' do
      it 'returns file types for given file type models' do
        page_type = BuiltInPageType.new('background_image', file_type_models: ['Pageflow::ImageFile'])

        file_type = page_type.file_types.first

        expect(file_type.model).to be(ImageFile)
        expect(file_type.collection_name).to eq('image_files')
        expect(file_type.editor_partial).to eq('pageflow/editor/image_files/image_file')
      end
    end
  end
end
