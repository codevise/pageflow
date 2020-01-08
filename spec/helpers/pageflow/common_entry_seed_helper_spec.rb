require 'spec_helper'

module Pageflow
  describe CommonEntrySeedHelper do
    before { helper.extend(RenderJsonHelper) }

    describe '#common_entry_seed' do
      describe '["page_types"]' do
        it 'includes thumbnail candidates of page types registered for entry' do
          thumbnail_candidates = [
            {attribute: 'thumbnail_image_id', file_collection: 'image_files'},
            {
              attribute: 'image_id',
              file_collection: 'image_files',
              if: {
                attribute: 'background_type',
                value: 'image'
              }
            },
            {
              attribute: 'video_id',
              file_collection: 'video_files',
              unless: {
                attribute: 'background_type',
                value: 'image'
              }
            }
          ]

          pageflow_configure do |config|
            config.page_types.register(TestPageType.new(name: 'test_page_type',
                                                        thumbnail_candidates: thumbnail_candidates))
          end

          revision = create(:revision, :published)
          entry = create(:entry, published_revision: revision)
          published_entry = PublishedEntry.new(entry)

          result = helper.render_json { |json| helper.common_entry_seed(json, published_entry) }

          candidates = [
            {
              attribute: 'thumbnail_image_id',
              collection_name: 'image_files',
              css_class_prefix: 'pageflow_image_file',
              condition: nil
            },
            {
              attribute: 'image_id',
              collection_name: 'image_files',
              css_class_prefix: 'pageflow_image_file',
              condition: {
                attribute: 'background_type',
                value: 'image',
                negated: false
              }
            },
            {
              attribute: 'video_id',
              collection_name: 'video_files',
              css_class_prefix: 'pageflow_video_file',
              condition: {
                attribute: 'background_type',
                value: 'image',
                negated: true
              }
            }
          ]
          expect(result)
            .to include_json(page_types: {
                               test_page_type: {
                                 thumbnail_candidates: candidates
                               }
                             })
        end
      end

      describe '["locale"]' do
        it 'equals entry locale' do
          entry = PublishedEntry.new(create(:entry,
                                            :published,
                                            published_revision_attributes: {locale: 'fr'}))

          result = helper.render_json { |json| helper.common_entry_seed(json, entry) }

          expect(result).to include_json(locale: 'fr')
        end
      end

      describe '["file_url_templates"]' do
        it 'contains url templates of registered file types' do
          url_template = 'files/:id_partition/video.mp4'
          file_type = FileType.new(model: 'Pageflow::VideoFile',
                                   collection_name: 'test_files',
                                   url_templates: ->() { {original: url_template} })

          pageflow_configure do |config|
            config.page_types.clear
            config.page_types.register(TestPageType.new(name: 'test',
                                                        file_types: [file_type],
                                                        thumbnail_candidates: []))
          end

          entry = PublishedEntry.new(create(:entry, :published))

          result = helper.render_json { |json| helper.common_entry_seed(json, entry) }

          expect(result)
            .to include_json(file_url_templates: {
                               test_files: {
                                 original: url_template
                               }
                             })
        end
      end

      describe '["file_model_types"]' do
        it 'contains mapping of file type collection name to model type name' do
          file_type = FileType.new(model: 'Pageflow::VideoFile',
                                   collection_name: 'test_files')

          pageflow_configure do |config|
            config.page_types.clear
            config.page_types.register(TestPageType.new(name: 'test',
                                                        file_types: [file_type],
                                                        thumbnail_candidates: []))
          end

          entry = PublishedEntry.new(create(:entry, :published))

          result = helper.render_json { |json| helper.common_entry_seed(json, entry) }

          expect(result)
            .to include_json(file_model_types: {
                               test_files: 'Pageflow::VideoFile'
                             })
        end
      end

      describe '["theming"]' do
        it 'contains privacy link url and label' do
          theming = create(:theming,
                           privacy_link_url: 'https://example.com/privacy')
          entry = PublishedEntry.new(create(:entry, :published, theming: theming))

          result = helper.render_json { |json| helper.common_entry_seed(json, entry) }

          expect(result)
            .to include_json(theming: {
                               privacy_link_url: 'https://example.com/privacy'
                             })
        end
      end

      describe '["enabled_feature_names"]' do
        it 'contains list of enabled features' do
          pageflow_configure do |config|
            config.features.register('some_feature')
            config.features.register('other_feature')
          end

          entry = PublishedEntry.new(create(:entry, :published, with_feature: 'some_feature'))

          result = helper.render_json { |json| helper.common_entry_seed(json, entry) }

          expect(result)
            .to include_json(enabled_feature_names: including('some_feature'))
          expect(result)
            .not_to include_json(enabled_feature_names: including('other_feature'))
        end
      end
    end
  end
end
