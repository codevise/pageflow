require 'spec_helper'

module Pageflow
  RSpec.describe SprocketsThemeAssetResolver do
    describe '#preview_image_url' do
      it 'resolves conventional preview image path' do
        theme = Theme.new(:custom)
        view_context = double

        expect(view_context).to receive(:image_url)
          .with('pageflow/themes/custom/preview.png')
          .and_return('https://example.com/preview.png')

        result = described_class.new.preview_image_url(theme, view_context:)

        expect(result).to eq('https://example.com/preview.png')
      end
    end

    describe '#preview_thumbnail_url' do
      it 'resolves conventional preview thumbnail path' do
        theme = Theme.new(:custom)
        view_context = double

        expect(view_context).to receive(:image_url)
          .with('pageflow/themes/custom/preview_thumbnail.png')
          .and_return('https://example.com/preview_thumbnail.png')

        result = described_class.new.preview_thumbnail_url(theme, view_context:)

        expect(result).to eq('https://example.com/preview_thumbnail.png')
      end
    end

    describe '#publisher_logo_url' do
      it 'resolves conventional print logo path' do
        entry = double(theme: Theme.new(:custom))
        view_context = double

        expect(view_context).to receive(:asset_url)
          .with('pageflow/themes/custom/logo_print.png')
          .and_return('https://example.com/logo_print.png')

        result = described_class.new.publisher_logo_url(entry, view_context:)

        expect(result).to eq('https://example.com/logo_print.png')
      end
    end
  end
end
