require 'spec_helper'

module PageflowScrolled
  RSpec.describe EntryJsonSeedHelper, type: :helper do
    describe '#entry_json_seed' do
      it 'renders an array of sections' do
        revision = create(:scrolled_revision, :published)
        entry = PageflowScrolled::PublishedEntry.new(
          create(:entry, published_revision: revision)
        )
        result = helper.entry_json_seed(entry)

        expect(json_get(result)).to be_a(Array)
      end

      it 'groups the sections content elements as array under "foreground""-key' do
        revision = create(:scrolled_revision, :published)
        section = create(:section, revision: revision)
        create(:heading, section: section)
        entry = PageflowScrolled::PublishedEntry.new(
          create(:entry, published_revision: revision)
        )
        result = helper.entry_json_seed(entry)

        expect(json_get(result, path: ['foreground'])).to be_a(Array)
      end
    end

    describe '#sections_seed' do
      it 'returns the section configuration' do
        revision = create(:scrolled_revision, :published)
        section = create(:section, revision: revision)
        result = helper.sections_seed(section)

        expect(result).to eq(section.configuration)
      end
    end

    describe '#section_content_elements_seed' do
      it 'returns a hash with :foreground key' do
        revision = create(:scrolled_revision, :published)
        section = create(:section, revision: revision)
        create(:heading, section: section)
        result = helper.section_content_elements_seed(section)

        expect(result[:foreground]).to be_present
      end

      it 'specifies the components type from content elements type_name attribute' do
        revision = create(:scrolled_revision, :published)
        section = create(:section, revision: revision)
        heading = create(:heading, section: section)

        result = helper.section_content_elements_seed(section)

        expect(result[:foreground][0][:type]).to eql(heading.type_name)
      end

      it 'specifies the components props from content elements configuration attribute' do
        revision = create(:scrolled_revision, :published)
        section = create(:section, revision: revision)
        heading = create(:heading, section: section)

        result = helper.section_content_elements_seed(section)

        expect(result[:foreground][0][:props]).to eql(heading.configuration)
      end
    end
  end
end
