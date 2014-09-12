require 'spec_helper'

module Pageflow
  describe FileType do
    describe '#collection_name' do
      it 'defaults to plural model name' do
        file_type = FileType.new(model: ImageFile,
                                 editor_partial: 'pageflow/editor/image_files/image_file')

        expect(file_type.collection_name).to eq('pageflow_image_files')
      end

      it 'can be overriden' do
        file_type = FileType.new(model: ImageFile,
                                 collection_name: 'image_files',
                                 editor_partial: 'pageflow/editor/image_files/image_file')

        expect(file_type.collection_name).to eq('image_files')
      end
    end

    describe '#param_key' do
      it 'returns symbolized base class name' do
        file_type = FileType.new(model: ImageFile,
                                 editor_partial: 'pageflow/editor/image_files/image_file')

        expect(file_type.param_key).to eq(:image_file)
      end
    end

    describe '#short_name' do
      it 'returns symbolized base class name' do
        file_type = FileType.new(model: ImageFile,
                                 editor_partial: 'pageflow/editor/image_files/image_file')

        expect(file_type.param_key).to eq(:image_file)
      end
    end

    describe '#type_name' do
      it 'returns fully qualified name of ruby model' do
        file_type = FileType.new(model: ImageFile,
                                 editor_partial: 'pageflow/editor/image_files/image_file')

        expect(file_type.type_name).to eq('Pageflow::ImageFile')
      end
    end
  end
end
