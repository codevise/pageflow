require 'spec_helper'

module PageflowScrolled
  RSpec.describe EntryJsonSeedHelper, type: :helper do
    describe '#scrolled_entry_json_seed' do
      def render(helper, entry)
        helper.render_json do |json|
          helper.scrolled_entry_json_seed(json, entry)
        end
      end

      context 'chapters' do
        it 'renders chapters with id, perma_id, storyline_id, position and configuration' do
          entry = create(:published_entry)
          chapter = create(:scrolled_chapter, revision: entry.revision, position: 3)

          result = render(helper, entry)

          expect(json_get(result, path: ['chapters', 0, 'id'])).to eq(chapter.id)
          expect(json_get(result, path: ['chapters', 0, 'permaId'])).to eq(chapter.perma_id)
          expect(json_get(result, path: ['chapters', 0, 'storylineId'])).to eq(chapter.storyline_id)
          expect(json_get(result, path: ['chapters', 0, 'position'])).to eq(3)
          expect(json_get(result, path: ['chapters', 0, 'configuration', 'title']))
            .to eq('chapter title')
        end

        it 'orders chapters according to position attribute' do
          entry = create(:published_entry)
          chapter1 = create(:scrolled_chapter, revision: entry.revision, position: 4)
          chapter2 = create(:scrolled_chapter, revision: entry.revision, position: 3)

          result = render(helper, entry)

          expect(json_get(result, path: ['chapters', '*', 'id'])).to eq([chapter2.id, chapter1.id])
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

          expect(json_get(result, path: ['sections', 0, 'id'])).to eq(section.id)
          expect(json_get(result, path: ['sections', 0, 'permaId'])).to eq(section.perma_id)
          expect(json_get(result, path: ['sections', 0, 'chapterId'])).to eq(section.chapter_id)
          expect(json_get(result, path: ['sections', 0, 'position'])).to eq(4)
          expect(json_get(result, path: ['sections', 0, 'configuration', 'transition']))
            .to eq('scroll')
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

          expect(json_get(result, path: ['sections', '*', 'id']))
            .to eq([section11.id, section12.id, section21.id, section22.id])
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

          expect(json_get(result, path: ['contentElements', 0, 'id'])).to eq(content_element.id)
          expect(json_get(result, path: ['contentElements', 0, 'permaId']))
            .to eq(content_element.perma_id)
          expect(json_get(result, path: ['contentElements', 0, 'typeName'])).to eq('heading')
          expect(json_get(result, path: ['contentElements', 0, 'sectionId'])).to eq(section.id)
          expect(json_get(result, path: ['contentElements', 0, 'position'])).to eq(4)
          expect(json_get(result, path: ['contentElements', 0, 'configuration', 'text']))
            .to eq('Heading')
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

          expect(json_get(result, path: ['contentElements', '*', 'id']))
            .to eq([content_element111.id, content_element112.id,
                    content_element121.id, content_element122.id,
                    content_element211.id, content_element212.id,
                    content_element221.id, content_element222.id])
        end
      end

      it 'also works for draft entry' do
        entry = create(:draft_entry)
        create(:scrolled_chapter, revision: entry.revision)

        result = render(helper, entry)

        expect(json_get(result, path: ['contentElements'])).to be_a(Array)
      end
    end

    describe '#scrolled_entry_json_seed_script_tag' do
      it 'renders script tag which assigns seed global variable' do
        entry = create(:published_entry)
        chapter = create(:scrolled_chapter, revision: entry.revision)
        create(:section, chapter: chapter)

        result = helper.scrolled_entry_json_seed_script_tag(entry)

        expect(result).to match(%r{<script>.*pageflowScrolledSeed = \{.*\}.*</script>}m)
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
