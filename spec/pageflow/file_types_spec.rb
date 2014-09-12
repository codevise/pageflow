require 'spec_helper'

module Pageflow
  describe FileTypes do
    let(:page_type_class) do
      Class.new(PageType) do
        name 'test'

        def initialize(options)
          @file_types = options.fetch(:file_types)
        end

        attr_reader :file_types
      end
    end

    describe 'as Enumarable' do
      it 'returns all FileTypes of given PageTypes' do
        file_type1 = FileType.new(model: ImageFile, collection_name: 'image_files', editor_partial: 'path')
        file_type2 = FileType.new(model: VideoFile, collection_name: 'video_files', editor_partial: 'path')
        file_types = FileTypes.new([
                                     page_type_class.new(file_types: [file_type1]),
                                     page_type_class.new(file_types: [file_type2])
                                   ])

        expect(file_types.to_a).to eq([file_type1, file_type2])
      end

      it 'makes FileTypes unique by model' do
        file_type1 = FileType.new(model: ImageFile, collection_name: 'image_files', editor_partial: 'path')
        file_type2 = FileType.new(model: VideoFile, collection_name: 'video_files', editor_partial: 'path')
        file_types = FileTypes.new([
                                     page_type_class.new(file_types: [file_type1]),
                                     page_type_class.new(file_types: [file_type1, file_type2])
                                   ])

        expect(file_types.to_a).to eq([file_type1, file_type2])
      end
    end

    describe '#find_by_collection_name!' do
      it 'finds FileType by collection_name' do
        file_type = FileType.new(model: ImageFile, collection_name: 'image_files', editor_partial: 'path')
        file_types = FileTypes.new([page_type_class.new(file_types: [file_type])])

        result = file_types.find_by_collection_name!('image_files')

        expect(result).to be(file_type)
      end

      it 'raises exception if FileType is not found' do
        file_types = FileTypes.new([])

        expect {
          file_types.find_by_collection_name!('image_files')
        }.to raise_error(FileType::NotFoundError)
      end
    end
  end
end
