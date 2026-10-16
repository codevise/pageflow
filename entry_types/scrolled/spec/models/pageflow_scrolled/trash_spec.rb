require 'spec_helper'

module PageflowScrolled
  RSpec.describe Trash do
    include ActiveSupport::Testing::TimeHelpers

    describe '#add_section' do
      it 'removes section from revision' do
        entry = create(:entry, type_name: 'scrolled')
        section = create(:section, revision: entry.draft)

        Trash.new(entry.draft).add_section(section)

        expect(Section.all_for_revision(entry.draft)).to be_empty
      end

      it 'moves section into container chapter in trash storyline' do
        entry = create(:entry, type_name: 'scrolled')
        section = create(:section, revision: entry.draft)

        Trash.new(entry.draft).add_section(section)

        expect(section.reload.chapter.storyline)
          .to eq(Storyline.find_or_create_trash_for(entry.draft))
      end

      it 'records kind, origin and trash time in container chapter configuration' do
        entry = create(:entry, type_name: 'scrolled')
        chapter = create(:scrolled_chapter, revision: entry.draft)
        create(:section, chapter:, position: 0)
        section = create(:section, chapter:, position: 1)

        travel_to(Time.utc(2026, 10, 1, 12)) do
          Trash.new(entry.draft).add_section(section)
        end

        expect(section.reload.chapter.configuration['trash']).to eq(
          'kind' => 'section',
          'originPermaId' => chapter.perma_id,
          'originPosition' => 1,
          'trashedAt' => '2026-10-01T12:00:00Z'
        )
      end

      it 'appends container chapters after existing items' do
        entry = create(:entry, type_name: 'scrolled')
        chapter = create(:scrolled_chapter, revision: entry.draft)
        first_section = create(:section, chapter:)
        second_section = create(:section, chapter:)
        trash = Trash.new(entry.draft)

        trash.add_section(first_section)
        trash.add_section(second_section)

        expect(second_section.reload.chapter.position)
          .to be > first_section.reload.chapter.position
      end

      it 'keeps perma_ids of section and its content elements' do
        entry = create(:entry, type_name: 'scrolled')
        section = create(:section, revision: entry.draft)
        content_element = create(:content_element, section:)

        expect {
          Trash.new(entry.draft).add_section(section)
        }.not_to(change { [section.reload.perma_id, content_element.reload.perma_id] })
      end
    end
  end
end
