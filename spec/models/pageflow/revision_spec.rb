require 'spec_helper'

module Pageflow
  describe Revision do
    describe '#creator attribute' do
      it 'is required for published revisions' do
        revision = build(:revision, :published, :creator => nil)

        expect(revision).to have(1).errors_on(:creator)
      end

      it 'is not required for draft revisions' do
        revision = build(:revision, :creator => nil)

        expect(revision).to have(:no).errors_on(:creator)
      end
    end

    describe '#published_until attribute' do
      it 'must not be present if published_at is not present' do
        revision = build(:revision, :published_at => nil, :published_until => 2.days.ago)

        expect(revision).to have(1).errors_on(:published_until)
      end

      it 'must not change if revision is depublished' do
        revision = create(:revision, :depublished, :published_until => 2.days.ago)
        revision.published_until = 1.day.from_now

        expect(revision).to have(1).errors_on(:published_until)
      end

      it 'can change if revision is published' do
        revision = create(:revision, :published, :published_until => 2.days.from_now)
        revision.published_until = 1.day.from_now

        expect(revision).to have(:no).errors_on(:published_until)
      end

      it 'can be reset if revision is published' do
        revision = create(:revision, :published, :published_until => 2.days.from_now)
        revision.published_until = nil

        expect(revision).to have(:no).errors_on(:published_until)
      end

      it 'can change if revision was published indefinately' do
        revision = create(:revision, :published, :published_until => nil)
        revision.published_until = 1.day.ago

        expect(revision).to have(:no).errors_on(:published_until)
      end
    end

    describe '#created_with' do
      it 'returns :publish for published revision' do
        revision = create(:revision, :published)

        expect(revision.created_with).to eq(:publish)
      end

      it 'returns :restore for frozen revision' do
        revision = create(:revision, :frozen)

        expect(revision.created_with).to eq(:restore)
      end

      it 'returns :user for snapshot of user type' do
        revision = create(:revision, :frozen, :snapshot_type => 'user')

        expect(revision.created_with).to eq(:user)
      end

      it 'returns :auto for snapshot of auto type' do
        revision = create(:revision, :frozen, :snapshot_type => 'auto')

        expect(revision.created_with).to eq(:auto)
      end
    end

    describe '#copy' do
      it 'creates a new revision' do
        revision = create(:revision)

        expect {
          revision.copy
        }.to change { Revision.count }
      end

      it 'copies manual_start to new revision' do
        revision = create(:revision, :manual_start => true)

        copied_revision = revision.copy

        expect(copied_revision.manual_start).to eq(true)
      end

      it 'copies emphasize_chapter_beginning to new revision' do
        revision = create(:revision, :emphasize_chapter_beginning => true)

        copied_revision = revision.copy

        expect(copied_revision.emphasize_chapter_beginning).to eq(true)
      end

      it 'copies storylines to new revision' do
        revision = create(:revision)
        storyline = create(:storyline, :revision => revision, :configuration => {'some' => 'value'})

        copied_revision = revision.copy

        expect(copied_revision).to have(1).storyline
        expect(copied_revision.storylines.first).not_to eq(storyline)
        expect(copied_revision.storylines.first.configuration['some']).to eq('value')
      end

      it 'copies chapters to new revision' do
        revision = create(:revision)
        storyline = create(:storyline, :revision => revision)
        chapter = create(:chapter, :storyline => storyline, :title => 'Intro')

        copied_revision = revision.copy

        expect(revision).to have(1).chapter
        expect(copied_revision).to have(1).chapter
        expect(copied_revision.storylines.first).to have(1).chapter
        expect(copied_revision.storylines.first.chapters.first).not_to eq(chapter)
        expect(copied_revision.storylines.first.chapters.first.title).to eq('Intro')
      end

      it 'copies pages to new revision' do
        revision = create(:revision)
        storyline = create(:storyline, :revision => revision)
        chapter = create(:chapter, :storyline => storyline)
        page = create(:page, :chapter => chapter, :configuration => {'title' => 'Main'})

        copied_revision = revision.copy

        expect(copied_revision.storylines.first.chapters.first).to have(1).page
        expect(copied_revision.storylines.first.chapters.first.pages.first).not_to eq(page)
        expect(copied_revision.storylines.first.chapters.first.pages.first.configuration['title']).to eq('Main')
      end

      it 'copies file usages to new revision' do
        revision = create(:revision)
        storyline = create(:storyline, :revision => revision)
        chapter = create(:chapter, :storyline => storyline)
        image_file = create(:image_file)
        revision.file_usages.create!(:file => image_file)

        copied_revision = revision.copy

        expect(copied_revision).to have(1).file_usages
      end

      it 'passes copied revision to block before saving' do
        revision = create(:revision)

        copied_revision = revision.copy do |r|
          r.creator = create(:user)
          r.published_at = Time.now
        end

        expect(copied_revision.published_at).to eq(Time.now)
        expect(copied_revision).not_to be_changed
      end

      context 'with registered RevisionComponent' do
        class TestRevisionComponent < ActiveRecord::Base
          include RevisionComponent
          self.table_name = :test_revision_components
        end

        class RevisionTestPageType < PageType
          name :test

          def revision_components
            [TestRevisionComponent]
          end
        end

        it 'copies registered RevisionComponents' do
          Pageflow.config.page_types.register(RevisionTestPageType.new)
          revision = create(:revision)
          TestRevisionComponent.create!(revision: revision)

          copied_revision = revision.copy

          expect(TestRevisionComponent.all_for_revision(copied_revision)).not_to be_empty
        end
      end
    end

    describe '#depublish_all' do
      it 'depublishes all revisions' do
        revision = create(:revision, :published, :published_at => 1.day.ago)

        Revision.depublish_all

        expect(revision.reload).not_to be_published
      end

      it 'sets published_until of all published revisions' do
        revision = create(:revision, :published, :published_at => 1.day.ago)

        Revision.depublish_all

        expect(revision.reload.published_until).to eq(Time.now)
      end

      it 'sets published_until of all published revisions with future published_until attribute' do
        revision = create(:revision, :published, :published_at => 1.day.ago, :published_until => 1.month.from_now)

        Revision.depublish_all

        expect(revision.reload.published_until).to eq(Time.now)
      end

      it 'does not override published_until of depublished revisions' do
        revision = create(:revision, :published, :published_at => 2.months.ago, :published_until => 1.month.ago)

        Revision.depublish_all

        expect(revision.reload.published_until).to eq(1.month.ago)
      end
    end

    describe '#find_files' do
      it 'returns files of given type' do
        entry = create(:entry)
        revision = entry.draft
        image_file = create(:image_file)
        revision.image_files << image_file

        result = revision.find_files(Pageflow::ImageFile)

        expect(result).to eq([image_file])
      end

      it 'does not return files of other type' do
        entry = create(:entry)
        revision = entry.draft
        image_file = create(:image_file)
        revision.image_files << image_file

        result = revision.find_files(Pageflow::VideoFile)

        expect(result).to eq([])
      end

      it 'includes usage_ids' do
        entry = create(:entry)
        revision = entry.draft
        image_file = create(:image_file)
        revision.image_files << image_file

        result = revision.find_files(Pageflow::ImageFile)

        expect(result.first.usage_id).to be_present
      end
    end

    describe '#pages' do
      it 'orders by storyline position first then by chapter and page position' do
        revision = create(:revision)
        storyline_1 = create(:storyline, :revision => revision, :position => 1)
        storyline_2 = create(:storyline, :revision => revision, :position => 2)
        chapter_1 = create(:chapter, :storyline => storyline_1, :position => 1)
        chapter_2 = create(:chapter, :storyline => storyline_1, :position => 2)
        chapter_3 = create(:chapter, :storyline => storyline_2, :position => 1)
        page_1 = create(:page, :chapter => chapter_1, :position => 1)
        page_2 = create(:page, :chapter => chapter_1, :position => 2)
        page_3 = create(:page, :chapter => chapter_2, :position => 1)
        page_4 = create(:page, :chapter => chapter_3, :position => 1)

        pages = revision.pages

        expect(pages[0]).to eq(page_1)
        expect(pages[1]).to eq(page_2)
        expect(pages[2]).to eq(page_3)
        expect(pages[3]).to eq(page_4)
      end
    end

    describe '#main_storyline_chapters' do
      it 'returns chapters of first storyline' do
        revision = create(:revision)
        storyline_1 = create(:storyline, revision: revision, position: 1)
        storyline_2 = create(:storyline, revision: revision, position: 2)
        chapter_1 = create(:chapter, storyline: storyline_1, position: 2)
        chapter_2 = create(:chapter, storyline: storyline_1, position: 1)
        create(:chapter, storyline: storyline_2, position: 1)

        chapters = revision.main_storyline_chapters

        expect(chapters.size).to eq(2)
        expect(chapters[0]).to eq(chapter_2)
        expect(chapters[1]).to eq(chapter_1)
      end

      it 'uses position to get first storyline' do
        revision = create(:revision)
        create(:storyline, revision: revision, position: 2)
        storyline_2 = create(:storyline, revision: revision, position: 1)
        chapter_1 = create(:chapter, storyline: storyline_2, position: 2)

        chapters = revision.main_storyline_chapters

        expect(chapters[0]).to eq(chapter_1)
      end

      it 'returns empty scope if no storyline is present' do
        revision = create(:revision)

        chapters = revision.main_storyline_chapters

        expect(chapters.size).to eq(0)
      end
    end

    describe '.editable' do
      it 'includes draft revisions' do
        revision = create(:revision)

        expect(Revision.editable).to include(revision)
      end

      it 'does not include frozen revisions' do
        revision = create(:revision, :frozen)

        expect(Revision.editable).not_to include(revision)
      end
    end

    describe '.frozen' do
      it 'does not invclude draft revisions' do
        revision = create(:revision)

        expect(Revision.frozen).not_to include(revision)
      end

      it 'includes frozen revisions' do
        revision = create(:revision, :frozen)

        expect(Revision.frozen).to include(revision)

      end
    end

    describe '.with_password_protection' do
      it 'includes revision with password_protected flag set to true' do
        revision = create(:revision, password_protected: true)

        result = Revision.with_password_protection

        expect(result).to include(revision)
      end

      it 'does not include revision without password_protected flag' do
        revision = create(:revision)

        result = Revision.with_password_protection

        expect(result).not_to include(revision)
      end

      it 'does not include revision with password_protected flag set to false' do
        revision = create(:revision, password_protected: false)

        result = Revision.with_password_protection

        expect(result).not_to include(revision)
      end
    end

    describe '.without_password_protection' do
      it 'includes revision without password_protected flag' do
        revision = create(:revision)

        result = Revision.without_password_protection

        expect(result).to include(revision)
      end

      it 'does not include revision with password_protected flag set to true' do
        revision = create(:revision, password_protected: true)

        result = Revision.without_password_protection

        expect(result).not_to include(revision)
      end

      it 'includes revision with password_protected flag set to false' do
        revision = create(:revision, password_protected: false)

        result = Revision.without_password_protection

        expect(result).to include(revision)
      end
    end

    describe '#image_files.with_usage_id' do
      it 'adds file_usage_id to image file record' do
        revision = create(:revision)
        image_file = create(:image_file)
        usage = create(:file_usage, :revision => revision, :file => image_file)

        image_file_record = revision.image_files.with_usage_id.first

        expect(image_file_record.usage_id).to eq(usage.id)
      end
    end

    describe '#audio_files.with_usage_id' do
      it 'adds file_usage_id to audio file record' do
        revision = create(:revision)
        audio_file = create(:audio_file)
        usage = create(:file_usage, :revision => revision, :file => audio_file)

        audio_file_record = revision.audio_files.with_usage_id.first

        expect(audio_file_record.usage_id).to eq(usage.id)
      end
    end

    describe '#locale' do
      it 'falls back to default_locale' do
        revision = build(:revision, locale: '')

        expect(revision.locale).to eq(I18n.default_locale)
      end

      it 'returns present attribute' do
        revision = build(:revision, locale: 'fr')

        expect(revision.locale).to eq('fr')
      end
    end
  end
end
