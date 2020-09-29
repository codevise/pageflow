require 'spec_helper'

module PageflowScrolled
  RSpec.describe FaviconHelper, type: :helper do
    include Pageflow
    let(:entry) { create(:entry, :published) }
    let(:published_entry) { Pageflow::PublishedEntry.new(entry) }

    def html
      helper.scrolled_favicons_for_entry(published_entry.theme)
    end

    describe 'types' do
      it 'has image/ico type' do
        expect(html).to have_css(
          %{link[rel="icon"][type="image/ico"]},
          visible: false,
          count: 1
        )
      end

      it 'has image/png type' do
        expect(html).to have_css(
          %{link[rel="icon"][type="image/png"]},
          visible: false,
          count: 2
        )
      end
    end

    describe 'manifest' do
      it 'has manifest file' do
        expect(html).to have_css(
          %{link[rel="manifest"]},
          visible: false,
          count: 1
        )
      end
    end

    describe 'meta' do
      it 'has meta tags' do
        expect(html).to have_css(
          %{meta[name='msapplication-TileColor']},
          visible: false,
          count: 1
        )

        expect(html).to have_css(
          %{meta[name='theme-color']},
          visible: false,
          count: 1
        )
      end
    end
  end
end
