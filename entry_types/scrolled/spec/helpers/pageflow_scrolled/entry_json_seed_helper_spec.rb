require 'spec_helper'
require 'pageflow/used_file_test_helper'
require 'pageflow/shared_contexts/fake_translations'

module PageflowScrolled
  RSpec.describe EntryJsonSeedHelper, type: :helper do
    describe '#scrolled_entry_json_seed' do
      include UsedFileTestHelper

      def render(helper, entry, options = {})
        helper.render_json do |json|
          helper.scrolled_entry_json_seed(json, entry, options)
        end
      end

      context 'entries' do
        it 'renders single-element entry array' do
          entry = create(:published_entry,
                         revision_attributes: {
                           published_at: '2020-08-11 10:00'.in_time_zone('UTC'),
                           locale: 'fr',
                           share_providers: {facebook: true},
                           credits: 'Test Credits'
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
                                   credits: 'Test Credits'
                                 }
                               ]
                             })
        end
      end

      context 'chapters' do
        it 'renders chapters with id, perma_id, storyline_id, position and configuration' do
          entry = create(:published_entry)
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
          entry = create(:published_entry)
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
      end

      context 'sections' do
        it 'renders sections with id, perma_id, chapter_id, position and configuration' do
          entry = create(:published_entry)
          chapter = create(:scrolled_chapter, revision: entry.revision)
          section = create(:section,
                           chapter: chapter,
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
          entry = create(:published_entry)
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
      end

      context 'content_elements' do
        it 'renders content elements with id, perma_id, type_name, position, section id ' \
         'and configuration' do
          entry = create(:published_entry)
          chapter = create(:scrolled_chapter, revision: entry.revision)
          section = create(:section, chapter: chapter)
          content_element = create(:content_element,
                                   :heading,
                                   section: section,
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
          entry = create(:published_entry)
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
      end

      it 'also works for draft entry' do
        entry = create(:draft_entry)
        create(:scrolled_chapter, revision: entry.revision)

        result = render(helper, entry)

        expect(result).to include_json(collections: {contentElements: []})
      end

      it 'supports skipping collections' do
        entry = create(:published_entry)

        result = render(helper, entry, skip_collections: true)

        expect(JSON.parse(result)).not_to have_key('collections')
      end

      it 'renders files' do
        entry = create(:published_entry)
        image_file = create_used_file(:image_file, entry: entry)

        result = render(helper, entry)

        expect(result)
          .to include_json(collections: {
                             imageFiles: [
                               {permaId: image_file.perma_id}
                             ]
                           })
      end

      it 'supports skipping files' do
        entry = create(:published_entry)
        create_used_file(:image_file, entry: entry)

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
            .register(Pageflow::FileType.new(model: 'Pageflow::VideoFile',
                                             collection_name: 'test_files',
                                             url_templates: -> { {poster_medium: url_template} }))
        end
        entry = create(:published_entry)

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
            .register(Pageflow::FileType.new(model: 'Pageflow::VideoFile',
                                             collection_name: 'test_files'))
        end
        entry = create(:published_entry)

        result = render(helper, entry)

        expect(result)
          .to include_json(config: {
                             fileModelTypes: {
                               testFiles: 'Pageflow::VideoFile'
                             }
                           })
      end

      it 'renders entry pretty url and provider share url templates' do
        theming = create(:theming, cname: '')
        entry = Pageflow::PublishedEntry.new(create(:entry, title: 'test', theming: theming),
                                             create(:revision))

        result = render(helper, entry)

        expect(result).to include_json(config: {
                                         prettyUrl: 'http://test.host/test',
                                         shareUrlTemplates: {
                                           email: 'mailto:?body=%{url}',
                                           twitter: 'https://twitter.com/intent/tweet?url=%{url}',
                                           whats_app: 'WhatsApp://send?text=%{url}'
                                         }
                                       })
      end

      it 'renders default file rights from account' do
        account = create(:account, default_file_rights: '@WDR')
        entry = Pageflow::PublishedEntry.new(create(:entry, title: 'test', account: account),
                                             create(:revision))

        result = render(helper, entry)

        expect(result).to include_json(config: {defaultFileRights: '@WDR'})
      end

      it 'renders legal info' do
        entry = create(:published_entry)

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
        entry = create(:published_entry)

        result = render(helper, entry)

        expect(result).to include_json(config: {
                                         theme: {
                                           assets: {
                                             logoDesktop: %r{themes/default/logoDesktop.*svg$}
                                           }
                                         }
                                       })
      end

      it 'renders theme camelized options' do
        pageflow_configure do |config|
          config.themes.register(:default, some_option: 'value')
        end
        entry = create(:published_entry)

        result = render(helper, entry)

        expect(result).to include_json(config: {
                                         theme: {
                                           options: {
                                             someOption: 'value'
                                           }
                                         }
                                       })
      end

      context 'i18n' do
        include_context 'fake translations'

        it 'renders public scrolled translations by default' do
          translation(:de, 'pageflow_scrolled.public.some', 'text')
          entry = create(:published_entry, revision_attributes: {locale: 'de'})

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
          entry = create(:published_entry)

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
          entry = create(:published_entry)

          result = render(helper, entry)

          expect(result).to include_json(i18n: {
                                           locale: I18n.locale.to_s,
                                           defaultLocale: I18n.default_locale.to_s
                                         })
        end

        it 'supports skipping i18n' do
          entry = create(:published_entry)

          result = render(helper, entry, skip_i18n: true)

          expect(JSON.parse(result)).not_to have_key('i18n')
        end
      end
    end

    describe '#scrolled_entry_json_seed_script_tag' do
      it 'renders script tag which assigns seed global variable' do
        entry = create(:published_entry)
        chapter = create(:scrolled_chapter, revision: entry.revision)
        create(:section, chapter: chapter)

        result = helper.scrolled_entry_json_seed_script_tag(entry)

        expect(result).to match(%r{<script>.*pageflowScrolledRender\(\{.*\}\).*</script>}m)
      end

      it 'escapes illegal characters' do
        entry = create(:published_entry)
        chapter = create(:scrolled_chapter, revision: entry.revision)
        section = create(:section, chapter: chapter)
        create(:content_element,
               :text_block,
               section: section,
               configuration: {text: "some\u2028text"})

        result = helper.scrolled_entry_json_seed_script_tag(entry)

        expect(result).to include('some\\u2028text')
      end
    end
  end
end
