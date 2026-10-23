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

    describe '#add_chapter' do
      it 'removes chapter and its sections from revision' do
        entry = create(:entry, type_name: 'scrolled')
        chapter = create(:scrolled_chapter, revision: entry.draft)
        create(:section, chapter:)

        Trash.new(entry.draft).add_chapter(chapter)

        expect(Chapter.all_for_revision(entry.draft)).to be_empty
        expect(Section.all_for_revision(entry.draft)).to be_empty
      end

      it 'moves chapter into trash storyline without container' do
        entry = create(:entry, type_name: 'scrolled')
        chapter = create(:scrolled_chapter, revision: entry.draft)
        section = create(:section, chapter:)

        Trash.new(entry.draft).add_chapter(chapter)

        expect(chapter.reload.storyline)
          .to eq(Storyline.find_or_create_trash_for(entry.draft))
        expect(section.reload.chapter).to eq(chapter)
      end

      it 'records kind, origin and trash time next to chapter configuration' do
        entry = create(:entry, type_name: 'scrolled')
        storyline = Storyline.all_for_revision(entry.draft).first
        create(:scrolled_chapter, storyline:, position: 0)
        chapter = create(:scrolled_chapter, storyline:, position: 1,
                                            configuration: {'title' => 'Intro'})

        travel_to(Time.utc(2026, 10, 1, 12)) do
          Trash.new(entry.draft).add_chapter(chapter)
        end

        expect(chapter.reload.configuration).to eq(
          'title' => 'Intro',
          'trash' => {
            'kind' => 'chapter',
            'originPermaId' => storyline.perma_id,
            'originPosition' => 1,
            'trashedAt' => '2026-10-01T12:00:00Z'
          }
        )
      end

      it 'appends chapter after existing items' do
        entry = create(:entry, type_name: 'scrolled')
        section = create(:section, revision: entry.draft)
        chapter = create(:scrolled_chapter, revision: entry.draft)
        trash = Trash.new(entry.draft)

        trash.add_section(section)
        trash.add_chapter(chapter)

        expect(trash.items.map(&:id)).to eq([chapter.id, section.reload.chapter_id])
      end

      it 'keeps perma_ids of chapter and its sections' do
        entry = create(:entry, type_name: 'scrolled')
        chapter = create(:scrolled_chapter, revision: entry.draft)
        section = create(:section, chapter:)

        expect {
          Trash.new(entry.draft).add_chapter(chapter)
        }.not_to(change { [chapter.reload.perma_id, section.reload.perma_id] })
      end
    end

    describe '#add_content_elements' do
      it 'moves content elements into container section keeping their order' do
        entry = create(:entry, type_name: 'scrolled')
        section = create(:section, revision: entry.draft)
        first = create(:content_element, section:, position: 0)
        second = create(:content_element, section:, position: 1)

        Trash.new(entry.draft).add_content_elements([first, second],
                                                    origin_section: section,
                                                    origin_position: 0)

        container_section = first.reload.section
        expect(container_section.chapter.storyline)
          .to eq(Storyline.find_or_create_trash_for(entry.draft))
        expect(container_section.content_elements).to eq([first, second.reload])
        expect(section.reload.content_elements).to be_empty
      end

      it 'records kind, origin section and position in container chapter configuration' do
        entry = create(:entry, type_name: 'scrolled')
        section = create(:section, revision: entry.draft)
        content_element = create(:content_element, section:)

        travel_to(Time.utc(2026, 10, 1, 12)) do
          Trash.new(entry.draft).add_content_elements([content_element],
                                                      origin_section: section,
                                                      origin_position: 2)
        end

        expect(content_element.reload.section.chapter.configuration['trash']).to eq(
          'kind' => 'contentElements',
          'originPermaId' => section.perma_id,
          'originPosition' => 2,
          'trashedAt' => '2026-10-01T12:00:00Z'
        )
      end

      it 'copies invert and layout of origin section to container section' do
        entry = create(:entry, type_name: 'scrolled')
        section = create(:section, revision: entry.draft,
                                   configuration: {'invert' => true,
                                                   'layout' => 'right',
                                                   'backdrop' => {'image' => 5}})
        content_element = create(:content_element, section:)

        Trash.new(entry.draft).add_content_elements([content_element],
                                                    origin_section: section,
                                                    origin_position: 0)

        expect(content_element.reload.section.configuration)
          .to eq('invert' => true, 'layout' => 'right')
      end

      it 'keeps perma_ids of content elements' do
        entry = create(:entry, type_name: 'scrolled')
        section = create(:section, revision: entry.draft)
        content_element = create(:content_element, section:)

        expect {
          Trash.new(entry.draft).add_content_elements([content_element],
                                                      origin_section: section,
                                                      origin_position: 0)
        }.not_to(change { content_element.reload.perma_id })
      end
    end

    describe '#restore with trashed section' do
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

    describe '#restore with trashed chapter' do
      it 'moves chapter back to origin storyline at origin position' do
        entry = create(:entry, type_name: 'scrolled')
        storyline = Storyline.all_for_revision(entry.draft).first
        first_chapter = create(:scrolled_chapter, storyline:, position: 0)
        chapter = create(:scrolled_chapter, storyline:, position: 1)
        last_chapter = create(:scrolled_chapter, storyline:, position: 2)
        trash = Trash.new(entry.draft)
        trash.add_chapter(chapter)

        trash.find_item(chapter.id).restore

        expect(storyline.reload.chapters).to eq([first_chapter, chapter, last_chapter])
      end

      it 'shifts positions of chapters at or after origin position' do
        entry = create(:entry, type_name: 'scrolled')
        storyline = Storyline.all_for_revision(entry.draft).first
        chapter = create(:scrolled_chapter, storyline:, position: 0)
        trash = Trash.new(entry.draft)
        trash.add_chapter(chapter)
        new_chapter = create(:scrolled_chapter, storyline:, position: 0)

        trash.find_item(chapter.id).restore

        expect(storyline.reload.chapters.map(&:position)).to eq([0, 1])
        expect(storyline.chapters).to eq([chapter, new_chapter])
      end

      it 'restores excursion chapters to excursions storyline' do
        entry = create(:entry, type_name: 'scrolled')
        excursions = Storyline.all_for_revision(entry.draft).find_by(role: 'excursions')
        chapter = create(:scrolled_chapter, storyline: excursions)
        trash = Trash.new(entry.draft)
        trash.add_chapter(chapter)

        trash.find_item(chapter.id).restore

        expect(chapter.reload.storyline).to eq(excursions)
      end

      it 'clears trash metadata and keeps chapter configuration' do
        entry = create(:entry, type_name: 'scrolled')
        chapter = create(:scrolled_chapter, revision: entry.draft,
                                            configuration: {'title' => 'Intro'})
        trash = Trash.new(entry.draft)
        trash.add_chapter(chapter)

        trash.find_item(chapter.id).restore

        expect(chapter.reload.configuration).to eq('title' => 'Intro')
      end

      it 'keeps sections and returns restored chapter' do
        entry = create(:entry, type_name: 'scrolled')
        chapter = create(:scrolled_chapter, revision: entry.draft)
        section = create(:section, chapter:)
        trash = Trash.new(entry.draft)
        trash.add_chapter(chapter)

        result = trash.find_item(chapter.id).restore

        expect(result).to eq(chapter)
        expect(Section.all_for_revision(entry.draft)).to eq([section])
      end
    end

    describe '#restore with trashed content elements' do
      it 'moves content elements back to origin section at origin position' do
        entry = create(:entry, type_name: 'scrolled')
        section = create(:section, revision: entry.draft)
        first = create(:content_element, section:, position: 0)
        trashed = create_list(:content_element, 2, section:)
        trash = Trash.new(entry.draft)
        trash.add_content_elements(trashed, origin_section: section, origin_position: 1)
        last = create(:content_element, section:, position: 1)

        trash.find_item(trashed.first.reload.section.chapter_id).restore

        expect(section.reload.content_elements).to eq([first, *trashed, last])
        expect(section.content_elements.map(&:position)).to eq([0, 1, 2, 3])
      end

      it 'destroys container chapter and section' do
        entry = create(:entry, type_name: 'scrolled')
        section = create(:section, revision: entry.draft)
        content_element = create(:content_element, section:)
        trash = Trash.new(entry.draft)
        trash.add_content_elements([content_element], origin_section: section,
                                                      origin_position: 0)
        container_section = content_element.reload.section

        trash.find_item(container_section.chapter_id).restore

        expect(trash.items).to be_empty
        expect(Section.exists?(container_section.id)).to eq(false)
      end

      it 'returns restored content elements keeping their perma_ids' do
        entry = create(:entry, type_name: 'scrolled')
        section = create(:section, revision: entry.draft)
        content_element = create(:content_element, section:)
        trash = Trash.new(entry.draft)
        trash.add_content_elements([content_element], origin_section: section,
                                                      origin_position: 0)

        result = trash.find_item(content_element.reload.section.chapter_id).restore

        expect(result).to eq([content_element])
        expect(result.first.perma_id).to eq(content_element.perma_id)
      end

      it 'appends content elements to first section if origin section has been trashed' do
        entry = create(:entry, type_name: 'scrolled')
        first_section = create(:section, revision: entry.draft)
        existing = create(:content_element, section: first_section, position: 0)
        section = create(:section, chapter: first_section.chapter, position: 1)
        content_element = create(:content_element, section:)
        trash = Trash.new(entry.draft)
        trash.add_content_elements([content_element], origin_section: section,
                                                      origin_position: 0)
        trash.add_section(section)

        trash.find_item(content_element.reload.section.chapter_id).restore

        expect(first_section.reload.content_elements).to eq([existing, content_element])
      end

      it 'raises if no section is left' do
        entry = create(:entry, type_name: 'scrolled')
        section = create(:section, revision: entry.draft)
        content_element = create(:content_element, section:)
        trash = Trash.new(entry.draft)
        trash.add_content_elements([content_element], origin_section: section,
                                                      origin_position: 0)
        trash.add_section(section)

        expect {
          trash.find_item(content_element.reload.section.chapter_id).restore
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
