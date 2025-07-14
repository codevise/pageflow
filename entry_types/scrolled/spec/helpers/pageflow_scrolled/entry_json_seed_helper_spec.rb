require 'spec_helper'
require 'pageflow/used_file_test_helper'
require 'pageflow/shared_contexts/fake_translations'
require 'pageflow/test_uploadable_file'

module PageflowScrolled
  RSpec.describe EntryJsonSeedHelper, type: :helper do
    describe '#scrolled_entry_json_seed' do
      include UsedFileTestHelper

      def render(helper, entry, options = {})
        helper.render_json do |json|
          helper.scrolled_entry_json_seed(json, entry, options)
        end
      end

      context 'storylines' do
        it 'renders storylines with id, perma_id, position and configuration' do
          entry = create(:published_entry, type_name: 'scrolled')
          main_storyline = create(
            :scrolled_storyline,
            revision: entry.revision,
            position: 0,
            configuration: {main: true}
          )
          excursion_storyline = create(
            :scrolled_storyline,
            revision: entry.revision,
            position: 1
          )

          result = render(helper, entry)

          expect(result)
            .to include_json(collections: {
                               storylines: [
                                 {
                                   id: main_storyline.id,
                                   permaId: main_storyline.perma_id,
                                   position: 0,
                                   configuration: {
                                     main: true
                                   }
                                 },
                                 {
                                   id: excursion_storyline.id,
                                   permaId: excursion_storyline.perma_id,
                                   position: 1
                                 }
                               ]
                             })
        end
      end

      context 'entries' do
        it 'renders single-element entry array' do
          entry = create(:published_entry,
                         type_name: 'scrolled',
                         revision_attributes: {
                           published_at: '2020-08-11 10:00'.in_time_zone('UTC'),
                           locale: 'fr',
                           share_providers: {facebook: true},
                           credits: 'Test Credits',
                           configuration: {
                             darkWidgets: true
                           }
                         })

          result = render(helper, entry)

          expect(result)
            .to include_json(collections: {
                               entries: [
                                 {
                                   id: entry.id,
                                   permaId: entry.id,
                                   publishedAt: '2020-08-11T10:00:00Z',
                                   locale: 'fr',
                                   shareProviders: {facebook: true},
                                   credits: 'Test Credits',
                                   configuration: {
                                     darkWidgets: true
                                   }
                                 }
                               ]
                             })
        end
      end

      context 'chapters' do
        it 'renders chapters with id, perma_id, storyline_id, position and configuration' do
          entry = create(:published_entry, type_name: 'scrolled')
          chapter = create(:scrolled_chapter, revision: entry.revision, position: 3)

          result = render(helper, entry)

          expect(result)
            .to include_json(collections: {
                               chapters: [
                                 {
                                   id: chapter.id,
                                   permaId: chapter.perma_id,
                                   storylineId: chapter.storyline_id,
                                   position: 3,
                                   configuration: {
                                     title: 'chapter title'
                                   }
                                 }
                               ]
                             })
        end

        it 'orders chapters according to position attribute' do
          entry = create(:published_entry, type_name: 'scrolled')
          chapter1 = create(:scrolled_chapter, revision: entry.revision, position: 4)
          chapter2 = create(:scrolled_chapter, revision: entry.revision, position: 3)

          result = render(helper, entry)

          expect(result)
            .to include_json(collections: {
                               chapters: [
                                 {id: chapter2.id},
                                 {id: chapter1.id}
                               ]
                             })
        end

        it 'renders chapters from excursions storyline' do
          entry = create(:published_entry, type_name: 'scrolled')
          main_storyline = create(
            :scrolled_storyline,
            revision: entry.revision,
            position: 0,
            configuration: {main: true}
          )
          excursions_storyline = create(
            :scrolled_storyline,
            revision: entry.revision,
            position: 1
          )
          chapter = create(
            :scrolled_chapter,
            storyline: main_storyline,
            position: 3
          )
          excursion_chapter = create(
            :scrolled_chapter,
            storyline: excursions_storyline,
            position: 1
          )

          result = render(helper, entry)

          expect(result)
            .to include_json(collections: {
                               chapters: [
                                 {
                                   id: chapter.id,
                                   permaId: chapter.perma_id,
                                   storylineId: main_storyline.id,
                                   position: 3
                                 },
                                 {
                                   id: excursion_chapter.id,
                                   permaId: excursion_chapter.perma_id,
                                   storylineId: excursions_storyline.id,
                                   position: 1
                                 }
                               ]
                             })
        end

        it 'renders all chapter even when cutoff mode is enabled' do
          pageflow_configure do |config|
            config.cutoff_modes.register(
              :test,
              proc { true }
            )
          end

          site = create(:site, cutoff_mode_name: 'test')
          entry = create(:published_entry,
                         site:,
                         type_name: 'scrolled',
                         revision_attributes: {
                           configuration: {
                             cutoff_section_perma_id: 100
                           }
                         })
          chapter1 = create(:scrolled_chapter, revision: entry.revision, position: 1)
          create(:section, chapter: chapter1, perma_id: 100)
          chapter2 = create(:scrolled_chapter, revision: entry.revision, position: 2)

          result = render(helper, entry)

          expect(
            JSON.parse(result).dig('collections', 'chapters').map { |chapter| chapter['id'] }
          ).to eq([chapter1.id, chapter2.id])
        end

        it 'filters out chapters with only hidden sections' do
          entry = create(:published_entry, type_name: 'scrolled')
          chapter1 = create(:scrolled_chapter, revision: entry.revision)
          create(:section, chapter: chapter1)
          create(:section, chapter: chapter1, configuration: {hidden: true})
          chapter2 = create(:scrolled_chapter, revision: entry.revision)
          create(:section, chapter: chapter2, configuration: {hidden: true})
          create(:section, chapter: chapter2, configuration: {hidden: true})
          chapter3 = create(:scrolled_chapter, revision: entry.revision)

          result = render(helper, entry)

          expect(
            JSON.parse(result).dig('collections', 'chapters').map { |chapter| chapter['id'] }
          ).to eq([chapter1.id, chapter3.id])
        end

        it 'supports including chapters with only hidden sections' do
          entry = create(:published_entry, type_name: 'scrolled')
          chapter1 = create(:scrolled_chapter, revision: entry.revision)
          create(:section, chapter: chapter1)
          create(:section, chapter: chapter1, configuration: {hidden: true})
          chapter2 = create(:scrolled_chapter, revision: entry.revision)
          create(:section, chapter: chapter2, configuration: {hidden: true})
          create(:section, chapter: chapter2, configuration: {hidden: true})

          result = render(helper, entry, include_hidden_sections: true)

          expect(
            JSON.parse(result).dig('collections', 'chapters').map { |chapter| chapter['id'] }
          ).to eq([chapter1.id, chapter2.id])
        end
      end

      context 'sections' do
        it 'renders sections with id, perma_id, chapter_id, position and configuration' do
          entry = create(:published_entry, type_name: 'scrolled')
          chapter = create(:scrolled_chapter, revision: entry.revision)
          section = create(:section,
                           chapter:,
                           position: 4,
                           configuration: {transition: 'scroll'})

          result = render(helper, entry)

          expect(result)
            .to include_json(collections: {
                               sections: [
                                 {
                                   id: section.id,
                                   permaId: section.perma_id,
                                   chapterId: chapter.id,
                                   position: 4,
                                   configuration: {
                                     transition: 'scroll'
                                   }
                                 }
                               ]
                             })
        end

        it 'orders sections by chapter position and section position' do
          entry = create(:published_entry, type_name: 'scrolled')
          chapter2 = create(:scrolled_chapter, position: 2, revision: entry.revision)
          section22 = create(:section, chapter: chapter2, position: 2)
          section21 = create(:section, chapter: chapter2, position: 1)
          chapter1 = create(:scrolled_chapter, position: 1, revision: entry.revision)
          section12 = create(:section, chapter: chapter1, position: 2)
          section11 = create(:section, chapter: chapter1, position: 1)

          result = render(helper, entry)

          expect(result)
            .to include_json(collections: {
                               sections: [
                                 {id: section11.id},
                                 {id: section12.id},
                                 {id: section21.id},
                                 {id: section22.id}
                               ]
                             })
        end

        it 'renders sections from excursions storyline' do
          entry = create(:published_entry, type_name: 'scrolled')
          main_storyline = create(
            :scrolled_storyline,
            revision: entry.revision,
            position: 0,
            configuration: {main: true}
          )
          excursions_storyline = create(
            :scrolled_storyline,
            revision: entry.revision,
            position: 1
          )
          chapter1 = create(:scrolled_chapter, position: 2, storyline: main_storyline)
          section12 = create(:section, chapter: chapter1, position: 2)
          section11 = create(:section, chapter: chapter1, position: 1)
          chapter2 = create(:scrolled_chapter, position: 1, storyline: excursions_storyline)
          section22 = create(:section, chapter: chapter2, position: 2)
          section21 = create(:section, chapter: chapter2, position: 1)

          result = render(helper, entry)

          expect(result)
            .to include_json(collections: {
                               sections: [
                                 {id: section11.id},
                                 {id: section12.id},
                                 {id: section21.id},
                                 {id: section22.id}
                               ]
                             })
        end

        it 'supports filtering sections based on cutoff section when cutoff mode is enabled' do
          pageflow_configure do |config|
            config.cutoff_modes.register(
              :test,
              proc { true }
            )
          end

          site = create(:site, cutoff_mode_name: 'test')
          entry = create(:published_entry,
                         site:,
                         type_name: 'scrolled',
                         revision_attributes: {
                           configuration: {
                             cutoff_section_perma_id: 100
                           }
                         })

          chapter1 = create(:scrolled_chapter, position: 1, revision: entry.revision)
          section11 = create(:section, chapter: chapter1, position: 1)
          section12 = create(:section, chapter: chapter1, position: 2)
          chapter2 = create(:scrolled_chapter, position: 2, revision: entry.revision)
          section21 = create(:section, chapter: chapter2, position: 1)
          create(:section, chapter: chapter2, position: 2, perma_id: 100)
          create(:section, chapter: chapter2, position: 3)

          result = render(helper, entry)

          expect(
            JSON.parse(result).dig('collections', 'sections').map { |s| s['id'] }
          ).to eq([section11.id, section12.id, section21.id])
        end

        it 'does not filter sections when no cutoff section is configured' do
          pageflow_configure do |config|
            config.cutoff_modes.register(
              :test,
              proc { true }
            )
          end

          site = create(:site, cutoff_mode_name: 'test')
          entry = create(:published_entry,
                         site:,
                         type_name: 'scrolled')
          chapter1 = create(:scrolled_chapter, position: 1, revision: entry.revision)
          section11 = create(:section, chapter: chapter1, position: 1)
          section12 = create(:section, chapter: chapter1, position: 2)
          chapter2 = create(:scrolled_chapter, position: 2, revision: entry.revision)
          section21 = create(:section, chapter: chapter2, position: 1)
          section22 = create(:section, chapter: chapter2, position: 2)

          result = render(helper, entry)

          expect(
            JSON.parse(result).dig('collections', 'sections').map { |s| s['id'] }
          ).to eq([section11.id, section12.id, section21.id, section22.id])
        end

        it 'does not filter sections when configured cutoff mode is disabled' do
          pageflow_configure do |config|
            config.cutoff_modes.register(
              :test,
              proc { false }
            )
          end

          site = create(:site, cutoff_mode_name: 'test')
          entry = create(:published_entry,
                         site:,
                         type_name: 'scrolled',
                         revision_attributes: {
                           configuration: {
                             cutoff_section_perma_id: 100
                           }
                         })
          chapter1 = create(:scrolled_chapter, position: 1, revision: entry.revision)
          section11 = create(:section, chapter: chapter1, position: 1)
          section12 = create(:section, chapter: chapter1, position: 2)
          chapter2 = create(:scrolled_chapter, position: 2, revision: entry.revision)
          section21 = create(:section, chapter: chapter2, position: 1, perma_id: 100)
          section22 = create(:section, chapter: chapter2, position: 2)

          result = render(helper, entry)

          expect(
            JSON.parse(result).dig('collections', 'sections').map { |s| s['id'] }
          ).to eq([section11.id, section12.id, section21.id, section22.id])
        end

        it 'does not filter sections when no cutoff mode is configured' do
          site = create(:site)
          entry = create(:published_entry,
                         site:,
                         type_name: 'scrolled',
                         revision_attributes: {
                           configuration: {
                             cutoff_section_perma_id: 100
                           }
                         })
          chapter1 = create(:scrolled_chapter, position: 1, revision: entry.revision)
          section11 = create(:section, chapter: chapter1, position: 1)
          section12 = create(:section, chapter: chapter1, position: 2)
          chapter2 = create(:scrolled_chapter, position: 2, revision: entry.revision)
          section21 = create(:section, chapter: chapter2, position: 1, perma_id: 100)
          section22 = create(:section, chapter: chapter2, position: 2)

          result = render(helper, entry)

          expect(
            JSON.parse(result).dig('collections', 'sections').map { |s| s['id'] }
          ).to eq([section11.id, section12.id, section21.id, section22.id])
        end

        it 'does not filter sections based on cutoff for draft entry' do
          pageflow_configure do |config|
            config.cutoff_modes.register(
              :test,
              proc { true }
            )
          end

          site = create(:site, cutoff_mode_name: 'test')
          entry = create(:draft_entry,
                         site:,
                         type_name: 'scrolled',
                         revision_attributes: {
                           configuration: {
                             cutoff_section_perma_id: 100
                           }
                         })

          chapter1 = create(:scrolled_chapter, position: 1, revision: entry.revision)
          section11 = create(:section, chapter: chapter1, position: 1)
          section12 = create(:section, chapter: chapter1, position: 2)
          chapter2 = create(:scrolled_chapter, position: 2, revision: entry.revision)
          section21 = create(:section, chapter: chapter2, position: 1)
          section22 = create(:section, chapter: chapter2, position: 2, perma_id: 100)

          result = render(helper, entry)

          expect(
            JSON.parse(result).dig('collections', 'sections').map { |s| s['id'] }
          ).to eq([section11.id, section12.id, section21.id, section22.id])
        end

        it 'filters out hidden sections' do
          entry = create(:published_entry, type_name: 'scrolled')

          chapter1 = create(:scrolled_chapter, position: 1, revision: entry.revision)
          section11 = create(:section, chapter: chapter1, position: 1)
          create(:section, chapter: chapter1, position: 2, configuration: {hidden: true})

          result = render(helper, entry)

          expect(
            JSON.parse(result).dig('collections', 'sections').map { |s| s['id'] }
          ).to eq([section11.id])
        end

        it 'supports including hidden sections' do
          entry = create(:published_entry, type_name: 'scrolled')

          chapter1 = create(:scrolled_chapter, position: 1, revision: entry.revision)
          section11 = create(:section, chapter: chapter1, position: 1)
          section12 = create(:section, chapter: chapter1, position: 2,
                                       configuration: {hidden: true})

          result = render(helper, entry, include_hidden_sections: true)

          expect(
            JSON.parse(result).dig('collections', 'sections').map { |s| s['id'] }
          ).to eq([section11.id, section12.id])
        end
      end

      context 'content_elements' do
        it 'renders content elements with id, perma_id, type_name, position, section id ' \
         'and configuration' do
          entry = create(:published_entry, type_name: 'scrolled')
          chapter = create(:scrolled_chapter, revision: entry.revision)
          section = create(:section, chapter:)
          content_element = create(:content_element,
                                   :heading,
                                   section:,
                                   position: 4,
                                   configuration: {text: 'Heading'})

          result = render(helper, entry)

          expect(result)
            .to include_json(collections: {
                               contentElements: [
                                 {
                                   id: content_element.id,
                                   permaId: content_element.perma_id,
                                   typeName: 'heading',
                                   sectionId: section.id,
                                   position: 4,
                                   configuration: {
                                     text: 'Heading'
                                   }
                                 }
                               ]
                             })
        end

        it 'orders content elements by chapter position, section position and ' \
           'content element position' do
          entry = create(:published_entry, type_name: 'scrolled')
          chapter2 = create(:scrolled_chapter, position: 2, revision: entry.revision)
          section22 = create(:section, chapter: chapter2, position: 2)
          content_element222 = create(:content_element, section: section22, position: 2)
          content_element221 = create(:content_element, section: section22, position: 1)
          section21 = create(:section, chapter: chapter2, position: 1)
          content_element212 = create(:content_element, section: section21, position: 2)
          content_element211 = create(:content_element, section: section21, position: 1)

          chapter1 = create(:scrolled_chapter, position: 1, revision: entry.revision)
          section12 = create(:section, chapter: chapter1, position: 2)
          content_element122 = create(:content_element, section: section12, position: 2)
          content_element121 = create(:content_element, section: section12, position: 1)
          section11 = create(:section, chapter: chapter1, position: 1)
          content_element112 = create(:content_element, section: section11, position: 2)
          content_element111 = create(:content_element, section: section11, position: 1)

          result = render(helper, entry)

          expect(result)
            .to include_json(collections: {
                               contentElements: [
                                 {id: content_element111.id},
                                 {id: content_element112.id},
                                 {id: content_element121.id},
                                 {id: content_element122.id},
                                 {id: content_element211.id},
                                 {id: content_element212.id},
                                 {id: content_element221.id},
                                 {id: content_element222.id}
                               ]
                             })
        end

        it 'renders content elements of excursions storyline' do
          entry = create(:published_entry, type_name: 'scrolled')
          main_storyline = create(
            :scrolled_storyline,
            revision: entry.revision,
            position: 0,
            configuration: {main: true}
          )
          excursions_storyline = create(
            :scrolled_storyline,
            revision: entry.revision,
            position: 1
          )
          chapter1 = create(:scrolled_chapter, position: 2, storyline: main_storyline)
          section12 = create(:section, chapter: chapter1, position: 2)
          content_element122 = create(:content_element, section: section12, position: 2)
          content_element121 = create(:content_element, section: section12, position: 1)
          section11 = create(:section, chapter: chapter1, position: 1)
          content_element112 = create(:content_element, section: section11, position: 2)
          content_element111 = create(:content_element, section: section11, position: 1)

          chapter2 = create(:scrolled_chapter, position: 1, storyline: excursions_storyline)
          section22 = create(:section, chapter: chapter2, position: 2)
          content_element222 = create(:content_element, section: section22, position: 2)
          content_element221 = create(:content_element, section: section22, position: 1)
          section21 = create(:section, chapter: chapter2, position: 1)
          content_element212 = create(:content_element, section: section21, position: 2)
          content_element211 = create(:content_element, section: section21, position: 1)

          result = render(helper, entry)

          expect(result)
            .to include_json(collections: {
                               contentElements: [
                                 {id: content_element111.id},
                                 {id: content_element112.id},
                                 {id: content_element121.id},
                                 {id: content_element122.id},
                                 {id: content_element211.id},
                                 {id: content_element212.id},
                                 {id: content_element221.id},
                                 {id: content_element222.id}
                               ]
                             })
        end

        it 'supports filtering content elements based on cutoff section when cutoff mode is enabled' do
          pageflow_configure do |config|
            config.cutoff_modes.register(
              :test,
              proc { true }
            )
          end

          site = create(:site, cutoff_mode_name: 'test')
          entry = create(:published_entry,
                         site:,
                         type_name: 'scrolled',
                         revision_attributes: {
                           configuration: {
                             cutoff_section_perma_id: 100
                           }
                         })

          chapter1 = create(:scrolled_chapter, position: 1, revision: entry.revision)
          section11 = create(:section, chapter: chapter1, position: 1)
          content_element11 = create(:content_element, section: section11)
          section12 = create(:section, chapter: chapter1, position: 2)
          content_element12 = create(:content_element, section: section12)
          chapter2 = create(:scrolled_chapter, position: 2, revision: entry.revision)
          section21 = create(:section, chapter: chapter2, position: 1, perma_id: 100)
          create(:content_element, section: section21)
          section22 = create(:section, chapter: chapter2, position: 2)
          create(:content_element, section: section22)

          result = render(helper, entry)

          expect(
            JSON.parse(result).dig('collections', 'contentElements').map { |c| c['id'] }
          ).to eq([content_element11.id, content_element12.id])
        end

        it 'supports filtering content elements of hidden sections' do
          entry = create(:published_entry, type_name: 'scrolled')

          chapter1 = create(:scrolled_chapter, revision: entry.revision)
          section11 = create(:section, chapter: chapter1, configuration: {hidden: true})
          create(:content_element, section: section11)
          section12 = create(:section, chapter: chapter1)
          content_element12 = create(:content_element, section: section12)

          result = render(helper, entry)

          expect(
            JSON.parse(result).dig('collections', 'contentElements').map { |c| c['id'] }
          ).to eq([content_element12.id])
        end

        it 'supports including content elements of hidden sections' do
          entry = create(:published_entry, type_name: 'scrolled')

          chapter1 = create(:scrolled_chapter, revision: entry.revision)
          section11 = create(:section, chapter: chapter1, configuration: {hidden: true})
          content_element11 = create(:content_element, section: section11)
          section12 = create(:section, chapter: chapter1)
          content_element12 = create(:content_element, section: section12)

          result = render(helper, entry, include_hidden_sections: true)

          expect(
            JSON.parse(result).dig('collections', 'contentElements').map { |c| c['id'] }
          ).to eq([content_element11.id, content_element12.id])
        end
      end

      describe 'widgets' do
        it 'renders widgets registered using ReactWidgetType' do
          pageflow_configure do |config|
            config.widget_types.register(ReactWidgetType.new(name: 'customNavigation',
                                                             role: 'header'))
          end

          entry = create(:published_entry, type_name: 'scrolled')
          create(:widget,
                 subject: entry.revision,
                 type_name: 'customNavigation',
                 role: 'header',
                 configuration: {some: 'value'})

          result = render(helper, entry)

          expect(result)
            .to include_json(collections: {
                               widgets: [
                                 {
                                   permaId: 'header',
                                   role: 'header',
                                   typeName: 'customNavigation',
                                   configuration: {some: 'value'}
                                 }
                               ]
                             })
        end

        it 'ignores widgets that have not been registered using ReactWidgetType' do
          entry = create(:published_entry, type_name: 'scrolled')
          create(:widget,
                 subject: entry.revision,
                 type_name: 'erb_based_widget',
                 role: 'analytics')

          result = render(helper, entry)

          expect(result).to include_json(collections: {widgets: []})
        end
      end

      it 'also works for draft entry' do
        entry = create(:draft_entry, type_name: 'scrolled')
        create(:scrolled_chapter, revision: entry.revision)

        result = render(helper, entry)

        expect(result).to include_json(collections: {contentElements: []})
      end

      it 'supports skipping collections' do
        entry = create(:published_entry, type_name: 'scrolled')

        result = render(helper, entry, skip_collections: true)

        expect(JSON.parse(result)).not_to have_key('collections')
      end

      it 'renders files' do
        entry = create(:published_entry, type_name: 'scrolled')
        image_file = create_used_file(:video_file, entry:, output_presences: {'high': true})

        result = render(helper, entry)

        expect(result)
          .to include_json(collections: {
                             videoFiles: [
                               {
                                 permaId: image_file.perma_id,
                                 variants: including('high', 'posterLarge')
                               }
                             ]
                           })
      end

      it 'supports skipping files' do
        entry = create(:published_entry, type_name: 'scrolled')
        create_used_file(:image_file, entry:)

        result = render(helper, entry, skip_files: true)

        expect(result)
          .not_to include_json(collections: {
                                 imageFiles: a_kind_of(Array)
                               })
      end

      it 'renders file url templates' do
        url_template = 'files/:id_partition/video.mp4'
        pageflow_configure do |config|
          config
            .file_types
            .register(Pageflow::FileType.new(model: 'Pageflow::TestUploadableFile',
                                             collection_name: 'test_files',
                                             url_templates: -> { {poster_medium: url_template} }))
        end
        entry = create(:published_entry, type_name: 'scrolled')

        result = render(helper, entry)

        expect(result)
          .to include_json(config: {
                             fileUrlTemplates: {
                               testFiles: {
                                 posterMedium: url_template
                               }
                             }
                           })
      end

      it 'renders file model types' do
        pageflow_configure do |config|
          config
            .file_types
            .register(Pageflow::FileType.new(model: 'Pageflow::TestUploadableFile',
                                             collection_name: 'test_files'))
        end
        entry = create(:published_entry, type_name: 'scrolled')

        result = render(helper, entry)

        expect(result)
          .to include_json(config: {
                             fileModelTypes: {
                               testFiles: 'Pageflow::TestUploadableFile'
                             }
                           })
      end

      it 'renders entry pretty url and provider share url templates' do
        site = create(:site, cname: '')
        entry = create(:published_entry,
                       type_name: 'scrolled',
                       title: 'test',
                       site:)

        result = render(helper, entry)

        expect(result).to include_json(config: {
                                         prettyUrl: 'http://test.host/test',
                                         shareUrlTemplates: {
                                           email: 'mailto:?body=%<url>s',
                                           twitter: 'https://x.com/intent/post?url=%<url>s',
                                           whats_app: 'WhatsApp://send?text=%<url>s'
                                         }
                                       })
      end

      it 'renders default file rights from account' do
        account = create(:account, default_file_rights: '@WDR')
        entry = create(:published_entry,
                       type_name: 'scrolled',
                       title: 'test',
                       account:)

        result = render(helper, entry)

        expect(result).to include_json(config: {defaultFileRights: '@WDR'})
      end

      it 'renders legal info' do
        entry = create(:published_entry, type_name: 'scrolled')

        result = render(helper, entry)

        expect(result).to include_json(config: {
                                         legalInfo: {
                                           imprint: {},
                                           copyright: {},
                                           privacy: {}
                                         }
                                       })
      end

      it 'renders theme assets' do
        entry = create(:published_entry, type_name: 'scrolled')

        result = render(helper, entry)

        expect(result)
          .to include_json(config: {
                             theme: {
                               assets: {
                                 logoDesktop: %r{themes/default/logoDesktop.*svg$},
                                 logoDarkVariantDesktop: %r{themes/default/logoDarkVariantDesktop.*svg$}
                               }
                             }
                           })
      end

      it 'renders theme assets for additional theme customization files' do
        pageflow_configure do |config|
          config.for_entry_type(PageflowScrolled.entry_type) do |entry_type_config|
            entry_type_config.additional_theme_assets.register(theme_file_role: :footer_logo)
          end
        end
        entry = create(:published_entry, type_name: 'scrolled')
        file = Pageflow.theme_customizations.upload_file(
          site: entry.site,
          entry_type_name: 'scrolled',
          type_name: :logo_desktop,
          attachment: fixture_file_upload('image.svg')
        )
        Pageflow.theme_customizations.update(site: entry.site,
                                             entry_type_name: 'scrolled',
                                             file_ids: {footer_logo: file.id})

        result = render(helper, entry)

        expect(result).to include_json(config: {
                                         theme: {
                                           assets: {
                                             footerLogo: %r{resized/image.svg}
                                           }
                                         }
                                       })
      end

      it 'renders theme assets for custom icons' do
        pageflow_configure do |config|
          config.themes.register(:default, custom_icons: [:share])
        end
        entry = create(:published_entry, type_name: 'scrolled')

        result = render(helper, entry)

        expect(result).to include_json(config: {
                                         theme: {
                                           assets: {
                                             icons: {
                                               share: %r{themes/default/icons/share.*svg$}
                                             }
                                           }
                                         }
                                       })
      end

      it 'supports custom icons directories' do
        pageflow_configure do |config|
          config.themes.register(:default,
                                 custom_icons: [:share],
                                 custom_icons_directory: 'icons/someSet')
        end
        entry = create(:published_entry, type_name: 'scrolled')
        theme_directory = Rails.root.join('app/javascript/pageflow-scrolled/themes/default')
        FileUtils.mkdir_p(theme_directory.join('icons/someSet'))
        FileUtils.cp(theme_directory.join('icons/share.svg'),
                     theme_directory.join('icons/someSet/share.svg'))

        result = render(helper, entry)

        expect(result).to include_json(config: {
                                         theme: {
                                           assets: {
                                             icons: {
                                               share: %r{themes/default/icons/someSet/share.*svg$}
                                             }
                                           }
                                         }
                                       })
      end

      it 'supports shared theme directory in custom icons directories' do
        pageflow_configure do |config|
          config.themes.register(:default,
                                 custom_icons: [:share],
                                 custom_icons_directory: '../shared/icons')
        end
        entry = create(:published_entry, type_name: 'scrolled')
        default_theme_directory = Rails.root.join('app/javascript/pageflow-scrolled/themes/default')
        shared_theme_directory = Rails.root.join('app/javascript/pageflow-scrolled/themes/shared')
        FileUtils.mkdir_p(shared_theme_directory.join('icons'))
        FileUtils.cp(
          default_theme_directory.join('icons/share.svg'),
          shared_theme_directory.join('icons/share.svg')
        )

        result = render(helper, entry)

        expect(result).to include_json(config: {
                                         theme: {
                                           assets: {
                                             icons: {
                                               share: %r{themes/shared/icons/share.*svg$}
                                             }
                                           }
                                         }
                                       })
      end

      it 'does not use asset host in icon paths to allow xlink:href usage' do
        controller.config.asset_host = 'some-asset-host'
        pageflow_configure do |config|
          config.themes.register(:default, custom_icons: [:share])
        end
        entry = create(:published_entry, type_name: 'scrolled')
        result = render(helper, entry)

        expect(result).to include_json(config: {
                                         theme: {
                                           assets: {
                                             icons: {
                                               share: %r{^/packs.*share.*svg$}
                                             }
                                           }
                                         }
                                       })
      end

      it 'renders empty icons object if theme has no custom icons' do
        pageflow_configure do |config|
          config.themes.register(:default, custom_icons: [])
        end
        entry = create(:published_entry, type_name: 'scrolled')
        result = render(helper, entry)

        expect(result).to include_json(config: {
                                         theme: {
                                           assets: {
                                             icons: {}
                                           }
                                         }
                                       })
      end

      it 'allows overriding theme assets via theme customization files' do
        entry = create(:published_entry, type_name: 'scrolled')
        file = Pageflow.theme_customizations.upload_file(
          site: entry.site,
          entry_type_name: 'scrolled',
          type_name: :logo_desktop,
          attachment: fixture_file_upload('image.svg')
        )
        Pageflow.theme_customizations.update(site: entry.site,
                                             entry_type_name: 'scrolled',
                                             file_ids: {logo_desktop: file.id})

        result = render(helper, entry)

        expect(result).to include_json(config: {
                                         theme: {
                                           assets: {
                                             logoDesktop: %r{resized/image.svg}
                                           }
                                         }
                                       })
      end

      it 'renders theme camelized options' do
        pageflow_configure do |config|
          config.themes.register(:default, some_option: 'value')
        end
        entry = create(:published_entry, type_name: 'scrolled')

        result = render(helper, entry)

        expect(result).to include_json(config: {
                                         theme: {
                                           options: {
                                             someOption: 'value'
                                           }
                                         }
                                       })
      end

      it 'renders enabled feature names' do
        pageflow_configure do |config|
          config.features.register('rainbows')
        end
        entry = create(:published_entry, type_name: 'scrolled', with_feature: 'rainbows')

        result = render(helper, entry)

        expect(result).to include_json(config: {
                                         enabledFeatureNames: include('rainbows')
                                       })
      end

      context 'i18n' do
        include_context 'fake translations'

        it 'renders public scrolled translations by default' do
          translation(:de, 'pageflow_scrolled.public.some', 'text')
          entry = create(:published_entry,
                         type_name: 'scrolled',
                         revision_attributes: {locale: 'de'})

          result = render(helper, entry)

          expect(result).to include_json(i18n: {
                                           translations: {
                                             de: {
                                               pageflow_scrolled: {
                                                 public: {
                                                   some: 'text'
                                                 }
                                               }
                                             }
                                           }
                                         })
        end

        it 'supports including scrolled inline editing translations' do
          translation(I18n.locale, 'pageflow_scrolled.inline_editing.some', 'text')
          entry = create(:published_entry, type_name: 'scrolled')

          result = render(helper, entry, translations: {include_inline_editing: true})

          expect(result).to include_json(i18n: {
                                           translations: {
                                             I18n.locale => {
                                               pageflow_scrolled: {
                                                 inline_editing: {
                                                   some: 'text'
                                                 }
                                               }
                                             }
                                           }
                                         })
        end

        it 'includes locale and default locale' do
          entry = create(:published_entry, type_name: 'scrolled')

          result = render(helper, entry)

          expect(result).to include_json(i18n: {
                                           locale: I18n.locale.to_s,
                                           defaultLocale: I18n.default_locale.to_s
                                         })
        end

        it 'supports skipping i18n' do
          entry = create(:published_entry, type_name: 'scrolled')

          result = render(helper, entry, skip_i18n: true)

          expect(JSON.parse(result)).not_to have_key('i18n')
        end
      end

      it 'renders additional frontend seed data' do
        pageflow_configure do |config|
          config.for_entry_type(PageflowScrolled.entry_type) do |entry_type_config|
            entry_type_config.additional_frontend_seed_data.register(
              'someSeed',
              proc { {some: 'data'} }
            )
          end
        end

        entry = create(:published_entry, type_name: 'scrolled')

        result = render(helper, entry)

        expect(result).to include_json(config: {
                                         additionalSeedData: {
                                           someSeed: {
                                             some: 'data'
                                           }
                                         }
                                       })
      end

      it 'supports only rendering seed data of used content elements' do
        pageflow_configure do |config|
          config.for_entry_type(PageflowScrolled.entry_type) do |entry_type_config|
            entry_type_config.additional_frontend_seed_data.register(
              'someSeed',
              proc { {some: 'data'} },
              content_element_type_names: ['extra']
            )
          end
        end

        entry = create(:published_entry, type_name: 'scrolled')
        create(:content_element, revision: entry.revision, type_name: 'extra')

        result = render(helper, entry)

        expect(result).to include_json(config: {
                                         additionalSeedData: {
                                           someSeed: {
                                             some: 'data'
                                           }
                                         }
                                       })
      end

      it 'does not renderer seed data of unused content elements' do
        pageflow_configure do |config|
          config.for_entry_type(PageflowScrolled.entry_type) do |entry_type_config|
            entry_type_config.additional_frontend_seed_data.register(
              'someSeed',
              proc { {some: 'data'} },
              content_element_type_names: ['extra']
            )
          end
        end

        entry = create(:published_entry, type_name: 'scrolled')

        result = render(helper, entry)

        expect(result).not_to include_json(config: {
                                             additionalSeedData: {
                                               someSeed: anything
                                             }
                                           })
      end

      it 'supports rendering seed data of unused content elements for editor' do
        pageflow_configure do |config|
          config.for_entry_type(PageflowScrolled.entry_type) do |entry_type_config|
            entry_type_config.additional_frontend_seed_data.register(
              'someSeed',
              proc { {some: 'data'} },
              content_element_type_names: ['extra']
            )
          end
        end

        entry = create(:published_entry, type_name: 'scrolled')

        result = render(helper, entry, include_unused_additional_seed_data: true)

        expect(result).to include_json(config: {
                                         additionalSeedData: {
                                           someSeed: {some: 'data'}
                                         }
                                       })
      end

      it 'passes request to seed callable' do
        pageflow_configure do |config|
          config.for_entry_type(PageflowScrolled.entry_type) do |entry_type_config|
            entry_type_config.additional_frontend_seed_data.register(
              'someSeed',
              proc { |request:, **| {some: request.original_url} }
            )
          end
        end

        entry = create(:published_entry, type_name: 'scrolled')

        result = render(helper, entry)

        expect(result).to include_json(config: {
                                         additionalSeedData: {
                                           someSeed: {
                                             some: 'http://test.host'
                                           }
                                         }
                                       })
      end

      context 'consent vendors' do
        include_context 'fake translations'

        it 'renders consent vendors of used content elements' do
          translation(:de, 'pageflow_scrolled.consent_vendors.someVendor.name',
                      'Some Vendor')
          translation(:de, 'pageflow_scrolled.consent_vendors.someVendor.description',
                      'Some description')
          translation(:de, 'pageflow_scrolled.consent_vendors.someVendor.opt_in_prompt',
                      'See content from Some Vendor?')

          pageflow_configure do |config|
            config.for_entry_type(PageflowScrolled.entry_type) do |entry_type_config|
              entry_type_config.content_element_consent_vendors.register(
                lambda do |configuration:, **|
                  configuration['vendor']
                end,
                content_element_type_name: 'someEmbed'
              )
            end
          end

          entry = create(:published_entry,
                         type_name: 'scrolled',
                         revision_attributes: {locale: 'de'})
          content_element = create(:content_element,
                                   revision: entry.revision,
                                   type_name: 'someEmbed',
                                   configuration: {vendor: 'someVendor'})

          result = render(helper, entry)

          expect(result).to include_json(config: {
                                           consentVendors: [
                                             {
                                               name: 'someVendor',
                                               displayName: 'Some Vendor',
                                               description: 'Some description',
                                               optInPrompt: 'See content from Some Vendor?',
                                               paradigm: 'lazy opt-in'
                                             }
                                           ],
                                           contentElementConsentVendors: {
                                             content_element.id => 'someVendor'
                                           }
                                         })
        end

        it 'does not render consent vendors of unused content elements' do
          pageflow_configure do |config|
            config.for_entry_type(PageflowScrolled.entry_type) do |entry_type_config|
              entry_type_config.content_element_consent_vendors.register(
                lambda do |**|
                  'someVendor'
                end,
                content_element_type_name: 'someEmbed'
              )
            end
          end

          entry = create(:published_entry,
                         type_name: 'scrolled',
                         revision_attributes: {locale: 'de'})

          result = render(helper, entry)

          expect(result).to include_json(config: {
                                           consentVendors: be_empty,
                                           contentElementConsentVendors: be_empty
                                         })
        end
      end

      it 'renders file licenses' do
        pageflow_configure do |config|
          config.available_file_licenses = [:cc_by_4, :cc_by_sa_4]
        end

        entry = create(:published_entry,
                       type_name: 'scrolled',
                       revision_attributes: {locale: 'de'})

        result = render(helper, entry)

        expect(result).to include_json(config: {
                                         fileLicenses: {
                                           cc_by_4: {
                                             name: 'CC-BY 4.0',
                                             url: 'https://creativecommons.org/licenses/by/4.0/'
                                           }
                                         }
                                       })
      end

      context 'entry translations' do
        it 'renders links to published translations of published entry including noindex entries' do
          de_entry = create(
            :published_entry,
            type_name: 'scrolled',
            title: 'entry-de',
            revision_attributes: {locale: 'de'}
          )
          en_entry = create(
            :published_entry,
            :published_with_noindex,
            translation_of: de_entry,
            type_name: 'scrolled',
            title: 'entry-en',
            revision_attributes: {locale: 'en'}
          )
          create(
            :draft_entry,
            translation_of: de_entry,
            type_name: 'scrolled',
            title: 'entry-fr',
            revision_attributes: {locale: 'fr'}
          )

          result = detect_n_plus_one_queries do
            render(helper, en_entry)
          end

          expect(result).to include_json(config: {
                                           entryTranslations: [
                                             {
                                               id: de_entry.id,
                                               locale: 'de',
                                               displayLocale: 'Deutsch',
                                               url: 'http://test.host/entry-de'
                                             },
                                             {
                                               id: en_entry.id,
                                               locale: 'en',
                                               displayLocale: 'English',
                                               url: 'http://test.host/entry-en'
                                             }
                                           ]
                                         })
        end

        it 'renders links all translations of draft entry' do
          de_entry = create(:draft_entry,
                            type_name: 'scrolled',
                            title: 'draft-entry-de',
                            revision_attributes: {locale: 'de'})
          en_entry = create(:draft_entry,
                            translation_of: de_entry,
                            type_name: 'scrolled',
                            title: 'draft-entry-en',
                            revision_attributes: {locale: 'en'})

          result = detect_n_plus_one_queries do
            render(helper, en_entry)
          end

          expect(result).to include_json(config: {
                                           entryTranslations: [
                                             {
                                               id: de_entry.id,
                                               locale: 'de',
                                               displayLocale: 'Deutsch',
                                               url: '/admin/entries/draft-entry-de/preview'
                                             },
                                             {
                                               id: en_entry.id,
                                               locale: 'en',
                                               displayLocale: 'English',
                                               url: '/admin/entries/draft-entry-en/preview'
                                             }
                                           ]
                                         })
        end
      end

      context 'cutoff' do
        it 'renders false by default' do
          entry = create(:published_entry,
                         type_name: 'scrolled')

          result = render(helper, entry)

          expect(result).to include_json(config: {cutOff: false})
        end

        it 'renders cutoff mode result' do
          pageflow_configure do |config|
            config.cutoff_modes.register(
              :test,
              proc { true }
            )
          end

          site = create(:site, cutoff_mode_name: 'test')
          entry = create(:published_entry,
                         site:,
                         type_name: 'scrolled',
                         revision_attributes: {
                           configuration: {
                             cutoff_section_perma_id: 100
                           }
                         })
          chapter = create(:scrolled_chapter, position: 2, revision: entry.revision)
          create(:section, chapter:, position: 2, perma_id: 100)

          result = render(helper, entry)

          expect(result).to include_json(config: {cutOff: true})
        end

        it 'renders false for draft entry' do
          pageflow_configure do |config|
            config.cutoff_modes.register(
              :test,
              proc { true }
            )
          end

          site = create(:site, cutoff_mode_name: 'test')
          entry = create(:draft_entry,
                         site:,
                         type_name: 'scrolled',
                         revision_attributes: {
                           configuration: {
                             cutoff_section_perma_id: 100
                           }
                         })
          chapter = create(:scrolled_chapter, position: 2, revision: entry.revision)
          create(:section, chapter:, position: 2, perma_id: 100)

          result = render(helper, entry)

          expect(result).to include_json(config: {cutOff: false})
        end
      end
    end

    describe '#scrolled_entry_json_seed_script_tag' do
      it 'renders script tag which assigns seed global variable' do
        entry = create(:published_entry, type_name: 'scrolled')
        chapter = create(:scrolled_chapter, revision: entry.revision)
        create(:section, chapter:)

        result = helper.scrolled_entry_json_seed_script_tag(entry)

        expect(result).to match(%r{<script>.*pageflowScrolledRender\(\{.*\}\).*</script>}m)
      end

      it 'escapes illegal characters' do
        entry = create(:published_entry, type_name: 'scrolled')
        chapter = create(:scrolled_chapter, revision: entry.revision)
        section = create(:section, chapter:)
        create(:content_element,
               :text_block,
               section:,
               configuration: {text: "some\u2028text"})

        result = helper.scrolled_entry_json_seed_script_tag(entry)

        expect(result).to include('some\\u2028text')
      end
    end
  end
end
