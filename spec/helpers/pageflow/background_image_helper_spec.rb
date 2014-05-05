require 'spec_helper'

module Pageflow
  describe BackgroundImageHelper do
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
        image_file = create(:image_file, :width => 123, :height => 456)
        configuration = {'background_image_id' => image_file.id}
        html = helper.background_image_div_with_size(configuration, 'background_image')

        expect(html).to have_selector('div.background_image[data-width="123"][data-height="456"]')
      end

      it 'returns div with data-width and data-height attributes from image' do
        image_file = create(:image_file, :width => 200, :height => 100)
        configuration = {'background_image_id' => image_file.id}
        html = helper.background_image_div_with_size(configuration, 'background_image', :spanning => true)

        expect(html).to have_selector('div.background_image[style*="padding-top: 50.0%"][style*="width: 100%"]')
      end
    end
  end
end
