require 'spec_helper'
require 'support/shared_contexts/cache_versioning'

module Pageflow
  describe PublishedEntry do
    include UsedFileTestHelper

    describe '#title' do
      let(:entry) { create(:entry, title: 'Metropolis') }
      let(:published_entry) { PublishedEntry.new(entry) }

      it 'is fetched from the revision when present' do
        create(:revision, :published, entry: entry, title: 'Blade Runner')
        expect(published_entry.title).to eq('Blade Runner')
      end

      it 'is fetched from the entry when absent from the revision' do
        create(:revision, :published, entry: entry, title: '')
        expect(published_entry.title).to eq('Metropolis')
      end
    end

    describe '#thumbnail_file' do
      it 'returns positioned share image of published revision' do
        entry = PublishedEntry.new(create(:entry, :published))
        image_file = create_used_file(:image_file, entry: entry)
        entry.revision.share_image_id = image_file.perma_id
        entry.revision.share_image_x = 10
        entry.revision.share_image_y = 30

        expect(entry.thumbnail_file).to eq(image_file)
        expect(entry.thumbnail_file.position_x).to eq(10)
        expect(entry.thumbnail_file.position_y).to eq(30)
      end

      it 'returns positioned thumbnail file of first page of published revision' do
        entry = PublishedEntry.new(create(:entry, :published))
        image_file = create_used_file(:image_file, entry: entry)
        storyline = create(:storyline, revision: entry.revision)
        chapter = create(:chapter, storyline: storyline)
        create(:page, chapter: chapter, configuration: {
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
        image_file = create_used_file(:image_file, entry: entry)
        storyline = create(:storyline, revision: entry.revision)
        chapter = create(:chapter, storyline: storyline)
        page = create(:page, chapter: chapter, configuration: {
                        'background_image_id' => image_file.perma_id
                      })

        page_thumbnail = ThumbnailFileResolver.new(entry, page.page_type.thumbnail_candidates, page.configuration)
                                              .find_thumbnail

        expect(entry.thumbnail_url).to eq(page_thumbnail.thumbnail_url)
      end

      it 'returns blank attachment for published revision without pages' do
        entry = create(:entry)
        revision = create(:revision, :published, :entry => entry)
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
          create(:revision, :published, entry: entry)
          other_revision = create(:revision, entry: entry)
          published_entry = PublishedEntry.new(entry)
          other_published_entry = PublishedEntry.new(entry, other_revision)

          expect(published_entry.cache_key).not_to eq(other_published_entry)
        end

        it 'changes when different theming is used' do
          entry = create(:entry)
          create(:revision, :published, entry: entry)
          published_entry = PublishedEntry.new(entry)

          expect {
            entry.update(theming: create(:theming))
          }.to(change { published_entry.cache_key })
        end
      end

      describe 'when cache_versioning' do
        before(:each) { disable_cache_versioning }

        it 'changes when entry changes' do
          entry = create(:entry)
          create(:revision, :published, entry: entry)
          published_entry = PublishedEntry.new(entry)

          expect {
            Timecop.freeze(1.minute.from_now) { entry.touch }
          }.to(change { published_entry.cache_key })
        end

        it 'changes when revision changes' do
          entry = create(:entry)
          revision = create(:revision, :published, entry: entry)
          published_entry = PublishedEntry.new(entry)

          expect {
            Timecop.freeze(1.minute.from_now) { revision.touch }
          }.to(change { published_entry.cache_key })
        end

        it 'changes when theming changes' do
          entry = create(:entry)
          create(:revision, :published, entry: entry)
          published_entry = PublishedEntry.new(entry)

          expect {
            Timecop.freeze(1.minute.from_now) { entry.theming.touch }
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
          create(:revision, :published, entry: entry)
          published_entry = PublishedEntry.new(entry)

          expect {
            Timecop.freeze(1.minute.from_now) { entry.touch }
          }.to(change { published_entry.cache_version })
        end

        it 'changes when revision changes' do
          entry = create(:entry)
          revision = create(:revision, :published, entry: entry)
          published_entry = PublishedEntry.new(entry)

          expect {
            Timecop.freeze(1.minute.from_now) { revision.touch }
          }.to(change { published_entry.cache_version })
        end

        it 'changes when theming changes' do
          entry = create(:entry)
          create(:revision, :published, entry: entry)
          published_entry = PublishedEntry.new(entry)

          expect {
            Timecop.freeze(1.minute.from_now) { entry.theming.touch }
          }.to(change { published_entry.cache_version })
        end
      end

      describe 'without cache_versioning' do
        before(:each) { disable_cache_versioning }

        it 'returns nil' do
          entry = create(:entry)
          create(:revision, :published, entry: entry)
          published_entry = PublishedEntry.new(entry)

          expect(published_entry.cache_version).to eq(nil)
        end
      end
    end

    describe '#stylesheet_model' do
      it 'returns entry if no revision was passed to constructor' do
        entry = create(:entry)
        revision = create(:revision, :entry => entry)
        published_entry = PublishedEntry.new(entry)

        expect(published_entry.stylesheet_model).to be(entry)
      end

      it 'returns revision if custom revision was passed to constructor' do
        entry = create(:entry)
        revision = create(:revision, :entry => entry)
        published_entry = PublishedEntry.new(entry, revision)

        expect(published_entry.stylesheet_model).to be(revision)
      end
    end

    describe '.find' do
      it 'finds published entry' do
        entry = create(:entry, :published)

        expect(PublishedEntry.find(entry.id).to_model).to eq(entry)
      end

      it 'finds entry in scope' do
        account = create(:account)
        entry = create(:entry, :published, account: account)

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
  end
end
