require 'spec_helper'

module Pageflow
  describe PublishedEntry do
    describe '#thumbnail_file' do
      it 'returns positioned share image of published revision' do
        entry = create(:entry)
        image_file = create(:image_file)
        revision = create(:revision,
                          :published,
                          :entry => entry,
                          :share_image_id => image_file.id,
                          :share_image_x => 10,
                          :share_image_y => 30)
        chapter = create(:chapter, :revision => revision)
        page = create(:page, :chapter => chapter)
        published_entry = PublishedEntry.new(entry)

        expect(published_entry.thumbnail_file).to eq(image_file)
        expect(published_entry.thumbnail_file.position_x).to eq(10)
        expect(published_entry.thumbnail_file.position_y).to eq(30)
      end

      it 'returns positioned thumbnail file of first page of published revision' do
        entry = create(:entry)
        revision = create(:revision, :published, :entry => entry)
        chapter = create(:chapter, :revision => revision)
        image_file = create(:image_file)
        page = create(:page, :chapter => chapter, :configuration => {
                        'background_image_id' => image_file.id,
                        'background_image_x' => 20,
                        'background_image_y' => 40
                      })
        published_entry = PublishedEntry.new(entry)

        expect(published_entry.thumbnail_file).to eq(image_file)
        expect(published_entry.thumbnail_file.position_x).to eq(20)
        expect(published_entry.thumbnail_file.position_y).to eq(40)
      end

      it 'returns blank null positioned file for published revision without pages' do
        entry = create(:entry)
        revision = create(:revision, :published, :entry => entry)
        published_entry = PublishedEntry.new(entry)

        expect(published_entry.thumbnail_file).to be_blank
        expect(published_entry.thumbnail_file.position_x).to eq(50)
        expect(published_entry.thumbnail_file.position_y).to eq(50)
      end
    end

    describe '#thumbnail_url' do
      it 'returns thumbnail of first page of published revision' do
        entry = create(:entry)
        revision = create(:revision, :published, :entry => entry)
        chapter = create(:chapter, :revision => revision)
        page = create(:page, :chapter => chapter)
        published_entry = PublishedEntry.new(entry)

        expect(published_entry.thumbnail_url).to eq(page.thumbnail_url)
      end

      it 'returns blank attachment for published revision without pages' do
        entry = create(:entry)
        revision = create(:revision, :published, :entry => entry)
        published_entry = PublishedEntry.new(entry)

        expect(published_entry.thumbnail_url).to eq(ImageFile.new.thumbnail_url)
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
