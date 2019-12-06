require 'spec_helper'

module Pageflow
  describe Configuration do
    describe '#plugin' do
      it 'calls configure method on plugin' do
        configuration = Configuration.new
        plugin = Class.new(Pageflow::Plugin).new

        expect(plugin).to receive(:configure).with(configuration)

        configuration.plugin(plugin)
      end
    end

    describe 'deprecated #register_page_type method' do
      it 'registers a page type' do
        configuration = Configuration.new
        page_type = TestPageType.new(name: 'test')

        ActiveSupport::Deprecation.silence do
          configuration.register_page_type(page_type)
        end

        expect(configuration.page_types.first).to be(page_type)
      end
    end

    describe '#revision_components' do
      it 'returns all RevisionComponents of registered PageTypes' do
        conf = Configuration.new
        conf.page_types.register(TestPageType.new(name: 'test',
                                                  revision_components: [:component1]))
        conf.page_types.register(TestPageType.new(name: 'test',
                                                  revision_components: [:component2]))

        expect(conf.revision_components).to eq([:component1, :component2])
      end

      it 'does not return duplicate RevisionComponents' do
        conf = Configuration.new
        conf.page_types.register(TestPageType.new(name: 'test',
                                                  revision_components: [:component1]))
        conf.page_types.register(TestPageType.new(name: 'test',
                                                  revision_components: [:component1, :component2]))

        expect(conf.revision_components).to eq([:component1, :component2])
      end
    end

    describe '#file_types' do
      it 'returns all registered FileTypes' do
        file_type1 = FileType.new(model: ImageFile, collection_name: 'image_files', editor_partial: 'path')
        file_type2 = FileType.new(model: VideoFile, collection_name: 'video_files', editor_partial: 'path')
        conf = Configuration.new
        conf.file_types.register(file_type1)
        conf.file_types.register(file_type2)

        expect(conf.file_types.to_a).to eq([file_type1, file_type2])
      end
    end

    describe '#available_locales' do
      it 'defaults to [:en, :de]' do
        configuration = Configuration.new

        expect(configuration.available_locales).to eq([:en, :de])
      end

      it 'can be overwritten' do
        configuration = Configuration.new

        configuration.available_locales = [:fr]

        expect(configuration.available_locales).to eq([:fr])
      end
    end

    describe '#available_public_locales' do
      it 'defaults to Pageflow::PublicI18n.available_locales' do
        configuration = Configuration.new

        expect(configuration.available_public_locales).to eq(PublicI18n.available_locales)
      end

      it 'can be overwritten' do
        configuration = Configuration.new

        configuration.available_public_locales = [:fr]

        expect(configuration.available_public_locales).to eq([:fr])
      end
    end
  end
end
