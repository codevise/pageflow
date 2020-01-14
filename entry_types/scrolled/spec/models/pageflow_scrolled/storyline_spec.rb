require 'spec_helper'

module PageflowScrolled
  RSpec.describe Storyline do
    context 'as registered RevisionComponent' do
      it 'copies a duplicate of itself to new revision' do
        Pageflow.config.revision_components.register(Storyline)
        revision = create(:revision)
        storyline = Storyline.create!(revision: revision,
                                      configuration: {'some' => 'value'})

        copied_revision = revision.copy

        copied_storylines = Storyline.all_for_revision(copied_revision)
        expect(copied_storylines).not_to be_empty
        expect(copied_storylines.first).not_to eq(storyline)
        expect(copied_storylines.first.configuration['some']).to eq('value')
      end
    end

    describe '#copy_to' do
      it 'copies chapters to new revision' do
        revision = create(:revision)
        storyline = create(:scrolled_storyline, revision: revision)
        chapter = create(:scrolled_chapter,
                         storyline: storyline,
                         configuration: {'title' => 'Intro chapter'})

        other_revision = create(:revision)
        storyline.copy_to(other_revision)

        copied_chapters = Chapter.all_for_revision(other_revision)
        expect(copied_chapters).not_to be_empty
        expect(copied_chapters.count).to eq(1)
        expect(copied_chapters.first).not_to eq(chapter)
        expect(copied_chapters.first.configuration['title']).to eq('Intro chapter')
      end

      it 'copies sections to new revision' do
        revision = create(:revision)
        storyline = create(:scrolled_storyline, revision: revision)
        chapter = create(:scrolled_chapter, storyline: storyline)
        section = create(:section,
                         chapter: chapter,
                         configuration: {transition: 'beam'})

        other_revision = create(:revision)
        storyline.copy_to(other_revision)

        copied_sections = Section.all_for_revision(other_revision)
        expect(copied_sections).not_to be_empty
        expect(copied_sections.count).to eq(1)
        expect(copied_sections.first).not_to eq(section)
        expect(copied_sections.first.configuration['transition']).to eq('beam')
      end

      it 'copies content elements to new revision' do
        revision = create(:revision)
        storyline = create(:scrolled_storyline, revision: revision)
        chapter = create(:scrolled_chapter, storyline: storyline)
        section = create(:section, chapter: chapter)
        content_element = create(:content_element, :heading,
                                 section: section,
                                 configuration: {children: 'Introduction'})

        other_revision = create(:revision)
        storyline.copy_to(other_revision)

        copied_content_elements = ContentElement.all_for_revision(other_revision)
        expect(copied_content_elements).not_to be_empty
        expect(copied_content_elements.count).to eq(1)
        expect(copied_content_elements.first).not_to eq(content_element)
        expect(copied_content_elements.first.configuration['children']).to eq('Introduction')
      end
    end
  end
end
