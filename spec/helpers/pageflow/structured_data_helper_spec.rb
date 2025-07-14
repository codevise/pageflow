require 'spec_helper'

require 'pageflow/matchers/have_json_ld'

module Pageflow
  describe StructuredDataHelper do
    include UsedFileTestHelper

    it 'renders structured data for entry' do
      first_publication_date = 1.month.ago
      last_publication_date = 3.days.ago

      entry = PublishedEntry.new(create(:entry, :published,
                                        first_published_at: first_publication_date))
      image_file = create_used_file(:image_file, entry:, file_name: 'share.jpg')
      entry.revision.update(title: 'Some entry',
                            summary: 'Summary text',
                            author: 'Some author',
                            publisher: 'Some publisher',
                            keywords: 'Some, key, words',
                            share_url: '//example.com',
                            share_image_id: image_file.perma_id,
                            published_at: last_publication_date)

      html = helper.structured_data_for_entry(entry)

      expect(html).to have_json_ld('@context' => 'http://schema.org',
                                   '@type' => 'Article',
                                   'headline' => 'Some entry',
                                   'url' => 'https://example.com',
                                   'description' => 'Summary text',
                                   'author' => {
                                     '@type' => 'Organization',
                                     'name' => ['Some author']
                                   },
                                   'publisher' => {
                                     '@type' => 'Organization',
                                     'name' => ['Some publisher'],
                                     'logo' => {
                                       '@type' => 'ImageObject',
                                       'url' => a_string_including('default/logo_print')
                                     }
                                   },
                                   'keywords' => %w[Some key words],
                                   'datePublished' => first_publication_date.iso8601,
                                   'dateModified' => last_publication_date.iso8601,
                                   'articleSection' => 'longform',
                                   'mainEntityOfPage' => {
                                     '@type' => 'WebPage',
                                     '@id' => 'https://example.com'
                                   },
                                   'image' => {
                                     '@type' => 'ImageObject',
                                     'url' => image_file
                                       .thumbnail_url(:thumbnail_large),
                                     'width' => 560,
                                     'height' => 315
                                   },
                                   'thumbnailUrl' => image_file.thumbnail_url(:thumbnail_large))
    end

    it 'skips metadata if not present' do
      pageflow_configure do |config|
        config.default_keywords_meta_tag = ''
        config.default_author_meta_tag = ''
        config.default_publisher_meta_tag = ''
      end

      entry = create(:entry, :published)

      html = helper.structured_data_for_entry(PublishedEntry.new(entry))

      expect(html).not_to have_json_ld('keywords' => anything)
      expect(html).not_to have_json_ld('author' => anything)
      expect(html).not_to have_json_ld('publisher' => anything)
    end

    it 'falls back to default metadata from config' do
      pageflow_configure do |config|
        config.default_keywords_meta_tag = 'some keywords'
        config.default_author_meta_tag = 'some author'
        config.default_publisher_meta_tag = 'some publisher'
      end

      entry = create(:entry, :published)

      html = helper.structured_data_for_entry(PublishedEntry.new(entry))

      expect(html).to have_json_ld('keywords' => ['some keywords'],
                                   'author' => a_hash_including('name' => ['some author']),
                                   'publisher' => a_hash_including('name' => ['some publisher']))
    end

    it 'renders authors and publishers separated by commas as individual items' do
      entry = create(:entry,
                     :published,
                     published_revision_attributes: {
                       author: 'Alice Adminson, Alina Publisha, Ed Edison',
                       publisher: 'Alice Adminson, Alina Publisha, Ed Edison'
                     })

      html = helper.structured_data_for_entry(PublishedEntry.new(entry))

      expect(html).to have_json_ld('author' => a_hash_including('name' => ['Alice Adminson',
                                                                           'Alina Publisha',
                                                                           'Ed Edison']),
                                   'publisher' => a_hash_including('name' => ['Alice Adminson',
                                                                              'Alina Publisha',
                                                                              'Ed Edison']))
    end

    it 'skips image if share image not present' do
      entry = create(:entry, :published)

      html = helper.structured_data_for_entry(PublishedEntry.new(entry))

      expect(html).not_to have_json_ld('image' => a_hash_including('@type' => 'ImageObject'))
    end

    it 'skips thumbnailUrl if share image not present' do
      entry = create(:entry, :published)

      html = helper.structured_data_for_entry(PublishedEntry.new(entry))

      expect(html).not_to have_json_ld('thumbnailUrl' => a_string_including('image_files'))
    end
  end
end
