require 'spec_helper'

module Pageflow
  describe FileType do
    describe '#model' do
      it 'is set if model name is passed' do
        file_type = FileType.new(model: 'Pageflow::ImageFile')

        expect(file_type.model).to eq(ImageFile)
      end

      it 'is set if model reference is passed (deprecated)' do
        file_type = FileType.new(model: ImageFile)

        expect(file_type.model).to eq(ImageFile)
      end
    end

    describe '#collection_name' do
      it 'defaults to plural model name' do
        file_type = FileType.new(model: 'Pageflow::ImageFile')

        expect(file_type.collection_name).to eq('pageflow_image_files')
      end

      it 'can be overridden' do
        file_type = FileType.new(model: 'Pageflow::ImageFile',
                                 collection_name: 'image_files')

        expect(file_type.collection_name).to eq('image_files')
      end
    end

    describe '#param_key' do
      it 'returns symbolized base class name' do
        file_type = FileType.new(model: 'Pageflow::ImageFile')

        expect(file_type.param_key).to eq(:image_file)
      end
    end

    describe '#short_name' do
      it 'returns symbolized base class name' do
        file_type = FileType.new(model: 'Pageflow::ImageFile')

        expect(file_type.param_key).to eq(:image_file)
      end
    end

    describe '#type_name' do
      it 'returns fully qualified name of ruby model' do
        file_type = FileType.new(model: 'Pageflow::ImageFile')

        expect(file_type.type_name).to eq('Pageflow::ImageFile')
      end
    end

    describe '#i18n_key' do
      it 'returns fully qualified underscored name of ruby model' do
        file_type = FileType.new(model: 'Pageflow::ImageFile')

        expect(file_type.i18n_key).to eq(:'pageflow/image_file')
      end
    end

    describe '#editor_partial' do
      it 'returns passed editor_partial' do
        file_type = FileType.new(model: 'Pageflow::ImageFile',
                                 editor_partial: 'pageflow/editor/image_files/image_file')

        expect(file_type.editor_partial).to eq('pageflow/editor/image_files/image_file')
      end
    end

    describe '#custom_attributes' do
      it 'converts passed custom_attributes symbol array to hash' do
        file_type = FileType.new(model: 'Pageflow::ImageFile',
                                 custom_attributes: [:neural_network_analysis])

        expect(file_type.custom_attributes)
          .to eq(neural_network_analysis: {permitted_create_param: true})
      end
    end
  end
end
