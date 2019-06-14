require 'spec_helper'

module Pageflow
  describe FileBackgroundImagesHelper do
    describe '#file_background_images_css' do
      it 'generates css rules with given names' do
        pageflow_configure do |config|
          TestFileType.register(config,
                                model: TestHostedFile,
                                css_background_image_urls: lambda do |file|
                                  {poster: file.attachment.url}
                                end)
        end

        entry = PublishedEntry.new(create(:entry, :published))
        hosted_file = create(:used_file, model: :hosted_file, revision: entry.revision)

        result = helper.file_background_images_css(entry, :desktop)

        expect(result).to include(".pageflow_test_hosted_file_poster_#{hosted_file.perma_id}")
      end

      it 'generates css rules using given urls' do
        pageflow_configure do |config|
          TestFileType.register(config,
                                model: TestHostedFile,
                                css_background_image_urls: lambda do |_file|
                                  {poster: 'some/url'}
                                end)
        end

        entry = PublishedEntry.new(create(:entry, :published))
        create(:hosted_file, used_in: entry.revision)

        result = helper.file_background_images_css(entry, :desktop)

        expect(result).to include("background-image: url('some/url')")
      end

      it 'omits prefix if name equals "default"' do
        pageflow_configure do |config|
          TestFileType.register(config,
                                model: TestHostedFile,
                                css_background_image_urls: lambda do |file|
                                  {default: file.attachment.url}
                                end)
        end

        entry = PublishedEntry.new(create(:entry, :published))
        hosted_file = create(:used_file, model: :hosted_file, revision: entry.revision)

        result = helper.file_background_images_css(entry, :desktop)

        expect(result).to include(".pageflow_test_hosted_file_#{hosted_file.perma_id}")
      end

      it 'supports urls index by breakpoint name' do
        pageflow_configure do |config|
          TestFileType.register(config,
                                model: TestHostedFile,
                                css_background_image_urls: lambda do |file|
                                  {
                                    poster: {
                                      desktop: file.attachment.url
                                    }
                                  }
                                end)
        end

        entry = PublishedEntry.new(create(:entry, :published))
        hosted_file = create(:used_file, model: :hosted_file, revision: entry.revision)

        result = helper.file_background_images_css(entry, :desktop)

        expect(result).to include(".pageflow_test_hosted_file_poster_#{hosted_file.perma_id}")
      end

      it 'fails with helpful error when unknown breakpoint is used' do
        pageflow_configure do |config|
          TestFileType.register(config,
                                model: TestHostedFile,
                                css_background_image_urls: lambda do |file|
                                  {
                                    poster: {
                                      plesktop: file.attachment.url
                                    }
                                  }
                                end)
        end

        entry = PublishedEntry.new(create(:entry, :published))
        create(:hosted_file, used_in: entry.revision)

        expect {
          helper.file_background_images_css(entry, :desktop)
        }.to raise_error(/Unknown breakpoints plesktop/)
      end

      it 'skips rules for other breakpoint' do
        pageflow_configure do |config|
          TestFileType.register(config,
                                model: TestHostedFile,
                                css_background_image_urls: lambda do |file|
                                  {
                                    poster: {
                                      desktop: file.attachment.url
                                    }
                                  }
                                end)
        end

        entry = PublishedEntry.new(create(:entry, :published))
        create(:hosted_file, used_in: entry.revision)

        result = helper.file_background_images_css(entry, :mobile)

        expect(result).to be_blank
      end

      it 'supports custom css class prefix' do
        pageflow_configure do |config|
          TestFileType.register(config,
                                model: TestHostedFile,
                                css_background_image_class_prefix: 'custom',
                                css_background_image_urls: lambda do |file|
                                  {
                                    poster: file.attachment.url
                                  }
                                end)
        end

        entry = PublishedEntry.new(create(:entry, :published))
        hosted_file = create(:used_file, model: :hosted_file, revision: entry.revision)

        result = helper.file_background_images_css(entry, :desktop)

        expect(result).to include(".custom_poster_#{hosted_file.perma_id}")
      end
    end
  end
end
