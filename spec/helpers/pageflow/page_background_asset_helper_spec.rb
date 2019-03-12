require 'spec_helper'

module Pageflow
  describe PageBackgroundAssetHelper do
    describe '#page_background_asset' do
      it 'renders background image div' do
        entry = create(:entry, :published)
        image_file = create(:image_file, used_in: entry.published_revision)
        page = create(:page,
                      revision: entry.published_revision,
                      configuration: {background_image_id: image_file.id})

        html = helper.page_background_asset(page, PublishedEntry.new(entry))

        expect(html).to have_selector("div.background_image.image_#{image_file.id}")
      end
    end
  end
end
