require 'spec_helper'

module Pageflow
  describe StructuredDataHelper do
    it 'renders structured data for entry' do
      first_publication_date = 1.month.ago
      last_publication_date = 3.days.ago
      image_file = create(:image_file, file_name: 'share.jpg')
      entry = create(:entry,
                     :published,
                     first_published_at: first_publication_date,
                     published_revision_attributes: {
                       title: 'Some entry',
                       summary: 'Summary text',
                       author: 'Some author',
                       publisher: 'Some publisher',
                       keywords: 'Some, key, words',
                       share_url: '//example.com',
                       share_image_id: image_file.id,
                       published_at: last_publication_date
                     })

      html = helper.structured_data_for_entry(PublishedEntry.new(entry))

      expect(html).to have_json_ld('@context' => 'http://schema.org',
                                   '@type' => 'Article',
                                   'headline' => 'Some entry',
                                   'description' => 'Summary text',
                                   'author' => {
                                     '@type' => 'Organization',
                                     'name' => 'Some author'
                                   },
                                   'publisher' => {
                                     '@type' => 'Organization',
                                     'name' => 'Some publisher',
                                     'logo' => {
                                       '@type' => 'ImageObject',
                                       'url' => a_string_including('default/logo_print')
                                     }
                                   },
                                   'keywords' => 'Some, key, words',
                                   'datePublished' => first_publication_date.iso8601,
                                   'dateModified' => last_publication_date.iso8601,
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
                                   })
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

      expect(html).to have_json_ld('keywords' => 'some keywords',
                                   'author' => a_hash_including('name' => 'some author'),
                                   'publisher' => a_hash_including('name' => 'some publisher'))
    end

    it 'skips image if share image not present' do
      entry = create(:entry, :published)

      html = helper.structured_data_for_entry(PublishedEntry.new(entry))

      expect(html).not_to have_json_ld('image' => a_hash_including('@type' => 'ImageObject'))
    end

    it 'renders nothing if feature is disabled' do
      entry = create(:entry, :published, without_feature: 'structured_data')

      html = helper.structured_data_for_entry(PublishedEntry.new(entry))

      expect(html).not_to have_json_ld('@type' => 'Article')
    end
  end
end
