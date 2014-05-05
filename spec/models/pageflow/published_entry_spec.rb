require 'spec_helper'

module Pageflow
  describe PublishedEntry do
    describe '#thumbnail' do
      it 'returns thumbnail of first page of published revision' do
        entry = create(:entry)
        revision = create(:revision, :published, :entry => entry)
        chapter = create(:chapter, :revision => revision)
        page = create(:page, :chapter => chapter)
        published_entry = PublishedEntry.new(entry)

        expect(published_entry.thumbnail.url).to eq(page.thumbnail.url)
      end

      it 'returns blank attachment for published revision without pages' do
        entry = create(:entry)
        revision = create(:revision, :published, :entry => entry)
        published_entry = PublishedEntry.new(entry)

        expect(published_entry.thumbnail.url).to eq(ImageFile.new.processed_attachment.url)
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
  end
end
