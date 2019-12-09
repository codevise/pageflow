require 'spec_helper'

module Pageflow
  describe FileTypes do
    describe 'as Enumerable' do
      it 'returns all registered FileTypes and nested FileTypes' do
        config = Configuration.new
        nested_file_type = FileType.new(model: 'Pageflow::TextTrackFile',
                                        collection_name: 'text_track_files',
                                        editor_partial: 'path')
        file_type1 = FileType.new(model: 'Pageflow::ImageFile',
                                  collection_name: 'image_files',
                                  editor_partial: 'path')
        file_type2 = FileType.new(model: 'Pageflow::VideoFile',
                                  collection_name: 'video_files',
                                  editor_partial: 'path',
                                  nested_file_types: [nested_file_type])

        config.file_types.register(file_type1)
        config.file_types.register(file_type2)

        expect(config.file_types.to_a).to eq([file_type1, file_type2, nested_file_type])
      end

      it 'allows lambda registration' do
        config = Configuration.new
        nested_file_type = FileType.new(model: 'Pageflow::TextTrackFile',
                                        collection_name: 'text_track_files',
                                        editor_partial: 'path')
        file_type1 = FileType.new(model: 'Pageflow::ImageFile',
                                  collection_name: 'image_files',
                                  editor_partial: 'path')
        file_type2 = FileType.new(model: 'Pageflow::VideoFile',
                                  collection_name: 'video_files',
                                  editor_partial: 'path',
                                  nested_file_types: [nested_file_type])

        config.file_types.register(-> { file_type1 })
        config.file_types.register(-> { [file_type2] })

        expect(config.file_types.to_a).to eq([file_type1, file_type2, nested_file_type])
      end

      it 'makes FileTypes unique by model' do
        config = Configuration.new
        file_type1 = FileType.new(model: 'Pageflow::ImageFile',
                                  collection_name: 'image_files',
                                  editor_partial: 'path')
        file_type2 = FileType.new(model: 'Pageflow::VideoFile',
                                  collection_name: 'video_files',
                                  editor_partial: 'path',
                                  nested_file_types: [file_type1])

        config.file_types.register(file_type1)
        config.file_types.register(file_type2)

        expect(config.file_types.to_a).to eq([file_type1, file_type2])
      end
    end

    describe '#find_by_collection_name!' do
      it 'finds FileType by collection_name' do
        config = Configuration.new
        file_type = FileType.new(model: 'Pageflow::ImageFile',
                                 collection_name: 'image_files',
                                 editor_partial: 'path')
        config.file_types.register(file_type)
        file_types = config.file_types

        result = file_types.find_by_collection_name!('image_files')

        expect(result).to be(file_type)
      end

      it 'raises exception if FileType is not found' do
        file_types = FileTypes.new

        expect {
          file_types.find_by_collection_name!('image_files')
        }.to raise_error(FileType::NotFoundError)
      end
    end

    describe '#find_by_model!' do
      it 'finds FileType by model' do
        config = Configuration.new
        file_type = FileType.new(model: 'Pageflow::ImageFile',
                                 collection_name: 'image_files',
                                 editor_partial: 'path')
        config.file_types.register(file_type)
        file_types = config.file_types

        result = file_types.find_by_model!(ImageFile)

        expect(result).to be(file_type)
      end

      it 'raises exception if FileType is not found' do
        file_types = FileTypes.new

        expect {
          file_types.find_by_model!(ImageFile)
        }.to raise_error(FileType::NotFoundError)
      end
    end

    describe '#with_thumbnail_support' do
      it 'includes file types whose models have thumbnail_url instance method' do
        config = Configuration.new
        file_type = FileType.new(model: 'Pageflow::ImageFile')
        config.file_types.register(file_type)
        file_types = config.file_types

        result = file_types.with_thumbnail_support

        expect(result).to include(file_type)
      end

      it 'does not include file types whose models do not have thumbnail_url instance method' do
        config = Configuration.new
        file_type = FileType.new(model: 'Pageflow::AudioFile')
        config.file_types.register(file_type)
        file_types = config.file_types

        result = file_types.with_thumbnail_support

        expect(result).not_to include(file_type)
      end
    end

    describe '#with_css_background_image_support' do
      it 'includes file types with css_background_image_urls attribute set' do
        config = Configuration.new
        file_type = FileType.new(model: 'Pageflow::ImageFile',
                                 css_background_image_urls: -> {})
        config.file_types.register(file_type)
        file_types = config.file_types

        result = file_types.with_css_background_image_support

        expect(result).to include(file_type)
      end

      it 'does not include file types without css_background_image_urls attribute set' do
        config = Configuration.new
        file_type = FileType.new(model: 'Pageflow::ImageFile')
        config.file_types.register(file_type)
        file_types = config.file_types

        result = file_types.with_css_background_image_support

        expect(result).not_to include(file_type)
      end
    end
  end
end
