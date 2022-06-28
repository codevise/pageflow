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
      it 'returns all revision components' do
        conf = Configuration.new
        conf.revision_components.register(:component)

        expect(conf.revision_components.to_a).to eq([:component])
      end

      it 'does not contain duplicate RevisionComponents' do
        conf = Configuration.new
        conf.revision_components.register(:component1)
        conf.revision_components.register(:component1)
        conf.revision_components.register(:component2)

        expect(conf.revision_components.to_a).to eq([:component1, :component2])
      end
    end

    describe '#page_types' do
      it 'delegates to pages entry type config' do
        page_type = TestPageType.new(name: 'test')

        conf = Configuration.new
        conf.page_types.register(page_type)
        result = conf.for_entry_type(PageflowPaged.entry_type, &:page_types)

        expect(result).to include(page_type)
      end
    end

    describe '#file_types' do
      it 'returns all registered FileTypes' do
        file_type1 = FileType.new(model: 'Pageflow::ImageFile',
                                  collection_name: 'image_files',
                                  editor_partial: 'path')
        file_type2 = FileType.new(model: 'Pageflow::VideoFile',
                                  collection_name: 'video_files',
                                  editor_partial: 'path')
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

    describe 'confirm_encoding_jobs?' do
      it 'returns true if confirm_encoding_jobs is set to true' do
        configuration = Configuration.new
        file = build(:video_file)

        configuration.confirm_encoding_jobs = true

        expect(configuration.confirm_encoding_jobs?(file)).to eq(true)
      end

      it 'returns false if confirm_encoding_jobs is set to false' do
        configuration = Configuration.new
        file = build(:video_file)

        configuration.confirm_encoding_jobs = false

        expect(configuration.confirm_encoding_jobs?(file)).to eq(false)
      end

      it 'passes file if confirm_encoding_jobs is callable' do
        configuration = Configuration.new
        file = build(:video_file)
        callable = double(call: true)

        configuration.confirm_encoding_jobs = callable
        configuration.confirm_encoding_jobs?(file)

        expect(callable).to have_received(:call).with(file)
      end

      it 'returns true if callable returns true' do
        configuration = Configuration.new
        file = build(:video_file)

        configuration.confirm_encoding_jobs = double(call: true)
        result = configuration.confirm_encoding_jobs?(file)

        expect(result).to eq(true)
      end

      it 'returns false if callable returns false' do
        configuration = Configuration.new
        file = build(:video_file)

        configuration.confirm_encoding_jobs = double(call: false)
        result = configuration.confirm_encoding_jobs?(file)

        expect(result).to eq(false)
      end
    end
  end
end
