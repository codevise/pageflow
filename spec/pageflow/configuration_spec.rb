require 'spec_helper'

module Pageflow
  describe Configuration do

    describe '#revision_components' do
      let(:page_type_class) do
        Class.new(PageType) do
          name 'test'

          def initialize(*revision_components)
            @revision_components = revision_components
          end

          attr_reader :revision_components
        end
      end

      it 'returns all RevisionComponents of registered PageTypes' do
        conf = Configuration.new
        conf.register_page_type(page_type_class.new(:component1))
        conf.register_page_type(page_type_class.new(:component2))

        expect(conf.revision_components).to eq([:component1, :component2])
      end

      it 'does not return duplicate RevisionComponents' do
        conf = Configuration.new
        conf.register_page_type(page_type_class.new(:component1))
        conf.register_page_type(page_type_class.new(:component1, :component2))

        expect(conf.revision_components).to eq([:component1, :component2])
      end
    end

    describe '#file_types' do
      let(:page_type_class) do
        Class.new(PageType) do
          name 'test'

          def initialize(*file_types)
            @file_types = file_types
          end

          attr_reader :file_types
        end
      end

      it 'returns all FileTypes of registered PageTypes' do
        file_type1 = FileType.new(model: ImageFile, collection_name: 'image_files', editor_partial: 'path')
        file_type2 = FileType.new(model: VideoFile, collection_name: 'video_files', editor_partial: 'path')
        conf = Configuration.new
        conf.register_page_type(page_type_class.new(file_type1))
        conf.register_page_type(page_type_class.new(file_type2))

        expect(conf.file_types.to_a).to eq([file_type1, file_type2])
      end
    end

    describe '#available_locales' do
      it 'defaults to I18n.available_locales' do
        configuration = Configuration.new

        expect(configuration.available_locales).to eq(Engine.config.i18n.available_locales)
      end

      it 'can be overwritten' do
        configuration = Configuration.new

        configuration.available_locales = [:fr]

        expect(configuration.available_locales).to eq([:fr])
      end
    end
  end
end
