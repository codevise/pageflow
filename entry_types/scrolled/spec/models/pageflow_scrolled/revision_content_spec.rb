require 'spec_helper'

module PageflowScrolled
  RSpec.describe RevisionContent do
    describe '#main_storyline' do
      it 'returns storyline marked as main' do
        revision = create(:revision)
        create(:scrolled_storyline, revision:, position: 0, configuration: {})
        main_storyline = create(:scrolled_storyline,
                                revision:,
                                position: 1,
                                configuration: {main: true})

        expect(RevisionContent.new(revision).main_storyline).to eq(main_storyline)
      end

      it 'returns nil if no storyline is marked as main' do
        revision = create(:revision)
        create(:scrolled_storyline, revision:, configuration: {})

        expect(RevisionContent.new(revision).main_storyline).to be_nil
      end
    end

    describe '#chapters' do
      it 'skips chapters that only contain hidden sections' do
        revision = create(:revision)
        chapter1 = create(:scrolled_chapter, revision:, position: 1)
        create(:section, chapter: chapter1, configuration: {hidden: true})
        chapter2 = create(:scrolled_chapter, revision:, position: 2)
        create(:section, chapter: chapter2, configuration: {hidden: true})
        create(:section, chapter: chapter2)
        chapter3 = create(:scrolled_chapter, revision:, position: 3)

        result = RevisionContent.new(revision).chapters

        expect(result).to eq([chapter2, chapter3])
      end

      it 'includes chapters that only contain hidden sections if requested' do
        revision = create(:revision)
        chapter = create(:scrolled_chapter, revision:)
        create(:section, chapter:, configuration: {hidden: true})

        result = RevisionContent.new(revision, include_hidden: true).chapters

        expect(result).to eq([chapter])
      end
    end

    describe '#chapter_slug_for' do
      it 'computes slugs of chapters' do
        revision = create(:revision)
        chapters = [
          create(:scrolled_chapter, revision:, position: 1, configuration: {title: 'Intro'}),
          create(:scrolled_chapter, revision:, position: 2, configuration: {title: 'Intro'})
        ]

        content = RevisionContent.new(revision)

        expect(content.chapter_slug_for(chapters[0])).to eq('intro')
        expect(content.chapter_slug_for(chapters[1])).to eq("intro-#{chapters[1].perma_id}")
      end

      it 'takes chapters with only hidden sections into account' do
        revision = create(:revision)
        hidden_chapter = create(:scrolled_chapter,
                                revision:, position: 1, configuration: {title: 'Intro'})
        create(:section, chapter: hidden_chapter, configuration: {hidden: true})
        chapter = create(:scrolled_chapter,
                         revision:, position: 2, configuration: {title: 'Intro'})

        content = RevisionContent.new(revision)

        expect(content.chapter_slug_for(chapter)).to eq("intro-#{chapter.perma_id}")
      end
    end

    describe '#sections' do
      it 'skips hidden sections' do
        revision = create(:revision)
        chapter = create(:scrolled_chapter, revision:)
        section = create(:section, chapter:, position: 1)
        create(:section, chapter:, position: 2, configuration: {hidden: true})

        expect(RevisionContent.new(revision).sections).to eq([section])
      end

      it 'includes hidden sections if requested' do
        revision = create(:revision)
        chapter = create(:scrolled_chapter, revision:)
        sections = [
          create(:section, chapter:, position: 1),
          create(:section, chapter:, position: 2, configuration: {hidden: true})
        ]

        expect(RevisionContent.new(revision, include_hidden: true).sections).to eq(sections)
      end

      it 'only includes sections before cutoff section if requested' do
        revision = create(:revision)
        chapter = create(:scrolled_chapter, revision:)
        section = create(:section, chapter:, position: 1)
        cutoff_section = create(:section, chapter:, position: 2)
        revision.update!(configuration: {'cutoff_section_perma_id' => cutoff_section.perma_id})

        expect(RevisionContent.new(revision, cutoff: true).sections).to eq([section])
      end
    end

    describe '#content_elements' do
      it 'returns content elements of sections' do
        revision = create(:revision)
        chapter = create(:scrolled_chapter, revision:)
        content_element = create(:content_element, section: create(:section, chapter:))
        create(:content_element,
               section: create(:section, chapter:, configuration: {hidden: true}))

        expect(RevisionContent.new(revision).content_elements).to eq([content_element])
      end
    end

    describe '#storylines' do
      it 'returns storylines of revision' do
        revision = create(:revision)
        storyline = create(:scrolled_storyline, revision:)

        expect(RevisionContent.new(revision).storylines).to include(storyline)
      end
    end
  end
end
