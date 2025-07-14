require 'spec_helper'

module Pageflow
  RSpec.describe MetaTagsHelper, type: :helper do
    let(:entry) { create(:entry, :published) }
    let(:published_entry) { PublishedEntry.new(entry) }

    def html
      helper.meta_tags_for_entry(published_entry)
    end

    describe 'keywords' do
      it 'has default value from configuration' do
        expect(html).to have_css(
          %(meta[content="pageflow, multimedia, reportage"][name="keywords"]),
          visible: false,
          count: 1
        )
      end

      it 'can have default set in configuration' do
        pageflow_configure { |config| config.default_keywords_meta_tag = 'story, environment' }

        expect(html).to have_css(
          %(meta[content="story, environment"][name="keywords"]),
          visible: false,
          count: 1
        )
      end

      it 'can be overriden per revision' do
        entry.published_revision.update! keywords: 'longform, journalism'

        expect(html).to have_css(
          %(meta[content="longform, journalism"][name="keywords"]),
          visible: false,
          count: 1
        )
      end
    end

    describe 'author' do
      it 'has default value from configuration' do
        expect(html).to have_css(
          %(meta[content="Pageflow"][name="author"]),
          visible: false,
          count: 1
        )
      end

      it 'can have default set in configuration' do
        pageflow_configure { |config| config.default_author_meta_tag = 'Prof. Dr. Sahra Isak' }

        expect(html).to have_css(
          %(meta[content="Prof. Dr. Sahra Isak"][name="author"]),
          visible: false,
          count: 1
        )
      end

      it 'can be overriden per revision' do
        entry.published_revision.update! author: 'Henri zu Walter'

        expect(html).to have_css(
          %(meta[content="Henri zu Walter"][name="author"]),
          visible: false,
          count: 1
        )
      end
    end

    describe 'publisher' do
      it 'has default value from configuration' do
        expect(html).to have_css(
          %(meta[content="Pageflow"][name="publisher"]),
          visible: false,
          count: 1
        )
      end

      it 'can have default set in configuration' do
        pageflow_configure { |config| config.default_publisher_meta_tag = 'Kempe-Heuck' }

        expect(html).to have_css(
          %(meta[content="Kempe-Heuck"][name="publisher"]),
          visible: false,
          count: 1
        )
      end

      it 'can be overriden per revision' do
        entry.published_revision.update! publisher: 'Adams, Kähler und Tafelmeier'

        expect(html).to have_css(
          %(meta[content="Adams, Kähler und Tafelmeier"][name="publisher"]),
          visible: false,
          count: 1
        )
      end
    end

    describe 'robots' do
      it 'does not set robots tag by default' do
        published_entry = create(:published_entry)

        html = helper.meta_tags_for_entry(published_entry)

        expect(html)
          .not_to have_css(%(meta[name="robots"]), visible: false)
      end

      it 'sets robots tag for entry published with noindex' do
        published_entry = create(:published_entry,
                                 revision_attributes: {noindex: true})

        html = helper.meta_tags_for_entry(published_entry)

        expect(html)
          .to have_css(%(meta[content="noindex"][name="robots"]),
                       visible: false)
      end
    end
  end
end
