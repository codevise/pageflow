require 'spec_helper'

module PageflowScrolled
  RSpec.describe EntryJsonSeedHelper, type: :helper do
    describe '#scrolled_entry_json_seed' do
      it 'renders an array of sections' do
        revision = create(:revision, :published)
        entry = Pageflow::PublishedEntry.new(
          create(:entry, published_revision: revision)
        )
        result = helper.scrolled_entry_json_seed(entry)

        expect(json_get(result)).to be_a(Array)
      end

      it 'groups the sections content elements as array under "foreground"-key' do
        revision = create(:revision, :published)
        section = create(:section, revision: revision)
        create(:content_element, :heading, section: section)
        entry = Pageflow::PublishedEntry.new(
          create(:entry, published_revision: revision)
        )
        result = helper.scrolled_entry_json_seed(entry)

        expect(json_get(result, path: [0, 'foreground'])).to be_a(Array)
      end

      it 'returns the section configuration' do
        revision = create(:revision, :published)
        section = create(:section, revision: revision)
        entry = Pageflow::PublishedEntry.new(
          create(:entry, published_revision: revision)
        )
        result = helper.scrolled_entry_json_seed(entry)

        expect(json_get(result, path: [0])).to include(section.configuration)
      end

      it 'specifies the components type from content elements type_name attribute' do
        revision = create(:revision, :published)
        section = create(:section, revision: revision)
        heading = create(:content_element, :heading, section: section)
        entry = Pageflow::PublishedEntry.new(
          create(:entry, published_revision: revision)
        )
        result = helper.scrolled_entry_json_seed(entry)

        expect(json_get(result, path: [0, 'foreground', 0, 'type'])).to eql(heading.type_name)
      end

      it 'specifies the components props from content elements configuration attribute' do
        revision = create(:revision, :published)
        section = create(:section, revision: revision)
        heading = create(:content_element, :heading, section: section)
        entry = Pageflow::PublishedEntry.new(
          create(:entry, published_revision: revision)
        )
        result = helper.scrolled_entry_json_seed(entry)

        expect(json_get(result, path: [0, 'foreground', 0, 'props'])).to eql(heading.configuration)
      end

      it 'converts the "position"-configuration to top-level prop' do
        revision = create(:revision, :published)
        section = create(:section, revision: revision)
        create(:content_element,
               :text_block,
               section: section,
               configuration: {position: 'full'})
        entry = Pageflow::PublishedEntry.new(
          create(:entry, published_revision: revision)
        )
        result = helper.scrolled_entry_json_seed(entry)

        expect(json_get(result, path: [0, 'foreground', 0, 'position'])).to eql('full')
      end
    end
  end
end
