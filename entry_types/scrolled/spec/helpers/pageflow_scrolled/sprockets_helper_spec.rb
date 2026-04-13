require 'spec_helper'

module PageflowScrolled
  RSpec.describe SprocketsHelper, type: :helper do
    describe '#scrolled_sprockets_asset_tags' do
      it 'includes legacy javascript tag' do
        result = helper.scrolled_sprockets_asset_tags(entry_mode: :published)

        expect(result).to have_selector(
          'script[src*="pageflow_scrolled/legacy"]',
          visible: false
        )
      end

      it 'includes ui stylesheet in preview mode' do
        result = helper.scrolled_sprockets_asset_tags(entry_mode: :preview)

        expect(result).to have_selector(
          'link[href*="pageflow_scrolled/ui"]',
          visible: false
        )
      end

      it 'includes ui stylesheet in editor mode' do
        result = helper.scrolled_sprockets_asset_tags(entry_mode: :editor)

        expect(result).to have_selector(
          'link[href*="pageflow_scrolled/ui"]',
          visible: false
        )
      end

      it 'does not include ui stylesheet in published mode' do
        result = helper.scrolled_sprockets_asset_tags(entry_mode: :published)

        expect(result).not_to have_selector(
          'link[href*="pageflow_scrolled/ui"]',
          visible: false
        )
      end
    end
  end
end
