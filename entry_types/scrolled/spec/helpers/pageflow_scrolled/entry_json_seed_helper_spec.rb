require 'spec_helper'

module PageflowScrolled
  RSpec.describe EntryJsonSeedHelper, type: :helper do
    describe '#scrolled_entry_json_seed' do
      def render(helper, entry)
        helper.render_json do |json|
          helper.scrolled_entry_json_seed(json, entry)
        end
      end

      it 'renders an array of sections' do
        entry = create(:published_entry)

        result = render(helper, entry)

        expect(json_get(result)).to be_a(Array)
      end

      it 'groups the sections content elements as array under "foreground"-key' do
        entry = create(:published_entry)
        section = create(:section, revision: entry.revision)
        create(:content_element, :heading, section: section)

        result = render(helper, entry)

        expect(json_get(result, path: [0, 'foreground'])).to be_a(Array)
      end

      it 'returns the section configuration' do
        entry = create(:published_entry)
        section = create(:section, revision: entry.revision)

        result = render(helper, entry)

        expect(json_get(result, path: [0])).to include(section.configuration)
      end

      it 'specifies the components type from content elements type_name attribute' do
        entry = create(:published_entry)
        section = create(:section, revision: entry.revision)
        heading = create(:content_element, :heading, section: section)

        result = render(helper, entry)

        expect(json_get(result, path: [0, 'foreground', 0, 'type'])).to eql(heading.type_name)
      end

      it 'specifies the components props from content elements configuration attribute' do
        entry = create(:published_entry)
        section = create(:section, revision: entry.revision)
        heading = create(:content_element, :heading, section: section)

        result = render(helper, entry)

        expect(json_get(result, path: [0, 'foreground', 0, 'props'])).to eql(heading.configuration)
      end

      it 'converts the "position"-configuration to top-level prop' do
        entry = create(:published_entry)
        section = create(:section, revision: entry.revision)
        create(:content_element,
               :text_block,
               section: section,
               configuration: {position: 'full'})

        result = render(helper, entry)

        expect(json_get(result, path: [0, 'foreground', 0, 'position'])).to eql('full')
      end

      it 'also works for draft entry' do
        entry = create(:draft_entry)

        result = render(helper, entry)

        expect(json_get(result)).to be_a(Array)
      end
    end

    describe '#scrolled_entry_json_seed_script_tag' do
      it 'renders script tag which assigns seed global variable' do
        entry = create(:published_entry)
        create(:section, revision: entry.revision)

        result = helper.scrolled_entry_json_seed_script_tag(entry)

        expect(result).to match(%r{<script>.*pageflowScrolledSeed = \[\{.*\}\].*</script>}m)
      end

      it 'escapes illegal characters' do
        entry = create(:published_entry)
        section = create(:section, revision: entry.revision)
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
