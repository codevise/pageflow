require 'spec_helper'

module PageflowScrolled
  RSpec.describe EntryJsonSeedHelper, type: :helper do
    describe '#scrolled_entry_json_seed' do
      def render(helper, entry)
        helper.render_json do |json|
          helper.scrolled_entry_json_seed(json, entry)
        end
      end

      it 'renders sections with id, perma_id, position and configuration' do
        entry = create(:published_entry)
        chapter = create(:scrolled_chapter, revision: entry.revision)
        section = create(:section,
                         chapter: chapter,
                         position: 4,
                         configuration: {transition: 'scroll'})

        result = render(helper, entry)

        expect(json_get(result, path: ['sections', 0, 'id'])).to eq(section.id)
        expect(json_get(result, path: ['sections', 0, 'permaId'])).to eq(section.perma_id)
        expect(json_get(result, path: ['sections', 0, 'position'])).to eq(4)
        expect(json_get(result, path: ['sections', 0, 'configuration', 'transition']))
          .to eq('scroll')
      end

      it 'orders sections according to position attribute' do
        entry = create(:published_entry)
        chapter = create(:scrolled_chapter, revision: entry.revision)
        section1 = create(:section, chapter: chapter, position: 4)
        section2 = create(:section, chapter: chapter, position: 3)

        result = render(helper, entry)

        expect(json_get(result, path: ['sections', '*', 'id'])).to eq([section2.id, section1.id])
      end

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

      it 'orders content elements according to position attribute' do
        entry = create(:published_entry)
        chapter = create(:scrolled_chapter, revision: entry.revision)
        section = create(:section, chapter: chapter)
        content_element1 = create(:content_element, section: section, position: 4)
        content_element2 = create(:content_element, section: section, position: 3)

        result = render(helper, entry)

        expect(json_get(result, path: ['contentElements', '*', 'id']))
          .to eq([content_element2.id, content_element1.id])
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
