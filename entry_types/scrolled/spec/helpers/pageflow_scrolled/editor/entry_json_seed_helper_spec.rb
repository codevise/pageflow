require 'spec_helper'
require 'pageflow/used_file_test_helper'

module PageflowScrolled
  module Editor
    RSpec.describe EntryJsonSeedHelper, type: :helper do
      describe '#scrolled_entry_editor_json_seed' do
        include UsedFileTestHelper

        def render(helper, entry)
          helper.render_json do |json|
            helper.scrolled_entry_editor_json_seed(json, entry)
          end
        end

        it 'renders common entry seed data' do
          entry = create(:draft_entry, type_name: 'scrolled')

          result = render(helper, entry)

          expect(result)
            .to include_json(collections: {
                               entries: [],
                               chapters: [],
                               sections: [],
                               contentElements: [],
                               widgets: []
                             },
                             config: {
                               theme: {}
                             })
        end

        it 'renders hidden chapters and sections' do
          entry = create(:draft_entry, type_name: 'scrolled')
          chapter = create(:scrolled_chapter, revision: entry.revision)
          section = create(:section, chapter:, configuration: {hidden: true})
          content_element = create(:content_element, section:)

          result = render(helper, entry)

          expect(result)
            .to include_json(collections: {
                               entries: [],
                               chapters: [{id: chapter.id}],
                               sections: [{id: section.id}],
                               contentElements: [{id: content_element.id}]
                             })
        end

        it 'does not render files' do
          entry = create(:draft_entry, type_name: 'scrolled')
          create_used_file(:image_file, entry:)

          result = render(helper, entry)

          expect(result)
            .not_to include_json(collections: {
                                   imageFiles: a_kind_of(Array)
                                 })
        end

        it 'does not render i18n' do
          entry = create(:draft_entry, type_name: 'scrolled')

          result = render(helper, entry)

          expect(JSON.parse(result)).not_to have_key('i18n')
        end

        it 'renders seed data of unused content elements' do
          pageflow_configure do |config|
            config.for_entry_type(PageflowScrolled.entry_type) do |entry_type_config|
              entry_type_config.additional_frontend_seed_data.register(
                'someSeed',
                proc { {some: 'data'} },
                content_element_type_names: ['extra']
              )
            end
          end

          entry = create(:draft_entry, type_name: 'scrolled')

          result = render(helper, entry)

          expect(result).to include_json(config: {
                                           additionalSeedData: {
                                             someSeed: {some: 'data'}
                                           }
                                         })
        end

        it 'renders legacy typography variant mapping' do
          pageflow_configure do |config|
            config.for_entry_type(PageflowScrolled.entry_type) do |entry_type_config|
              entry_type_config.legacy_typography_variants = {
                'lgAccent' => {
                  variant: 'lg',
                  palette_color: 'accent'
                }
              }
            end
          end

          entry = create(:draft_entry, type_name: 'scrolled')

          result = render(helper, entry)

          expect(result).to include_json(legacyTypographyVariants: {
                                           lgAccent: {
                                             variant: 'lg',
                                             paletteColor: 'accent'
                                           }
                                         })
        end

        it 'renders consent vendor host matchers' do
          pageflow_configure do |config|
            config.for_entry_type(PageflowScrolled.entry_type) do |entry_type_config|
              entry_type_config.consent_vendor_host_matchers = {
                /\.some-vendor\.com$/ => 'someVendor'
              }
            end
          end

          entry = create(:draft_entry, type_name: 'scrolled')

          result = render(helper, entry)

          expect(result).to include_json(consentVendorHostMatchers: {
                                           '\\.some-vendor\\.com$' => 'someVendor'
                                         })
        end
      end
    end
  end
end
