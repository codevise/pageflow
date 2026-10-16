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

    describe '#restore' do
      it 'moves section back to origin chapter at origin position' do
        entry = create(:entry, type_name: 'scrolled')
        chapter = create(:scrolled_chapter, revision: entry.draft)
        first_section = create(:section, chapter:, position: 0)
        section = create(:section, chapter:, position: 1)
        last_section = create(:section, chapter:, position: 2)
        trash = Trash.new(entry.draft)
        trash.add_section(section)

        trash.find_item(section.reload.chapter_id).restore

        expect(chapter.reload.sections).to eq([first_section, section, last_section])
      end

      it 'shifts positions of sections at or after origin position' do
        entry = create(:entry, type_name: 'scrolled')
        chapter = create(:scrolled_chapter, revision: entry.draft)
        section = create(:section, chapter:, position: 0)
        trash = Trash.new(entry.draft)
        trash.add_section(section)
        new_section = create(:section, chapter:, position: 0)

        trash.find_item(section.reload.chapter_id).restore

        expect(chapter.reload.sections.map(&:position)).to eq([0, 1])
        expect(chapter.sections).to eq([section, new_section])
      end

      it 'destroys container chapter' do
        entry = create(:entry, type_name: 'scrolled')
        section = create(:section, revision: entry.draft)
        trash = Trash.new(entry.draft)
        trash.add_section(section)

        trash.find_item(section.reload.chapter_id).restore

        expect(trash.items).to be_empty
      end

      it 'returns restored section' do
        entry = create(:entry, type_name: 'scrolled')
        section = create(:section, revision: entry.draft)
        trash = Trash.new(entry.draft)
        trash.add_section(section)

        result = trash.find_item(section.reload.chapter_id).restore

        expect(result).to eq(section)
      end

      it 'keeps perma_ids of section and its content elements' do
        entry = create(:entry, type_name: 'scrolled')
        section = create(:section, revision: entry.draft)
        content_element = create(:content_element, section:)
        trash = Trash.new(entry.draft)
        trash.add_section(section)

        trash.find_item(section.reload.chapter_id).restore

        expect(ContentElement.all_for_revision(entry.draft).map(&:perma_id))
          .to eq([content_element.perma_id])
        expect(Section.all_for_revision(entry.draft).map(&:perma_id))
          .to eq([section.perma_id])
      end

      it 'moves section to end of first chapter if origin chapter no longer exists' do
        entry = create(:entry, type_name: 'scrolled')
        storyline = Storyline.all_for_revision(entry.draft).first
        first_chapter = create(:scrolled_chapter, storyline:, position: 0)
        existing_section = create(:section, chapter: first_chapter, position: 0)
        origin_chapter = create(:scrolled_chapter, storyline:, position: 1)
        section = create(:section, chapter: origin_chapter, position: 0)
        trash = Trash.new(entry.draft)
        trash.add_section(section)
        origin_chapter.destroy

        trash.find_item(section.reload.chapter_id).restore

        expect(first_chapter.reload.sections).to eq([existing_section, section])
      end

      it 'raises if no chapter is left' do
        entry = create(:entry, type_name: 'scrolled')
        section = create(:section, revision: entry.draft)
        origin_chapter = section.chapter
        trash = Trash.new(entry.draft)
        trash.add_section(section)
        origin_chapter.destroy

        expect {
          trash.find_item(section.reload.chapter_id).restore
        }.to raise_error(Trash::DestinationMissing)
      end
    end

    describe '#items' do
      it 'returns items newest first' do
        entry = create(:entry, type_name: 'scrolled')
        chapter = create(:scrolled_chapter, revision: entry.draft)
        first_section = create(:section, chapter:)
        second_section = create(:section, chapter:)
        trash = Trash.new(entry.draft)
        trash.add_section(first_section)
        trash.add_section(second_section)

        result = Trash.new(entry.draft).items

        expect(result.map(&:id))
          .to eq([second_section.reload.chapter_id, first_section.reload.chapter_id])
      end

      it 'does not create trash storyline' do
        entry = create(:entry, type_name: 'scrolled')

        result = Trash.new(entry.draft).items

        expect(result).to be_empty
        expect(Storyline.where(revision: entry.draft, role: 'trash')).to be_empty
      end
    end
  end
end
