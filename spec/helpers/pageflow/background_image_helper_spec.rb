require 'spec_helper'

module Pageflow
  describe BackgroundImageHelper do
    include UsedFileTestHelper

    describe '#background_image_div' do
      it 'returns div with background_image css class' do
        html = helper.background_image_div({}, 'background_image')

        expect(html).to have_selector('div.background_image')
      end

      it 'returns div with background css class' do
        html = helper.background_image_div({}, 'background_image')

        expect(html).to have_selector('div.background')
      end

      it 'returns div with custom css class' do
        html = helper.background_image_div({}, 'background_image', :class => 'custom')

        expect(html).to have_selector('div.background_image.custom')
      end

      it 'returns div with css class for image file from configuration' do
        configuration = {'background_image_id' => 6}
        html = helper.background_image_div(configuration, 'background_image')

        expect(html).to have_selector('div.image_6')
      end

      it 'uses style_group option in image css class' do
        configuration = {'background_image_id' => 6}
        html = helper.background_image_div(configuration, 'background_image', style_group: :panorama)

        expect(html).to have_selector('div.image_panorama_6')
      end

      it 'uses file_tyoe option to determine prefix in image css class' do
        configuration = {'video_id' => 6}
        html = helper.background_image_div(configuration, 'video', file_type: 'video_file')

        expect(html).to have_selector('div.video_poster_6')
      end

      it 'supports custom file types' do
        pageflow_configure do |config|
          TestFileType.register(config,
                                collection_name: 'test_uploadable_files',
                                css_background_image_urls: lambda do |file|
                                  {default: file.attachment.url}
                                end)
        end
        configuration = {'file_id' => 6}
        html = helper.background_image_div(configuration, 'file', file_type: 'test_uploadable_file')

        expect(html).to have_selector('div.pageflow_test_uploadable_file_6')
      end

      it 'sets inline style for background position' do
        configuration = {'background_image_x' => 45, 'background_image_y' => 35}
        html = helper.background_image_div(configuration, 'background_image')

        expect(html).to match(/background-position: 45% 35%;/)
      end

      it 'default background position to 50%' do
        configuration = {'background_image_x' => 45}
        html = helper.background_image_div(configuration, 'background_image')

        expect(html).to match(/background-position: 45% 50%;/)
      end
    end

    describe '#background_image_div_with_size' do
      it 'returns div with data-width and data-height attributes from image' do
        image_file = create_used_file(:image_file, width: 123, height: 456)
        configuration = {'background_image_id' => image_file.perma_id}
        html = helper.background_image_div_with_size(configuration, 'background_image')

        expect(html).to have_selector('div.background_image[data-width="123"][data-height="456"]')
      end

      it 'returns div with data-width and data-height attributes from image' do
        image_file = create_used_file(:image_file, width: 200, height: 100)
        configuration = {'background_image_id' => image_file.perma_id}
        html = helper.background_image_div_with_size(configuration, 'background_image', :spanning => true)

        expect(html).to have_selector('div.background_image[style*="padding-top: 50.0%"][style*="width: 100%"]')
      end

      it 'returns div with data-width and data-height attributes from video' do
        video_file = create_used_file(:video_file, width: 123, height: 456)
        configuration = {'video_id' => video_file.perma_id}
        html = helper.background_image_div_with_size(configuration, 'video', file_type: 'video_file')

        expect(html).to have_selector('div.background_image[data-width="123"][data-height="456"]')
      end
    end

    describe '#background_image_lazy_loading_css_class' do
      it 'returns css classes prefixed with .load_all_images and .load_image' do
        image_file = create_used_file(:image_file)

        css_class = helper.background_image_lazy_loading_css_class('image', image_file)

        expect(css_class).to eq(".load_all_images .image_#{image_file.perma_id}, .load_image.image_#{image_file.perma_id}")
      end
    end
  end
end
