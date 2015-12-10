require 'spec_helper'

module Pageflow
  describe CommonEntrySeedHelper do
    describe '#common_entry_seed' do
      describe '["page_types"]' do
        let(:page_type) do
          Class.new(PageType) do
            name 'test_page_type'

            def thumbnail_candidates
              [
                {attribute: 'thumbnail_image_id', file_collection: 'image_files'},
                {attribute: 'video_id', file_collection: 'video_files'}
              ]
            end
          end
        end

        it 'includes thumbnail candidates of page types registered for entry' do
          pageflow_configure do |config|
            config.page_types.register(page_type.new)
          end

          revision = create(:revision, :published)
          entry = create(:entry, published_revision: revision)
          published_entry = PublishedEntry.new(entry)

          result = common_entry_seed(published_entry)
          candidates = result[:page_types][:test_page_type][:thumbnail_candidates]

          expect(candidates).to eq([
            {
              attribute: 'thumbnail_image_id',
              collection_name: 'image_files',
              css_class_prefix: 'pageflow_image_file'
            },
            {
              attribute: 'video_id',
              collection_name: 'video_files',
              css_class_prefix: 'pageflow_video_file'
            }
          ])
        end
      end
    end
  end
end
