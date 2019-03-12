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

      it 'renders structured data for background image' do
        entry = create(:entry, :published)
        image_file = create(:image_file, used_in: entry.published_revision)
        page = create(:page,
                      revision: entry.published_revision,
                      configuration: {background_image_id: image_file.id})

        html = helper.page_background_asset(page, PublishedEntry.new(entry))

        expect(html).to have_json_ld('@type' => 'ImageObject')
      end

      it 'renders structured data for background vodep' do
        entry = create(:entry, :published)
        video_file = create(:video_file, used_in: entry.published_revision)
        page = create(:page,
                      revision: entry.published_revision,
                      configuration: {
                        background_type: 'video',
                        video_file_id: video_file.id
                      })

        html = helper.page_background_asset(page, PublishedEntry.new(entry))

        expect(html).to have_json_ld('@type' => 'VideoObject')
      end

      it 'does not render structured data if feature is disabled' do
        entry = create(:entry, :published, without_feature: 'structured_data')
        image_file = create(:image_file, used_in: entry.published_revision)
        page = create(:page,
                      revision: entry.published_revision,
                      configuration: {background_image_id: image_file.id})

        html = helper.page_background_asset(page, PublishedEntry.new(entry))

        expect(html).not_to have_json_ld('@type' => 'ImageObject')
      end
    end
  end
end
