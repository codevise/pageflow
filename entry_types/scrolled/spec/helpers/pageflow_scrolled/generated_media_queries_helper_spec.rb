require 'spec_helper'

module PageflowScrolled
  RSpec.describe GeneratedMediaQueriesHelper, type: :helper do
    it 'generates rule in media queries for aspectRatio classes' do
      html = '<div class="aspectRatio1333"></div>'

      css = helper.generated_media_queries_css_for(html)

      expect(css).to include('@media (min-aspect-ratio: 1333/1000)')
      expect(css).to include('.aspectRatio1333 {')
      expect(css).to include('--backdrop-positioner-transform: ' \
                             'var(--backdrop-positioner-min-ar-transform);')
    end

    it 'generates mobile rule in media queries for aspectRatio classes' do
      html = '<div class="aspectRatioMobile1333"></div>'

      css = helper.generated_media_queries_css_for(html)

      expect(css)
        .to include('@media (orientation: portrait) and (min-aspect-ratio: 1333/1000)')
      expect(css).to include('.aspectRatioMobile1333 {')
      expect(css).to include('--backdrop-positioner-transform: ' \
                             'var(--backdrop-positioner-min-ar-transform);')
    end

    it 'generates mutliple rules for element with multiple classes' do
      html = '<div class="aspectRatio750 aspectRatioMobile1333"></div>'

      css = helper.generated_media_queries_css_for(html)

      expect(css)
        .to include('@media (min-aspect-ratio: 750/1000)')
      expect(css)
        .to include('@media (orientation: portrait) and (min-aspect-ratio: 1333/1000)')
    end

    it 'does not generate duplicate rules' do
      html = '<div class="aspectRatio750"></div><div class="aspectRatio750"></div>'

      css = helper.generated_media_queries_css_for(html)

      expect(css.scan('@media (min-aspect-ratio: 750/1000)').size).to eq(1)
    end

    it 'ignores strings outside class attributes' do
      html = '<div data-whatever="aspectRatio1333">aspectRatio1333</div>'

      css = helper.generated_media_queries_css_for(html)

      expect(css).to be_empty
    end
  end
end
