require 'spec_helper'

module Pageflow
  describe PageTypes do
    describe '#register' do
      let(:page_type_class_without_export_version) do
        Class.new(PageType) do
          def initialize(options)
            @name = options.fetch(:name)
          end

          attr_reader :name
        end
      end

      it 'ensures page type defines export_version' do
        page_types = PageTypes.new
        page_type = page_type_class_without_export_version.new(name: 'rainbow')

        expect {
          page_types.register(page_type)
        }.to raise_error(/rainbow needs to define export_version/)
      end
    end

    describe '#find_by_name!' do
      it 'returns page type with given name' do
        page_types = PageTypes.new
        page_type = TestPageType.new(name: 'test')

        page_types.register(page_type)
        result = page_types.find_by_name!('test')

        expect(result).to be(page_type)
      end

      it 'raises helpful error if page type is not found' do
        page_types = PageTypes.new

        expect {
          page_types.find_by_name!('not_there')
        }.to raise_error(/Unknown page type/)
      end
    end

    describe '#names' do
      it 'returns names of registed page types' do
        page_types = PageTypes.new
        page_type = TestPageType.new(name: 'test')

        page_types.register(page_type)
        result = page_types.names

        expect(result).to eq(['test'])
      end
    end

    describe '#each' do
      it 'makes object enumarable' do
        page_types = PageTypes.new
        page_type = TestPageType.new(name: 'test')

        page_types.register(page_type)
        result = page_types.first

        expect(result).to be(page_type)
      end
    end

    describe '#setup' do
      it 'registers help entries' do
        config = Configuration.new
        page_types = config.page_types
        page_types.register(TestPageType.new(name: 'test'))

        page_types.setup(config)

        expect(config.help_entries.count).to eq(1)
        expect(config.help_entries.flat.count).to eq(2)
      end

      it 'registers revision components' do
        config = Configuration.new
        page_types = config.page_types
        page_types.register(TestPageType.new(name: 'test', revision_components: [:the_comp]))

        page_types.setup(config)

        expect(config.revision_components.to_a).to eq([:the_comp])
      end

      it 'registers file types' do
        config = Configuration.new
        page_types = config.page_types
        file_type = FileType.new(model: 'Pageflow::TestUploadableFile')
        page_types.register(TestPageType.new(name: 'test', file_types: [file_type]))

        page_types.setup(config)

        expect(config.file_types.count).to eq(1)
      end
    end
  end
end
