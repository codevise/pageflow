require 'spec_helper'

module PageflowScrolled
  RSpec.describe ThemeAssetResolver do
    let(:fallback) { double }
    let(:manifest) { double }
    let(:shakapacker) { double(manifest:) }
    let(:view_context) { double(current_shakapacker_instance: shakapacker) }
    let(:theme) { Pageflow::Theme.new(:custom) }

    describe '#preview_image_url' do
      it 'resolves conventional Webpack asset from manifest' do
        expect(manifest).to receive(:lookup)
          .with('static/pageflow-scrolled/themes/custom/preview.png')
          .and_return('/packs/preview-123.png')
        expect(view_context).to receive(:url_to_asset)
          .with('/packs/preview-123.png')
          .and_return('https://example.com/packs/preview-123.png')
        expect(fallback).not_to receive(:preview_image_url)

        result = described_class.new(fallback).preview_image_url(theme, view_context:)

        expect(result).to eq('https://example.com/packs/preview-123.png')
      end

      it 'falls back to Sprockets when asset is missing from manifest' do
        allow(manifest).to receive(:lookup).and_return(nil)
        expect(fallback).to receive(:preview_image_url)
          .with(theme, view_context:)
          .and_return('https://example.com/assets/preview.png')

        result = described_class.new(fallback).preview_image_url(theme, view_context:)

        expect(result).to eq('https://example.com/assets/preview.png')
      end
    end

    describe '#preview_thumbnail_url' do
      it 'resolves conventional Webpack asset from manifest' do
        expect(manifest).to receive(:lookup)
          .with('static/pageflow-scrolled/themes/custom/preview_thumbnail.png')
          .and_return('/packs/preview_thumbnail-123.png')
        expect(view_context).to receive(:url_to_asset)
          .with('/packs/preview_thumbnail-123.png')
          .and_return('https://example.com/packs/preview_thumbnail-123.png')

        result = described_class.new(fallback).preview_thumbnail_url(theme, view_context:)

        expect(result).to eq('https://example.com/packs/preview_thumbnail-123.png')
      end
    end

    describe '#publisher_logo_url' do
      it 'resolves conventional Webpack asset from manifest' do
        entry = double(theme:)
        expect(manifest).to receive(:lookup)
          .with('static/pageflow-scrolled/themes/custom/logo_print.png')
          .and_return('/packs/logo_print-123.png')
        expect(view_context).to receive(:url_to_asset)
          .with('/packs/logo_print-123.png')
          .and_return('https://example.com/packs/logo_print-123.png')

        result = described_class.new(fallback).publisher_logo_url(entry, view_context:)

        expect(result).to eq('https://example.com/packs/logo_print-123.png')
      end
    end
  end
end
