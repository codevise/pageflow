require 'spec_helper'

module PageflowScrolled
  RSpec.describe Storyline do
    context 'as registered RevisionComponent' do
      it 'is created by default for drafts of new scrolled entries' do
        entry = create(:entry, type_name: 'scrolled')

        storylines = Storyline.all_for_revision(entry.draft)

        expect(storylines).to have(2).items
        expect(storylines.map(&:position)).to eq([0, 1])
      end

      it 'assigns main and excursions roles to default storylines' do
        entry = create(:entry, type_name: 'scrolled')

        storylines = Storyline.all_for_revision(entry.draft)

        expect(storylines.map(&:role)).to eq(%w[main excursions])
      end

      it 'copies a duplicate of itself to new revision' do
        Pageflow.config.revision_components.register(Storyline)
        revision = create(:revision)
        storyline = Storyline.create!(revision:,
                                      configuration: {'some' => 'value'})

        copied_revision = revision.copy

        copied_storylines = Storyline.all_for_revision(copied_revision)
        expect(copied_storylines).not_to be_empty
        expect(copied_storylines.first).not_to eq(storyline)
        expect(copied_storylines.first.configuration['some']).to eq('value')
      end

      it 'removes trash storyline with its content from published revisions' do
        entry = create(:entry, type_name: 'scrolled')
        create_trashed_section(entry.draft)

        entry.publish(creator: create(:user))

        published_revision = entry.reload.published_revision
        expect(Storyline.where(revision: published_revision, role: 'trash')).to be_empty
        expect(Chapter.joins(:storyline)
                 .where(pageflow_scrolled_storylines: {revision_id: published_revision}))
          .to have(0).items
      end

      it 'removes trash storyline from duplicated entries' do
        entry = create(:entry, type_name: 'scrolled')
        create_trashed_section(entry.draft)

        duplicate = entry.duplicate

        expect(Storyline.where(revision: duplicate.draft, role: 'trash')).to be_empty
      end

      it 'removes trash storyline from revisions copied without purpose' do
        entry = create(:entry, type_name: 'scrolled')
        create_trashed_section(entry.draft)

        copied_revision = entry.draft.copy

        expect(Storyline.where(revision: copied_revision, role: 'trash')).to be_empty
      end

      it 'keeps trash storyline in snapshots' do
        entry = create(:entry, type_name: 'scrolled')
        create_trashed_section(entry.draft)

        snapshot = entry.snapshot(creator: create(:user))

        expect(Storyline.where(revision: snapshot, role: 'trash')).to have(1).item
      end

      it 'restores trash of snapshot with configuration of trashed chapters' do
        entry = create(:entry, type_name: 'scrolled')
        section = create_trashed_section(
          entry.draft,
          chapter_configuration: {'trashedAt' => '2026-10-01T12:00:00Z'}
        )
        snapshot = entry.snapshot(creator: create(:user))
        section.chapter.destroy

        entry.restore(revision: snapshot, creator: create(:user))

        trash_storyline = Storyline.find_by(revision: entry.reload.draft, role: 'trash')
        expect(trash_storyline.chapters.first.configuration)
          .to include('trashedAt' => '2026-10-01T12:00:00Z')
      end
    end

    def create_trashed_section(revision, chapter_configuration: {})
      trash_storyline = Storyline.find_or_create_trash_for(revision)
      chapter = create(:scrolled_chapter,
                       storyline: trash_storyline,
                       configuration: chapter_configuration)
      create(:section, chapter:)
    end

    describe '.all_for_revision' do
      it 'excludes trash storyline' do
        entry = create(:entry, type_name: 'scrolled')
        Storyline.find_or_create_trash_for(entry.draft)

        storylines = Storyline.all_for_revision(entry.draft)

        expect(storylines.map(&:role)).to eq(%w[main excursions])
      end

      it 'includes storylines without role' do
        revision = create(:revision)
        storyline = create(:scrolled_storyline, revision:, role: nil)

        storylines = Storyline.all_for_revision(revision)

        expect(storylines).to eq([storyline])
      end
    end

    describe '.find_or_create_trash_for' do
      it 'creates trash storyline after existing storylines' do
        entry = create(:entry, type_name: 'scrolled')

        trash_storyline = Storyline.find_or_create_trash_for(entry.draft)

        expect(trash_storyline).to have_attributes(role: 'trash', position: 2)
      end

      it 'returns existing trash storyline' do
        entry = create(:entry, type_name: 'scrolled')
        trash_storyline = Storyline.find_or_create_trash_for(entry.draft)

        result = Storyline.find_or_create_trash_for(entry.draft)

        expect(result).to eq(trash_storyline)
      end
    end

    describe '#role' do
      it 'returns stored role' do
        storyline = build(:scrolled_storyline, role: 'trash', configuration: {'main' => true})

        expect(storyline.role).to eq('trash')
      end

      it 'falls back to main for storylines with main flag' do
        storyline = build(:scrolled_storyline, role: nil, configuration: {'main' => true})

        expect(storyline.role).to eq('main')
      end

      it 'falls back to excursions for other storylines' do
        storyline = build(:scrolled_storyline, role: nil, configuration: {})

        expect(storyline.role).to eq('excursions')
      end
    end
  end
end
