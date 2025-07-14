require 'spec_helper'
require 'support/shared_contexts/cache_versioning'

module Pageflow
  describe PublishedEntry do
    include UsedFileTestHelper

    describe '#title' do
      let(:entry) { create(:entry, title: 'Metropolis') }
      let(:published_entry) { PublishedEntry.new(entry) }

      it 'is fetched from the revision when present' do
        create(:revision, :published, entry:, title: 'Blade Runner')
        expect(published_entry.title).to eq('Blade Runner')
      end

      it 'is fetched from the entry when absent from the revision' do
        create(:revision, :published, entry:, title: '')
        expect(published_entry.title).to eq('Metropolis')
      end
    end

    describe '#thumbnail_file' do
      it 'returns positioned share image of published revision' do
        entry = PublishedEntry.new(create(:entry, :published))
        image_file = create_used_file(:image_file, entry:)
        entry.revision.share_image_id = image_file.perma_id
        entry.revision.share_image_x = 10
        entry.revision.share_image_y = 30

        expect(entry.thumbnail_file).to eq(image_file)
        expect(entry.thumbnail_file.position_x).to eq(10)
        expect(entry.thumbnail_file.position_y).to eq(30)
      end

      it 'returns positioned thumbnail file of first page of published revision' do
        entry = PublishedEntry.new(create(:entry, :published))
        image_file = create_used_file(:image_file, entry:)
        storyline = create(:storyline, revision: entry.revision)
        chapter = create(:chapter, storyline:)
        create(:page, chapter:, configuration: {
                 'background_image_id' => image_file.perma_id,
                 'background_image_x' => 20,
                 'background_image_y' => 40
               })

        expect(entry.thumbnail_file).to eq(image_file)
        expect(entry.thumbnail_file.position_x).to eq(20)
        expect(entry.thumbnail_file.position_y).to eq(40)
      end

      it 'returns blank null positioned file for published revision without pages' do
        entry = PublishedEntry.new(create(:entry, :published))

        expect(entry.thumbnail_file).to be_blank
        expect(entry.thumbnail_file.position_x).to eq(50)
        expect(entry.thumbnail_file.position_y).to eq(50)
      end
    end

    describe '#thumbnail_url' do
      it 'returns thumbnail of first page of published revision' do
        entry = PublishedEntry.new(create(:entry, :published))
        image_file = create_used_file(:image_file, entry:)
        storyline = create(:storyline, revision: entry.revision)
        chapter = create(:chapter, storyline:)
        page = create(:page, chapter:, configuration: {
                        'background_image_id' => image_file.perma_id
                      })

        page_thumbnail = ThumbnailFileResolver.new(entry, page.page_type.thumbnail_candidates,
                                                   page.configuration)
                                              .find_thumbnail

        expect(entry.thumbnail_url).to eq(page_thumbnail.thumbnail_url)
      end

      it 'returns blank attachment for published revision without pages' do
        entry = create(:entry)
        revision = create(:revision, :published, entry:)
        published_entry = PublishedEntry.new(entry)

        expect(published_entry.thumbnail_url).to eq(ImageFile.new.attachment.url)
      end
    end

    describe '#cache_key' do
      include_context 'cache versioning'

      describe 'with cache_versioning' do
        before(:each) { enable_cache_versioning }

        it 'is different for different revisions' do
          entry = create(:entry)
          create(:revision, :published, entry:)
          other_revision = create(:revision, entry:)
          published_entry = PublishedEntry.new(entry)
          other_published_entry = PublishedEntry.new(entry, other_revision)

          expect(published_entry.cache_key).not_to eq(other_published_entry)
        end

        it 'changes when different site is used' do
          entry = create(:entry)
          create(:revision, :published, entry:)
          published_entry = PublishedEntry.new(entry)

          expect {
            entry.update(site: create(:site))
          }.to(change { published_entry.cache_key })
        end
      end

      describe 'when cache_versioning' do
        before(:each) { disable_cache_versioning }

        it 'changes when entry changes' do
          entry = create(:entry)
          create(:revision, :published, entry:)
          published_entry = PublishedEntry.new(entry)

          expect {
            Timecop.freeze(1.minute.from_now) { entry.touch }
          }.to(change { published_entry.cache_key })
        end

        it 'changes when revision changes' do
          entry = create(:entry)
          revision = create(:revision, :published, entry:)
          published_entry = PublishedEntry.new(entry)

          expect {
            Timecop.freeze(1.minute.from_now) { revision.touch }
          }.to(change { published_entry.cache_key })
        end

        it 'changes when site changes' do
          entry = create(:entry)
          create(:revision, :published, entry:)
          published_entry = PublishedEntry.new(entry)

          expect {
            Timecop.freeze(1.minute.from_now) { entry.site.touch }
          }.to(change { published_entry.cache_key })
        end
      end
    end

    describe '#cache_version' do
      include_context 'cache versioning'

      describe 'with cache_versioning' do
        before(:each) { enable_cache_versioning }

        it 'changes when entry changes' do
          entry = create(:entry)
          create(:revision, :published, entry:)
          published_entry = PublishedEntry.new(entry)

          expect {
            Timecop.freeze(1.minute.from_now) { entry.touch }
          }.to(change { published_entry.cache_version })
        end

        it 'changes when revision changes' do
          entry = create(:entry)
          revision = create(:revision, :published, entry:)
          published_entry = PublishedEntry.new(entry)

          expect {
            Timecop.freeze(1.minute.from_now) { revision.touch }
          }.to(change { published_entry.cache_version })
        end

        it 'changes when site changes' do
          entry = create(:entry)
          create(:revision, :published, entry:)
          published_entry = PublishedEntry.new(entry)

          expect {
            Timecop.freeze(1.minute.from_now) { entry.site.touch }
          }.to(change { published_entry.cache_version })
        end
      end

      describe 'without cache_versioning' do
        before(:each) { disable_cache_versioning }

        it 'returns nil' do
          entry = create(:entry)
          create(:revision, :published, entry:)
          published_entry = PublishedEntry.new(entry)

          expect(published_entry.cache_version).to eq(nil)
        end
      end
    end

    describe '#stylesheet_model' do
      it 'returns entry if no revision was passed to constructor' do
        entry = create(:entry)
        revision = create(:revision, entry:)
        published_entry = PublishedEntry.new(entry)

        expect(published_entry.stylesheet_model).to be(entry)
      end

      it 'returns revision if custom revision was passed to constructor' do
        entry = create(:entry)
        revision = create(:revision, entry:)
        published_entry = PublishedEntry.new(entry, revision)

        expect(published_entry.stylesheet_model).to be(revision)
      end
    end

    describe '#translations' do
      it 'returns published entries for published translations of entry' do
        entry = create(:entry, :published)
        translation = create(:entry, :published)
        entry.mark_as_translation_of(translation)
        published_entry = PublishedEntry.new(entry)

        result = published_entry.translations

        expect(result.length).to eq(2)
        expect(result[0]).to be_kind_of(PublishedEntry)
        expect(result[0].title).to eq(entry.title)
        expect(result[1]).to be_kind_of(PublishedEntry)
        expect(result[1].title).to eq(translation.title)
      end

      it 'filters out non-published entries' do
        entry = create(:entry, :published)
        translation = create(:entry)
        entry.mark_as_translation_of(translation)
        published_entry = PublishedEntry.new(entry)

        result = published_entry.translations

        expect(result.length).to eq(1)
        expect(result[0].title).to eq(entry.title)
      end

      it 'filters out password protected entries' do
        entry = create(:entry, :published)
        translation = create(:entry, :published_with_password)
        entry.mark_as_translation_of(translation)
        published_entry = PublishedEntry.new(entry)

        result = published_entry.translations

        expect(result.length).to eq(1)
        expect(result[0].title).to eq(entry.title)
      end

      it 'does not filter out password protected entries if entry is published with password' do
        entry = create(:entry, :published_with_password)
        translation = create(:entry, :published_with_password)
        entry.mark_as_translation_of(translation)
        published_entry = PublishedEntry.new(entry)

        result = published_entry.translations

        expect(result.length).to eq(2)
        expect(result[0].title).to eq(entry.title)
        expect(result[1].title).to eq(translation.title)
      end

      it 'filters out non-published entries if entry is published with password' do
        entry = create(:entry, :published_with_password)
        translation = create(:entry)
        entry.mark_as_translation_of(translation)
        published_entry = PublishedEntry.new(entry)

        result = published_entry.translations

        expect(result.length).to eq(1)
        expect(result[0].title).to eq(entry.title)
      end

      it 'filters out noindex entries' do
        entry = create(:entry, :published)
        translation = create(:entry, :published_with_noindex)
        entry.mark_as_translation_of(translation)
        published_entry = PublishedEntry.new(entry)

        result = published_entry.translations

        expect(result.length).to eq(1)
        expect(result[0].title).to eq(entry.title)
      end

      it 'filters out noindex entries if entry is published with password' do
        entry = create(:entry, :published_with_password)
        translation = create(:entry, :published_with_noindex)
        entry.mark_as_translation_of(translation)
        published_entry = PublishedEntry.new(entry)

        result = published_entry.translations

        expect(result.length).to eq(1)
        expect(result[0].title).to eq(entry.title)
      end

      describe 'with include_noindex' do
        it 'includes noindex entries' do
          entry = create(:entry, :published)
          translation = create(:entry, :published_with_noindex)
          entry.mark_as_translation_of(translation)
          published_entry = PublishedEntry.new(entry)

          result = published_entry.translations(include_noindex: true)

          expect(result.length).to eq(2)
          expect(result[0].title).to eq(entry.title)
          expect(result[1].title).to eq(translation.title)
        end

        it 'filters out non-published entries' do
          entry = create(:entry, :published)
          translation = create(:entry)
          entry.mark_as_translation_of(translation)
          published_entry = PublishedEntry.new(entry)

          result = published_entry.translations(include_noindex: true)

          expect(result.length).to eq(1)
          expect(result[0].title).to eq(entry.title)
        end

        it 'filters out password protected entries' do
          entry = create(:entry, :published)
          translation = create(:entry, :published_with_password)
          entry.mark_as_translation_of(translation)
          published_entry = PublishedEntry.new(entry)

          result = published_entry.translations(include_noindex: true)

          expect(result.length).to eq(1)
          expect(result[0].title).to eq(entry.title)
        end

        it 'does not filter out password protected entries if entry is published with password' do
          entry = create(:entry, :published_with_password)
          translation = create(:entry, :published_with_password)
          entry.mark_as_translation_of(translation)
          published_entry = PublishedEntry.new(entry)

          result = published_entry.translations(include_noindex: true)

          expect(result.length).to eq(2)
          expect(result[0].title).to eq(entry.title)
          expect(result[1].title).to eq(translation.title)
        end

        it 'filters out non-published entries for password protected entry' do
          entry = create(:entry, :published_with_password)
          translation = create(:entry)
          entry.mark_as_translation_of(translation)
          published_entry = PublishedEntry.new(entry)

          result = published_entry.translations(include_noindex: true)

          expect(result.length).to eq(1)
          expect(result[0].title).to eq(entry.title)
        end
      end

      it 'supports using drafts' do
        entry = create(:entry, :published)
        published_translation = create(:entry, :published)
        draft_translation = create(:entry)
        entry.mark_as_translation_of(published_translation)
        entry.mark_as_translation_of(draft_translation)
        published_entry = PublishedEntry.new(entry, entry.draft)

        result = published_entry.translations

        expect(result.length).to eq(3)
        expect(result[0]).to be_kind_of(PublishedEntry)
        expect(result[0].title).to eq(entry.title)
        expect(result[1]).to be_kind_of(PublishedEntry)
        expect(result[1].title).to eq(published_translation.title)
        expect(result[2]).to be_kind_of(PublishedEntry)
        expect(result[2].title).to eq(draft_translation.title)
      end

      it 'allows modifying the entries scope' do
        entry = create(:entry, :published)
        translation = create(:entry, :published, permalink_attributes: {slug: 'some-slug'})
        entry.mark_as_translation_of(translation)
        published_entry = PublishedEntry.new(entry)

        result = published_entry.translations(-> { preload(:permalink) })

        expect(result[0].entry.association(:permalink).loaded?).to eq(true)
      end

      it 'uses already preloaded published translations' do
        entry = create(:entry, :published)
        translation = create(:entry, :published, permalink_attributes: {slug: 'some-slug'})
        entry.mark_as_translation_of(translation)
        published_entry = PublishedEntry.new(
          Entry.preload(translation_group: {publicly_visible_entries: :permalink}).find(entry.id)
        )

        result = published_entry.translations

        expect(result[0].entry.association(:permalink).loaded?).to eq(true)
      end
    end

    describe '.find' do
      it 'finds published entry' do
        entry = create(:entry, :published)

        expect(PublishedEntry.find(entry.id).to_model).to eq(entry)
      end

      it 'finds entry in scope' do
        account = create(:account)
        entry = create(:entry, :published, account:)

        expect(PublishedEntry.find(entry.id, account.entries).to_model).to eq(entry)
      end

      it 'does not find entries not in scope' do
        account = create(:account)
        entry = create(:entry, :published)

        expect {
          PublishedEntry.find(entry.id, account.entries)
        }.to raise_error(ActiveRecord::RecordNotFound)
      end

      it 'does not find not published entries' do
        entry = create(:entry)

        expect {
          PublishedEntry.find(entry.id)
        }.to raise_error(ActiveRecord::RecordNotFound)
      end
    end

    describe '.find_by_permalink' do
      it 'finds entry based on permalink slug in root directory' do
        entry = create(
          :entry,
          :published,
          permalink_attributes: {
            slug: 'permalink-slug'
          }
        )

        result = PublishedEntry.find_by_permalink(
          slug: 'permalink-slug', scope: Entry
        )

        expect(result.id).to eq(entry.id)
      end

      it 'finds entry based on permalink slug and directory' do
        entry = create(
          :entry,
          :published,
          permalink_attributes: {
            slug: 'permalink-slug',
            directory_path: 'en/'
          }
        )

        result = PublishedEntry.find_by_permalink(
          directory: 'en/', slug: 'permalink-slug', scope: Entry
        )

        expect(result&.to_model).to eq(entry)
      end

      it 'can tell entries with same slug in different directories apart' do
        root_entry = create(
          :entry,
          :published,
          permalink_attributes: {
            slug: 'permalink-slug',
            directory_path: ''
          }
        )
        directory_entry = create(
          :entry,
          :published,
          permalink_attributes: {
            slug: 'permalink-slug',
            directory_path: 'en/'
          }
        )

        root_result = PublishedEntry.find_by_permalink(
          slug: 'permalink-slug', scope: Entry
        )
        directory_result = PublishedEntry.find_by_permalink(
          directory: 'en/', slug: 'permalink-slug', scope: Entry
        )

        expect(root_result&.to_model).to eq(root_entry)
        expect(directory_result&.to_model).to eq(directory_entry)
      end

      it 'returns nil if not found' do
        result = PublishedEntry.find_by_permalink(
          slug: 'not-there', scope: Entry
        )

        expect(result).to be_nil
      end

      it 'finds entry in scope' do
        account = create(:account)
        entry = create(
          :entry,
          :published,
          account:,
          permalink_attributes: {
            slug: 'permalink-slug'
          }
        )

        result = PublishedEntry.find_by_permalink(
          slug: 'permalink-slug', scope: account.entries
        )

        expect(result.id).to eq(entry.id)
      end

      it 'does not find entries not in scope' do
        account = create(:account)
        create(
          :entry,
          :published,
          permalink_attributes: {
            slug: 'permalink-slug'
          }
        )

        result = PublishedEntry.find_by_permalink(
          slug: 'permalink-slug', scope: account.entries
        )

        expect(result).to be_nil
      end

      it 'does not find not published entries' do
        create(
          :entry,
          permalink_attributes: {
            slug: 'permalink-slug'
          }
        )

        result = PublishedEntry.find_by_permalink(
          slug: 'permalink-slug', scope: Entry
        )

        expect(result).to be_nil
      end
    end

    describe '.find_by_permalink_redirect' do
      it 'finds entry based on permalink slug in root directory' do
        entry = create(
          :entry,
          :published,
          permalink_attributes: {
            slug: 'old-slug'
          }
        )
        entry.update(
          permalink_attributes: {
            slug: 'new-slug'
          }
        )

        result = PublishedEntry.find_by_permalink_redirect(
          site: entry.site,
          slug: 'old-slug'
        )

        expect(result).to be_kind_of(PublishedEntry)
        expect(result.id).to eq(entry.id)
      end

      it 'finds entry based on permalink slug and directory' do
        entry = create(
          :entry,
          :published,
          permalink_attributes: {
            slug: 'old-slug',
            directory_path: 'en/'
          }
        )
        entry.update(
          permalink_attributes: {
            slug: 'new-slug'
          }
        )

        result = PublishedEntry.find_by_permalink_redirect(
          site: entry.site,
          directory: 'en/',
          slug: 'old-slug'
        )

        expect(result.id).to eq(entry.id)
      end

      it 'does not find not published entries' do
        entry = create(
          :entry,
          permalink_attributes: {
            slug: 'old-slug',
            directory_path: 'en/'
          }
        )
        entry.update(
          permalink_attributes: {
            slug: 'new-slug'
          }
        )

        result = PublishedEntry.find_by_permalink_redirect(
          site: entry.site,
          directory: 'en/',
          slug: 'old-slug'
        )

        expect(result).to be_nil
      end
    end

    describe '#wrap_all' do
      it 'returns array of published entries for all entries in scope' do
        create(:entry,
               :published,
               published_revision_attributes: {title: 'Story One'})
        create(:entry,
               :published,
               published_revision_attributes: {title: 'Story Two'})
        create(:entry)

        result = detect_n_plus_one_queries do
          PublishedEntry.wrap_all(Entry.published)
        end

        expect(result.map(&:title)).to eq(['Story One', 'Story Two'])
      end
    end
  end
end
