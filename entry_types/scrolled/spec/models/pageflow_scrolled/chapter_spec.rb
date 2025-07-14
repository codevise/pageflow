require 'spec_helper'

module PageflowScrolled
  RSpec.describe Chapter do
    it 'creates a main storyline if none exists' do
      chapter = create(:scrolled_chapter)
      expect(chapter.storyline).to be_present
    end

    it 'is attached to the main storyline for subsequent chapters in the same revision' do
      revision = create(:revision)
      chapter1 = create(:scrolled_chapter, revision:)
      chapter2 = create(:scrolled_chapter, revision:)
      expect(chapter1.storyline).to eq(chapter2.storyline)
    end

    describe '.all_for_revision' do
      it 'returns all chapters in revision' do
        revision = create(:revision)
        chapter1 = create(:scrolled_chapter, revision:)
        chapter2 = create(:scrolled_chapter, revision:)
        other_revision = create(:revision)
        create(:scrolled_chapter, revision: other_revision)

        result = Chapter.all_for_revision(revision)

        expect(result).to eq([chapter1, chapter2])
      end
    end

    describe '.create_section' do
      it 'inserts sections and updates positions' do
        revision = create(:revision)
        chapter = create(:scrolled_chapter, revision:)
        section1 = create(:section, chapter:, position: 0)
        section2 = create(:section, chapter:, position: 1)

        new_section = chapter.create_section(position: 1,
                                             configuration: {transition: 'fade'})

        expect(chapter.sections).to eq([section1, new_section, section2])
        expect(chapter.sections.map(&:position)).to eq([0, 1, 2])
      end

      it 'creates initial text block' do
        revision = create(:revision)
        chapter = create(:scrolled_chapter, revision:)

        section = chapter.create_section

        expect(section.content_elements.map(&:type_name)).to eq(['textBlock'])
      end
    end

    describe '.duplicate_section' do
      it 'creates section and content elements' do
        revision = create(:revision)
        chapter = create(:scrolled_chapter, revision:)
        section = create(:section, chapter:, position: 0)
        create(:content_element, section:, type_name: 'textBlock')

        new_section = chapter.duplicate_section(section)

        expect(chapter.sections).to eq([section, new_section])
        expect(new_section.content_elements.map(&:type_name)).to eq(['textBlock'])
        expect(chapter.sections.map(&:position)).to eq([0, 1])
      end

      it 'returns section with shifted position' do
        revision = create(:revision)
        chapter = create(:scrolled_chapter, revision:)
        section = create(:section, chapter:, position: 0)

        new_section = chapter.duplicate_section(section)

        expect(new_section.position).to eq(1)
      end
    end
  end
end
