require 'spec_helper'

module PageflowScrolled
  RSpec.describe ChapterSlugs do
    it 'returns slugified title' do
      chapters = [build(:scrolled_chapter, perma_id: 100, configuration: {title: 'My Chapter'})]

      expect(ChapterSlugs.new(chapters).to_h[100]).to eq('my-chapter')
    end

    it 'returns chapter-permaId for empty title' do
      chapters = [build(:scrolled_chapter, perma_id: 100, configuration: {title: ''})]

      expect(ChapterSlugs.new(chapters).to_h[100]).to eq('chapter-100')
    end

    it 'returns chapter-permaId for missing title' do
      chapters = [build(:scrolled_chapter, perma_id: 100, configuration: {})]

      expect(ChapterSlugs.new(chapters).to_h[100]).to eq('chapter-100')
    end

    it 'returns chapter-permaId for title without characters allowed in slugs' do
      chapters = [build(:scrolled_chapter, perma_id: 100, configuration: {title: '中文标题'})]

      expect(ChapterSlugs.new(chapters).to_h[100]).to eq('chapter-100')
    end

    it 'appends permaId if slug would not be unique' do
      chapters = [
        build(:scrolled_chapter, perma_id: 100, configuration: {title: 'Same Title'}),
        build(:scrolled_chapter, perma_id: 200, configuration: {title: 'Same Title'})
      ]

      slugs = ChapterSlugs.new(chapters).to_h

      expect(slugs[100]).to eq('same-title')
      expect(slugs[200]).to eq('same-title-200')
    end

    it 'handles special characters' do
      chapters = [build(:scrolled_chapter,
                        perma_id: 100,
                        configuration: {title: 'Über uns & mehr!'})]

      expect(ChapterSlugs.new(chapters).to_h[100]).to eq('ueber-uns-und-mehr')
    end
  end
end
